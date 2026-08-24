"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createClient } from "@/lib/supabase/client";
import { AXIS_LABELS, type Axis, type BenchWithDistance } from "@/lib/types";

const STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/positron";

/** Lisbon. The one city. */
const HOME: [number, number] = [-9.1394, 38.7223];

export default function PerchMap() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [benches, setBenches] = useState<BenchWithDistance[]>([]);
  const [selected, setSelected] = useState<BenchWithDistance | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Pull benches near the current centre. Called on load and on moveend. */
  const load = useCallback(async (lat: number, lng: number) => {
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("benches_nearby", {
        in_lat: lat,
        in_lng: lng,
        radius_m: 1500,
        max_rows: 400,
      });
      if (rpcError) throw rpcError;
      setBenches((data as BenchWithDistance[]) ?? []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach the bench database.",
      );
    }
  }, []);

  /* ---- map init ---- */
  useEffect(() => {
    if (!container.current || map.current) return;

    const m = new maplibregl.Map({
      container: container.current,
      style: STYLE_URL,
      center: HOME,
      zoom: 14.5,
      attributionControl: false,
    });
    map.current = m;

    m.addControl(
      new maplibregl.AttributionControl({
        // ODbL requires this stays visible.
        customAttribution: "Bench data © OpenStreetMap contributors (ODbL)",
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
      m.addSource("benches", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterRadius: 44,
        clusterMaxZoom: 15,
      });

      m.addLayer({
        id: "clusters",
        type: "circle",
        source: "benches",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#46543f",
          "circle-opacity": 0.16,
          "circle-radius": ["step", ["get", "point_count"], 16, 25, 22, 100, 30],
          "circle-stroke-width": 1,
          "circle-stroke-color": "#46543f",
        },
      });

      m.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "benches",
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 11 },
        paint: { "text-color": "#46543f" },
      });

      // Rated benches read as solid; unrated ones as hollow. The map shows
      // you at a glance how much of the city has actually been sat on.
      m.addLayer({
        id: "bench-pin",
        type: "circle",
        source: "benches",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": ["case", ["get", "rated"], 7, 5],
          "circle-color": ["case", ["get", "rated"], "#46543f", "#fbf9f4"],
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#46543f",
        },
      });

      m.on("click", "bench-pin", (e) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (!id) return;
        setSelected(benchesRef.current.find((b) => b.id === id) ?? null);
      });

      m.on("mouseenter", "bench-pin", () => {
        m.getCanvas().style.cursor = "pointer";
      });
      m.on("mouseleave", "bench-pin", () => {
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

  /* Keep a ref so the map click handler sees fresh data without re-binding. */
  const benchesRef = useRef<BenchWithDistance[]>([]);
  useEffect(() => {
    benchesRef.current = benches;
  }, [benches]);

  /* ---- push data into the source ---- */
  useEffect(() => {
    const m = map.current;
    const source = m?.getSource("benches") as GeoJSONSource | undefined;
    if (!source) return;

    source.setData({
      type: "FeatureCollection",
      features: benches.map((b) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [b.lng, b.lat] },
        properties: { id: b.id, rated: b.sit_count > 0 },
      })),
    });
  }, [benches]);

  const rated = benches.filter((b) => b.sit_count > 0).length;

  return (
    <div className="map-screen">
      <div ref={container} className="map-canvas" />

      <div className="map-hud">
        <span className="meta">
          {benches.length} benches nearby &middot; {rated} sat on
        </span>
      </div>

      {error && (
        <div className="map-error">
          <p className="body-muted">{error}</p>
          <p className="meta mt-sm">
            Run the migration and <code>npm run seed:osm</code> first.
          </p>
        </div>
      )}

      {selected && (
        <BenchSheet bench={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function BenchSheet({
  bench,
  onClose,
}: {
  bench: BenchWithDistance;
  onClose: () => void;
}) {
  const axes: [Axis, number | null][] = [
    ["view", bench.avg_view],
    ["shade", bench.avg_shade],
    ["comfort", bench.avg_comfort],
  ];

  return (
    <aside className="bench-sheet" aria-label="Bench detail">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="meta">
          {Math.round(bench.distance_m)} m away
          {bench.source === "osm" && " · from OpenStreetMap"}
        </span>
        <button className="sheet-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>

      <h2 className="bench-card__name">
        {bench.name ?? "Unnamed bench"}
      </h2>

      {bench.sit_count === 0 ? (
        <p className="body-muted mt-sm">
          Nobody has sat here yet. Be the first to say whether it is any good.
        </p>
      ) : (
        <dl className="axes mt-md">
          {axes.map(([axis, value]) => (
            <div className="axis" key={axis}>
              <dt>{AXIS_LABELS[axis]}</dt>
              <dd>
                <span className="dots" aria-label={`${value ?? 0} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <i key={i} className={i < Math.round(value ?? 0) ? "on" : undefined} />
                  ))}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {bench.attributes.length > 0 && (
        <div className="row wrap gap-xs mt-md">
          {bench.attributes.map((a) => (
            <span key={a} className="tag tag--moss">
              {a.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      <p className="meta mt-md">
        {bench.sit_count} {bench.sit_count === 1 ? "sit" : "sits"} recorded
      </p>
    </aside>
  );
}
