/**
 * A spot is a place worth stopping. Not only benches — a flat rock on a
 * summit is a perch too, and hikers care about those more than park furniture.
 */
export type SpotKind =
  | "bench"
  | "viewpoint"
  | "trail_rest"
  | "picnic"
  | "shelter";

export const SPOT_KINDS: { key: SpotKind; label: string }[] = [
  { key: "bench", label: "Bench" },
  { key: "viewpoint", label: "Viewpoint" },
  { key: "trail_rest", label: "Trail rest" },
  { key: "picnic", label: "Picnic table" },
  { key: "shelter", label: "Shelter" },
];

/** Attributes that decide whether a spot is worth the walk. */
export type SpotAttribute =
  | "backrest"
  | "shade"
  | "step_free"
  | "water_nearby"
  | "quiet"
  | "sunset"
  | "dog_friendly";

export const SPOT_ATTRIBUTES: { key: SpotAttribute; label: string }[] = [
  { key: "backrest", label: "Backrest" },
  { key: "shade", label: "Shade" },
  { key: "step_free", label: "Step-free" },
  { key: "water_nearby", label: "Water nearby" },
  { key: "quiet", label: "Quiet" },
  { key: "sunset", label: "Good at sunset" },
  { key: "dog_friendly", label: "Dog friendly" },
];

export interface Profile {
  id: string;
  handle: string;
  display_name: string | null;
  avatar_path: string | null;
  bio: string | null;
  marks_count: number;
  created_at: string;
}

export interface Spot {
  id: string;
  kind: SpotKind;
  lat: number;
  lng: number;
  name: string;
  place: string | null;
  attributes: SpotAttribute[];
  /** Denormalised so the map can render a pin without a join per spot. */
  cover_media_path: string | null;
  cover_media_type: MediaType | null;
  marks_count: number;
  saves_count: number;
  added_by: string | null;
  created_at: string;
}

export type MediaType = "photo" | "video";

/**
 * A mark is one person saying "I stopped here, and here is what it looked
 * like". Media is required — a mark without a picture is just a pin, and
 * pins are the part open data already has.
 */
export interface Mark {
  id: string;
  spot_id: string;
  user_id: string;
  media_path: string;
  media_type: MediaType;
  /** Poster frame for videos; null for photos. */
  poster_path: string | null;
  caption: string | null;
  saves_count: number;
  created_at: string;
}

export interface MarkWithAuthor extends Mark {
  author_handle: string;
  author_display_name: string | null;
}

export interface SpotWithDistance extends Spot {
  distance_m: number;
}

export const KIND_LABELS: Record<SpotKind, string> = Object.fromEntries(
  SPOT_KINDS.map((k) => [k.key, k.label]),
) as Record<SpotKind, string>;

/** Formats a coordinate the way the interface stamps it on every card. */
export function formatCoords(lat: number, lng: number): string {
  const f = (n: number, pos: string, neg: string) =>
    `${Math.abs(n).toFixed(4)}°${n >= 0 ? pos : neg}`;
  return `${f(lat, "N", "S")} ${f(lng, "E", "W")}`;
}
