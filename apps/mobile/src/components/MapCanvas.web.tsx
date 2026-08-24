import { useEffect, useRef } from "react";
import { useColorScheme } from "react-native";
import maplibregl, { type Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { palette } from "@perch/core";
import { LANDING, LANDING_MS, PERCH_ZOOM, birdUri, type BirdTint } from "@/birdSprites";
import type { MapCanvasProps } from "./MapCanvas";

const STYLE = "https://tiles.openfreemap.org/styles/positron";

/** Big enough that the bench reads at a glance. */
const PIN_SIZE = 76;

/**
 * A real tile map for the browser preview — react-native-maps has no web
 * implementation, so this stands in with MapLibre.
 *
 * Positron is a pale grey basemap. The filter pulls it toward the Perch
 * paper-and-pine ground in light and inverts it for dark, so the map belongs
 * to the same design as everything drawn on top of it.
 */
const TINT = {
  light: "saturate(0.55) sepia(0.16) hue-rotate(72deg) brightness(1.02)",
  dark: "invert(1) hue-rotate(180deg) saturate(0.5) sepia(0.2) hue-rotate(72deg) brightness(0.85) contrast(1.05)",
};

interface Pin {
  el: HTMLDivElement;
  bird: HTMLImageElement;
  mark: HTMLImageElement;
  timers: number[];
  perched: boolean;
}

export function MapCanvas({ spots, selectedId, onSelect, me, follow }: MapCanvasProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const pins = useRef<Pin[]>([]);
  const meMarker = useRef<Marker | null>(null);

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

    // Land or take off as the zoom crosses the threshold.
    m.on("zoom", () => {
      const shouldPerch = m.getZoom() >= PERCH_ZOOM;
      pins.current.forEach((p, i) => {
        if (p.perched === shouldPerch) return;
        p.perched = shouldPerch;
        if (shouldPerch) land(p, tintRef.current, i);
        else takeOff(p, tintRef.current);
      });
    });

    return () => {
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
     container also holds the markers, and inverting it turns every blaze
     pin green. */
  useEffect(() => {
    const canvas = map.current?.getCanvas();
    if (canvas) canvas.style.filter = TINT[scheme];
  }, [scheme]);

  /* spot pins */
  useEffect(() => {
    const m = map.current;
    if (!m) return;

    pins.current.forEach((p) => p.timers.forEach(clearTimeout));
    markers.current.forEach((mk) => mk.remove());
    markers.current = [];
    pins.current = [];

    const perched = m.getZoom() >= PERCH_ZOOM;

    spots.forEach((s) => {
      const marked = s.marks > 0;
      const on = selectedId === s.id;

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
        transform: on ? "scale(1.55)" : "scale(1)",
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

      const bird = document.createElement("img");
      const mark = document.createElement("img");

      if (marked) {
        Object.assign(bird.style, {
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transition: "opacity .18s linear, transform .18s cubic-bezier(.32,.72,0,1)",
          pointerEvents: "none",
        });
        Object.assign(mark.style, {
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: "0",
          transition: "opacity .22s linear",
          pointerEvents: "none",
        });

        bird.src = birdUri(tint, "perched");
        mark.src = birdUri(tint, "mark");
        bird.alt = "";
        mark.alt = "";

        if (on) {
          // Selected: wings wide. It is the tell that this is the bird whose
          // post is open below, and it reads from across the map.
          bird.src = birdUri(tint, "spread");
          bird.style.opacity = "1";
          mark.style.opacity = "0";
        } else if (perched) {
          bird.style.opacity = "0";
          mark.style.opacity = "1";
        }

        inner.append(bird, mark);
      }

      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        onSelect(s.id);
      });

      pins.current.push({ el, bird, mark, timers: [], perched });

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
  }, [spots, selectedId, onSelect, c.pine, tint]);

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
    <div ref={host} style={{ position: "absolute", inset: 0, background: c.sunk }} />
  );
}

/** Swoop, two wingbeats, settle — then the bench arrives underneath. */
function land(pin: Pin, tint: BirdTint, index: number) {
  pin.timers.forEach(clearTimeout);
  pin.timers = [];

  // A small stagger so a screenful of birds does not land in lockstep.
  const offset = (index % 5) * 55;

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
    }, offset + LANDING_MS),
  );
}

/** Zooming out: the bench goes, the bird stays. */
function takeOff(pin: Pin, tint: BirdTint) {
  pin.timers.forEach(clearTimeout);
  pin.timers = [];

  pin.bird.src = birdUri(tint, "perched");
  pin.bird.style.transform = "translateY(0px)";
  pin.bird.style.opacity = "1";
  pin.mark.style.opacity = "0";
}
