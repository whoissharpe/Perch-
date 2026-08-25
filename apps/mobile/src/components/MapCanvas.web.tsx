import { useEffect, useRef } from "react";
import { useColorScheme } from "react-native";
import maplibregl, { type Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { palette } from "@perch/core";
import {
  BIRD_ZOOM,
  LANDING,
  LANDING_MS,
  LANDING_STEP_MS,
  PERCH_ZOOM,
  birdUri,
  pinScale,
  type BirdTint,
} from "@/birdSprites";
import type { MapCanvasProps } from "./MapCanvas";

const STYLE = "https://tiles.openfreemap.org/styles/positron";


/** Big enough that the bench reads at a glance. */
const PIN_SIZE = 76;

/**
 * A real tile map for the browser preview — react-native-maps has no web
 * implementation, so this stands in with MapLibre.
 *
 * Positron is a pale grey basemap. The filter pulls it toward the Perch
 * bone-and-olive ground in light and inverts it for dark, so the map belongs
 * to the same design as everything drawn on top of it.
 */
const TINT = {
  // Warm bone with an olive cast, to match the earthy green palette.
  light:
    "saturate(0.5) sepia(0.34) hue-rotate(30deg) saturate(1.25) brightness(1.01)",
  // Invert to dark, then settle into a muted forest green — not black, and
  // not the harder pine the palette used to run on.
  dark:
    "invert(1) hue-rotate(180deg) grayscale(0.5) sepia(0.62) hue-rotate(62deg) saturate(1.7) brightness(0.66) contrast(1.04)",
};

interface Pin {
  id: string;
  marked: boolean;
  el: HTMLDivElement;
  inner: HTMLDivElement;
  dot: HTMLDivElement;
  bird: HTMLImageElement;
  mark: HTMLImageElement;
  open: HTMLImageElement;
  timers: number[];
  perched: boolean;
  selected: boolean;
  /** True while the landing sequence is running. */
  animating: boolean;
}

export function MapCanvas({ spots, selectedId, onSelect, me, follow }: MapCanvasProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const pins = useRef<Pin[]>([]);
  const meMarker = useRef<Marker | null>(null);
  const resizeObs = useRef<ResizeObserver | null>(null);

  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const c = palette[scheme];
  // On the pale map the pine drawing reads; on the dark one it vanishes.
  const tint: BirdTint = scheme === "dark" ? "paper" : "pine";

  /* create once */
  useEffect(() => {
    if (!host.current || map.current) return;

    const m = new maplibregl.Map({
      container: host.current,
      style: STYLE,
      center: [-9.1394, 38.7223],
      zoom: 13.4,
      attributionControl: false,
    });
    map.current = m;

    // Synthetic wheel events do not drive MapLibre's gesture handling, so this
    // handle is the only way to exercise zoom behaviour from a console or an
    // automated check. Exposed unconditionally because this whole file is the
    // browser preview — the shipped product is the native map next to it.
    if (typeof window !== "undefined") {
      (window as unknown as { __perchMap?: MapLibreMap }).__perchMap = m;
    }

    m.addControl(
      new maplibregl.AttributionControl({
        customAttribution: "© OpenStreetMap contributors (ODbL)",
        compact: true,
      }),
      "bottom-right",
    );

    m.on("click", () => onSelect(null));

    // MapLibre sizes its canvas once and does not watch the container. On a
    // phone that means a rotation, a keyboard, or any layout shift leaves the
    // canvas stale and the map renders as a black rectangle.
    const ro = new ResizeObserver(() => m.resize());
    ro.observe(host.current);
    resizeObs.current = ro;

    m.on("zoom", () => {
      const z = m.getZoom();
      const shouldPerch = z >= PERCH_ZOOM;

      pins.current.forEach((p, i) => {
        if (!p.marked) return;

        // Dot at city scale, bird above it — keeps them from colliding.
        applyZoom(p, z);

        if (p.perched === shouldPerch) return;
        p.perched = shouldPerch;
        // An open bird keeps its wings out; it re-settles when deselected.
        if (p.selected) return;
        if (shouldPerch) land(p, tintRef.current, i);
        else takeOff(p, tintRef.current);
      });
    });

    return () => {
      resizeObs.current?.disconnect();
      resizeObs.current = null;
      pins.current.forEach((p) => p.timers.forEach(clearTimeout));
      m.remove();
      map.current = null;
    };
  }, [onSelect]);

  /* keep the tint reachable from the zoom handler without re-binding it */
  const tintRef = useRef(tint);
  useEffect(() => {
    tintRef.current = tint;
  }, [tint]);

  /* theme tint — on the canvas itself, never getCanvasContainer(). The
     container also holds the markers, and inverting it turns every clay
     pin green. */
  useEffect(() => {
    const canvas = map.current?.getCanvas();
    if (canvas) canvas.style.filter = TINT[scheme];
  }, [scheme]);

  /* Build the pins. Deliberately NOT dependent on selectedId — rebuilding
     every marker on each tap tears down and re-adds eleven DOM nodes, which
     is what made selecting a bird flicker. Selection is applied by mutating
     the existing pins in the effect below. */
  useEffect(() => {
    const m = map.current;
    if (!m) return;

    pins.current.forEach((p) => p.timers.forEach(clearTimeout));
    markers.current.forEach((mk) => mk.remove());
    markers.current = [];
    pins.current = [];

    const perched = m.getZoom() >= PERCH_ZOOM;

    const layer = (extra: Partial<CSSStyleDeclaration> = {}) => {
      const img = document.createElement("img");
      Object.assign(img.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        objectFit: "contain",
        opacity: "0",
        pointerEvents: "none",
        transition: `opacity .28s linear, transform ${LANDING_STEP_MS}ms cubic-bezier(.32,.72,0,1)`,
        ...extra,
      });
      img.alt = "";
      return img;
    };

    spots.forEach((s) => {
      const marked = s.marks > 0;

      // MapLibre positions markers by writing `transform` on this root
      // element. Touching that transform ourselves detaches the pin from its
      // coordinate and it slides away as you zoom — so the root is left alone
      // and every visual transform goes on the inner wrapper.
      const el = document.createElement("div");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", s.name);
      el.style.cursor = "pointer";

      const inner = document.createElement("div");
      Object.assign(inner.style, {
        position: "relative",
        width: marked ? `${PIN_SIZE}px` : "14px",
        height: marked ? `${PIN_SIZE}px` : "14px",
        transform: "scale(1)",
        transformOrigin: "center bottom",
        transition: "transform .3s cubic-bezier(.32,.72,0,1)",
      });
      el.append(inner);

      if (!marked) {
        // Nobody has been here yet: a quiet hollow ring, no bird.
        Object.assign(inner.style, {
          borderRadius: "50%",
          border: `2px solid ${c.pine}`,
          background: "transparent",
        });
      }

      const bird = layer();
      const mark = layer();
      const open = layer();

      // The far-out representation: a small solid dot, so a city full of
      // spots reads as a scatter of points rather than a pile of birds.
      const dot = document.createElement("div");
      Object.assign(dot.style, {
        position: "absolute",
        left: "50%",
        bottom: "0",
        width: "11px",
        height: "11px",
        marginLeft: "-5.5px",
        borderRadius: "50%",
        background: c.clay,
        boxShadow: `0 0 0 4px ${c.clay}33`,
        opacity: "0",
        pointerEvents: "none",
        transition: "opacity .2s linear",
      });

      if (marked) {
        bird.src = birdUri(tint, "perched");
        mark.src = birdUri(tint, "mark");
        open.src = birdUri(tint, "open");
        inner.append(bird, mark, open, dot);
      }

      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        // Tapping the open bird closes it — otherwise it can never be put
        // back on its bench without tapping empty map.
        onSelect(selectedRef.current === s.id ? null : s.id);
      });

      pins.current.push({
        id: s.id,
        marked,
        el,
        inner,
        dot,
        bird,
        mark,
        open,
        timers: [],
        perched,
        selected: false,
        animating: false,
      });

      markers.current.push(
        new maplibregl.Marker({
          element: el,
          // The bird's feet and the bench legs sit at the bottom of the
          // sprite, so anchor there — the spot is the ground, not the sky.
          anchor: marked ? "bottom" : "center",
        })
          .setLngLat([s.lng, s.lat])
          .addTo(m),
      );
    });

    // Draw each new pin at whatever zoom the map is already at.
    const z = m.getZoom();
    pins.current.forEach((p) => {
      if (p.marked) applyZoom(p, z);
    });
  }, [spots, onSelect, c.pine, c.clay, tint]);

  /* Selection, applied by mutation so nothing is torn down. */
  const selectedRef = useRef<string | null>(selectedId);
  useEffect(() => {
    selectedRef.current = selectedId;

    pins.current.forEach((p) => {
      if (!p.marked) return;
      const on = p.id === selectedId;
      if (p.selected === on) return;
      p.selected = on;

      const z = map.current?.getZoom() ?? PERCH_ZOOM;

      if (on) {
        // Wings wide, facing you — the tell for which post is open below.
        p.open.style.opacity = "1";
        p.bird.style.opacity = "0";
        p.mark.style.opacity = "0";
      } else {
        p.open.style.opacity = "0";
      }
      // Restores the dot / bird / bench state and the zoom-appropriate size.
      applyZoom(p, z);
    });
  }, [selectedId]);

  /* the user's own position */
  useEffect(() => {
    const m = map.current;
    if (!m) return;

    if (!me) {
      meMarker.current?.remove();
      meMarker.current = null;
      return;
    }

    if (!meMarker.current) {
      const el = document.createElement("div");
      Object.assign(el.style, {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        background: "#2f7cf6",
        border: "3px solid #fff",
        boxShadow: "0 0 0 6px rgba(47,124,246,.22)",
      });
      meMarker.current = new maplibregl.Marker({ element: el })
        .setLngLat([me.lng, me.lat])
        .addTo(m);
    } else {
      meMarker.current.setLngLat([me.lng, me.lat]);
    }

    if (follow) m.easeTo({ center: [me.lng, me.lat], duration: 900 });
  }, [me, follow]);

  return (
    <div
      ref={host}
      style={{
        position: "absolute",
        inset: 0,
        background: c.sunk,
        // MapLibre positions markers as absolutely placed siblings of the
        // canvas and does not clip them to the container. Without this, pins
        // near the edge paint outside the map and spill down the sides.
        overflow: "hidden",
      }}
    />
  );
}

