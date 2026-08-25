import type { SampleMark } from "@/sample";
import { distance } from "@/curated";

/**
 * Searching for a place, and searching what is already on the map.
 *
 * Two different questions get asked of a map's search box and they deserve
 * different answers. "Riverside" is a place — the map should go there.
 * "Treaty Oak" is a spot — it is already loaded and should be selected. So
 * this returns both, spots first, because a hit on something already pinned is
 * always the more specific answer.
 *
 * Place lookup is Nominatim, OpenStreetMap's own geocoder. Its usage policy
 * asks for an identifying User-Agent and no more than one request a second,
 * which is why the caller debounces and why the header is set. Results are
 * (c) OpenStreetMap contributors under ODbL, same as the basemap.
 */

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export interface PlaceHit {
  id: string;
  name: string;
  /** Region, country — the part that disambiguates two places of one name. */
  context: string;
  lat: number;
  lng: number;
  /** A spot already on the map, rather than somewhere to fly to. */
  spotId?: string;
  /** Metres from the user, when known. */
  metresAway?: number;
}

/** Spots already loaded whose name matches. No network involved. */
export function searchLoaded(
  q: string,
  spots: SampleMark[],
  from?: { lat: number; lng: number } | null,
): PlaceHit[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];

  return spots
    .filter(
      (s) =>
        s.name.toLowerCase().includes(needle) ||
        // Curated picks carry their city in `note`; OSM spots have neither.
        (s.note ?? "").toLowerCase().includes(needle),
    )
    .slice(0, 6)
    .map((s) => ({
      id: `spot-${s.id}`,
      name: s.name,
      context: s.note ?? (s.osm ? "From OpenStreetMap" : "On the map"),
      lat: s.lat,
      lng: s.lng,
      spotId: s.id,
      metresAway: from ? Math.round(distance(from.lat, from.lng, s.lat, s.lng)) : undefined,
    }));
}

/**
 * Places, from Nominatim.
 *
 * `viewbox` biases results toward what the user is looking at without
 * excluding everything else — searching "Riverside" while looking at
 * Jacksonville should offer the Jacksonville one first, not refuse the rest.
 */
export async function searchPlaces(
  q: string,
  near: { lat: number; lng: number } | null,
  signal?: AbortSignal,
): Promise<PlaceHit[]> {
  const needle = q.trim();
  if (needle.length < 2) return [];

  const params = new URLSearchParams({
    q: needle,
    format: "json",
    limit: "6",
    addressdetails: "0",
  });
  if (near) {
    const d = 0.6; // roughly 60 km of bias box
    params.set(
      "viewbox",
      `${near.lng - d},${near.lat + d},${near.lng + d},${near.lat - d}`,
    );
    params.set("bounded", "0");
  }

  const res = await fetch(`${NOMINATIM}?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Search unavailable (${res.status})`);

  const rows = (await res.json()) as {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
  }[];

  return rows.map((r) => {
    const parts = r.display_name.split(",").map((p) => p.trim());
    const lat = Number(r.lat);
    const lng = Number(r.lon);
    return {
      id: `place-${r.place_id}`,
      name: parts[0] ?? r.display_name,
      // Middle of the trail is noise; the useful bit is region and country.
      context: parts.slice(1).filter(Boolean).slice(-2).join(", "),
      lat,
      lng,
      metresAway: near ? Math.round(distance(near.lat, near.lng, lat, lng)) : undefined,
    };
  });
}

/** Distance the way a person says it. Shared with the picks rail's label. */
export function awayLabel(m?: number) {
  if (m == null) return "";
  if (m < 1000) return `${Math.round(m)} m away`;
  const km = m / 1000;
  return `${km < 100 ? km.toFixed(1) : Math.round(km).toLocaleString()} km away`;
}
