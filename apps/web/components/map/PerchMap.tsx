"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createClient } from "@/lib/supabase/client";
import {
  KIND_LABELS,
  formatCoords,
  type SpotKind,
  type SpotWithDistance,
} from "@perch/core";

const STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/positron";

const HOME: [number, number] = [-9.1394, 38.7223];

/** Marked spots burn brass; unmarked pins stay quiet pine outlines. */
const BRASS = "#b7863f";
const PINE = "#445c42";

export default function PerchMap() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const spotsRef = useRef<SpotWithDistance[]>([]);

  const [spots, setSpots] = useState<SpotWithDistance[]>([]);
  const [selected, setSelected] = useState<SpotWithDistance | null>(null);
  const [kind, setKind] = useState<SpotKind | "all">("all");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (lat: number, lng: number) => {
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("spots_nearby", {
        in_lat: lat,
        in_lng: lng,
        radius_m: 2500,
        max_rows: 400,
      });
      if (rpcError) throw rpcError;
      setSpots((data as SpotWithDistance[]) ?? []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not reach the map.",
      );
    }
  }, []);

  useEffect(() => {
    spotsRef.current = spots;
  }, [spots]);

  /* ---- init ---- */
  useEffect(() => {
    if (!container.current || map.current) return;

    const m = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: HOME,
      zoom: 13.5,
      attributionControl: false,
    });
    map.current = m;

    m.addControl(
      new maplibregl.AttributionControl({
        customAttribution: "Base map © OpenStreetMap contributors (ODbL)",
        compact: true,
      }),
      "bottom-right",
    );
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    m.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "bottom-right",
    );

    m.on("load", () => {
      m.addSource("spots", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterRadius: 46,
        clusterMaxZoom: 14,
      });

      m.addLayer({
        id: "clusters",
        type: "circle",
        source: "spots",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": PINE,
          "circle-opacity": 0.14,
          "circle-radius": ["step", ["get", "point_count"], 17, 25, 23, 100, 31],
          "circle-stroke-width": 1,
          "circle-stroke-color": PINE,
        },
      });

      m.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "spots",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 11,
        },
        paint: { "text-color": PINE },
      });

      // A spot somebody has photographed reads solid brass. One that is
      // only a pin stays hollow — so the map shows at a glance how much
      // of a place has actually been visited.
      m.addLayer({
        id: "spot-pin",
        type: "circle",
        source: "spots",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": ["case", ["get", "marked"], 8, 5.5],
          "circle-color": ["case", ["get", "marked"], BRASS, "rgba(0,0,0,0)"],
          "circle-stroke-width": 1.8,
          "circle-stroke-color": ["case", ["get", "marked"], BRASS, PINE],
        },
      });

      m.on("click", "spot-pin", (e) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (!id) return;
        setSelected(spotsRef.current.find((s) => s.id === id) ?? null);
      });

      m.on("mouseenter", "spot-pin", () => {
        m.getCanvas().style.cursor = "pointer";
      });
      m.on("mouseleave", "spot-pin", () => {
        m.getCanvas().style.cursor = "";
      });

      void load(HOME[1], HOME[0]);
    });

    m.on("moveend", () => {
      const c = m.getCenter();
      void load(c.lat, c.lng);
    });

    return () => {
      m.remove();
      map.current = null;
    };
  }, [load]);

  /* ---- push filtered data into the source ---- */
  useEffect(() => {
    const source = map.current?.getSource("spots") as GeoJSONSource | undefined;
    if (!source) return;

    const visible = kind === "all" ? spots : spots.filter((s) => s.kind === kind);

    source.setData({
      type: "FeatureCollection",
      features: visible.map((s) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [s.lng, s.lat] },
        properties: { id: s.id, marked: s.marks_count > 0 },
      })),
    });
  }, [spots, kind]);

  const marked = spots.filter((s) => s.marks_count > 0).length;

  return (
    <div className="map-screen">
      <div ref={container} className="map-canvas" />

      <div className="map-filters">
        {(["all", "bench", "viewpoint", "trail_rest"] as const).map((k) => (
          <button
            key={k}
            className={`chip${kind === k ? " chip--on" : ""}`}
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
          >
            {k === "all" ? "Everything" : KIND_LABELS[k]}
          </button>
        ))}
      </div>

      <div className="map-hud">
        <span className="meta">
          {spots.length} spots · {marked} with photos
        </span>
      </div>

      <button className="map-add btn btn--brass">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M8 3.2v9.6M3.2 8h9.6" strokeLinecap="round" />
        </svg>
        Mark a spot
      </button>

      {error && (
        <div className="map-error">
          <p className="body-copy">{error}</p>
          <p className="meta mt-sm">
            Run the migration in <code>supabase/migrations</code> first.
          </p>
        </div>
      )}

      {selected && (
        <SpotSheet spot={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function SpotSheet({
  spot,
  onClose,
}: {
  spot: SpotWithDistance;
  onClose: () => void;
}) {
  return (
    <aside className="spot-sheet" aria-label="Spot detail">
      <div className="row between">
        <span className="meta">
          {Math.round(spot.distance_m)} m away · {KIND_LABELS[spot.kind]}
        </span>
        <button className="sheet-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>

      <h2 className="display d-2 mt-xs">{spot.name}</h2>
      <p className="meta mt-xs">{formatCoords(spot.lat, spot.lng)}</p>

      {spot.cover_media_path ? (
        <div className="spot-sheet__media mt-sm">
          <img src={spot.cover_media_path} alt={`A view from ${spot.name}`} />
        </div>
      ) : (
        <p className="body-muted mt-sm">
          Nobody has photographed this one yet. Be the first.
        </p>
      )}

      {spot.attributes.length > 0 && (
        <div className="row wrap gap-xs mt-sm">
          {spot.attributes.map((a) => (
            <span key={a} className="tag tag--pine">
              {a.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      <div className="row between mt-md">
        <span className="meta">
          {spot.marks_count} {spot.marks_count === 1 ? "mark" : "marks"} ·{" "}
          {spot.saves_count} saved
        </span>
        <button className="btn btn--ghost btn--sm">Save</button>
      </div>
    </aside>
  );
}