/**
 * Sets how a pin draws at the current zoom.
 *
 * Far out it is a dot; closer it becomes the bird; closer still the landing
 * runs and it gains a bench. A 76px bird at city scale collides with its
 * neighbours into an unreadable pile, which is what this steps around.
 */
function applyZoom(pin: Pin, zoom: number) {
  const far = zoom < BIRD_ZOOM;
  const s = pinScale(zoom) * (pin.selected ? 1.5 : 1);
  pin.inner.style.transform = `scale(${s.toFixed(3)})`;

  if (pin.selected) {
    pin.dot.style.opacity = "0";
    return;
  }

  // While a landing is in flight the animation owns the layer opacities.
  // Zoom fires continuously during a gesture, so writing them here too would
  // slam the bird to hidden on the very next tick and the landing would never
  // be seen. Only cancel if the map has zoomed clean out of bird range.
  if (pin.animating) {
    if (!far) return;
    cancel(pin);
  }

  pin.dot.style.opacity = far ? "1" : "0";

  if (far) {
    pin.bird.style.opacity = "0";
    pin.mark.style.opacity = "0";
    pin.open.style.opacity = "0";
  } else {
    pin.bird.style.opacity = pin.perched ? "0" : "1";
    pin.mark.style.opacity = pin.perched ? "1" : "0";
  }
}

