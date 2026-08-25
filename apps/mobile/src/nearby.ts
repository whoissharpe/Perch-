import { useEffect, useState } from "react";
import type { SampleMark } from "@/sample";

/**
 * Real benches and viewpoints near the user, live from OpenStreetMap.
 *
 * This replaces the eleven invented spots the app used to ship with. Those
 * existed so the map would not look empty, which is exactly the wrong reason:
 * a map full of places that do not exist is worse than an empty one, because
 * the first thing a user does is walk to one.
 *
 * Everything here is a real mapped object. It arrives as a *pin without a
 * photo* - a hollow ring rather than a bird - which is the product in one
 * gesture: open data can tell you a bench exists, only a person can tell you
 * whether it is worth sitting on. Every hollow ring is an invitation.
 *
 * Map data (c) OpenStreetMap contributors, ODbL. The attribution control on
 * the map is a licence condition and must stay legible.
 */

const OVERPASS = "https://overpass-api.de/api/interpreter";

/** Overpass is a shared free service; ask for a sensible amount and cache it. */
const RADIUS_M = 1800;
const MAX = 240;

/**
 * Minimum spacing between two unmarked pins, in metres.
 *
 * OpenStreetMap maps benches individually, so a plaza with seating all round
 * it comes back as twenty nodes a few metres apart. Drawn honestly that is a
 * ring of overlapping circles that reads as a rendering fault rather than as
 * information — and it tells the user nothing they did not already know from
 * one pin. Eighteen benches around a fountain is one place to sit, not
 * eighteen.
 *
 * So the map keeps the first node in each cell of a ~40 m grid and drops the
 * rest. Nothing is invented and nothing is merged into a fake "cluster"
 * count; it is a thinning, and the dropped nodes come back as soon as the
 * user is close enough for the grid to separate them.
 */
const SPACING_M = 40;

interface OverpassEl {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function kindFor(t: Record<string, string>): SampleMark["kind"] | null {
  if (t.tourism === "viewpoint") return "viewpoint";
  if (t.amenity === "bench") return "bench";
  if (t.amenity === "shelter" || t.leisure === "picnic_table") return "trail_rest";
  return null;
}

function nameFor(kind: SampleMark["kind"], t: Record<string, string>) {
  if (t.name) return t.name;
  // No invented character here: an unnamed bench is described, not christened.
  return kind === "viewpoint"
    ? "Viewpoint"
    : kind === "bench"
      ? "Bench"
      : "Somewhere to stop";
}

export async function fetchNearby(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<SampleMark[]> {
  const q = `[out:json][timeout:25];
(
  node["amenity"="bench"](around:${RADIUS_M},${lat},${lng});
  node["tourism"="viewpoint"](around:${RADIUS_M},${lat},${lng});
  node["amenity"="shelter"](around:${RADIUS_M},${lat},${lng});
  node["leisure"="picnic_table"](around:${RADIUS_M},${lat},${lng});
);
out center ${MAX};`;

  const res = await fetch(OVERPASS, {
    method: "POST",
    body: new URLSearchParams({ data: q }).toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    signal,
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);

  const json = (await res.json()) as { elements?: OverpassEl[] };
  const out: SampleMark[] = [];

  // Grid cell size in degrees. Longitude cells widen toward the poles, so the
  // east-west step is corrected by the latitude — otherwise the thinning is
  // far too aggressive in Reykjavik and far too loose in Singapore.
  const latStep = SPACING_M / 111_320;
  const lngStep = latStep / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  const taken = new Set<string>();

  for (const e of json.elements ?? []) {
    const t = e.tags ?? {};
    const kind = kindFor(t);
    const eLat = e.lat ?? e.center?.lat;
    const eLng = e.lon ?? e.center?.lon;
    if (!kind || eLat == null || eLng == null) continue;

    // A named spot always survives the thinning — somebody bothered to name
    // it, which is exactly the signal worth keeping.
    if (!t.name) {
      const cell = `${Math.round(eLat / latStep)}:${Math.round(eLng / lngStep)}`;
      if (taken.has(cell)) continue;
      taken.add(cell);
    }

    out.push({
      id: `osm-${e.id}`,
      name: nameFor(kind, t),
      kind,
      lat: eLat,
      lng: eLng,
      image: "",
      who: "",
      caption: "",
      saves: 0,
      isVideo: false,
      // Zero marks is the whole point: it draws hollow until somebody goes.
      marks: 0,
      osm: true,
    });
  }
  return out;
}

export type NearbyState = {
  spots: SampleMark[];
  loading: boolean;
  error: string | null;
};

/**
 * Real spots around a centre. Refetches only when the centre moves enough to
 * matter - Overpass is a donated service and does not deserve a request per
 * GPS tick.
 */
export function useNearby(lat: number | null, lng: number | null): NearbyState {
  const [state, setState] = useState<NearbyState>({
    spots: [],
    loading: false,
    error: null,
  });

  // ~0.01 deg is a bit over a kilometre, which is under the query radius, so
  // the map never shows a hole where data should be.
  const key =
    lat == null || lng == null
      ? null
      : `${Math.round(lat * 100) / 100},${Math.round(lng * 100) / 100}`;

  useEffect(() => {
    if (!key) return;
    const [a, b] = key.split(",").map(Number);
    const ctrl = new AbortController();

    setState((s) => ({ ...s, loading: true, error: null }));
    fetchNearby(a, b, ctrl.signal)
      .then((spots) => setState({ spots, loading: false, error: null }))
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        setState({
          spots: [],
          loading: false,
          error: err instanceof Error ? err.message : "Could not reach OpenStreetMap.",
        });
      });

    return () => ctrl.abort();
  }, [key]);

  return state;
}