/** Stops a landing and drops the pin straight to its resting state. */
function cancel(pin: Pin) {
  pin.timers.forEach(clearTimeout);
  pin.timers = [];
  pin.animating = false;
  pin.bird.style.transform = "translateY(0px)";
}

/** Swoop, two wingbeats, settle — then the bench arrives underneath. */
function land(pin: Pin, tint: BirdTint, index: number) {
  pin.timers.forEach(clearTimeout);
  pin.timers = [];
  pin.animating = true;
  pin.dot.style.opacity = "0";

  // A small stagger so a screenful of birds does not land in lockstep.
  const offset = (index % 5) * 70;

  pin.mark.style.opacity = "0";
  pin.bird.style.opacity = "1";

  LANDING.forEach((step) => {
    pin.timers.push(
      window.setTimeout(() => {
        pin.bird.src = birdUri(tint, step.pose);
        pin.bird.style.transform = `translateY(${-step.lift}px)`;
      }, offset + step.at),
    );
  });

  pin.timers.push(
    window.setTimeout(() => {
      pin.mark.style.opacity = "1";
      pin.bird.style.opacity = "0";
      pin.animating = false;
    }, offset + LANDING_MS),
  );
}

/** Zooming out: the bench goes, the bird stays. */
function takeOff(pin: Pin, tint: BirdTint) {
  pin.timers.forEach(clearTimeout);
  pin.timers = [];
  pin.animating = false;

  pin.bird.src = birdUri(tint, "perched");
  pin.bird.style.transform = "translateY(0px)";
  pin.bird.style.opacity = "1";
  pin.mark.style.opacity = "0";
}
