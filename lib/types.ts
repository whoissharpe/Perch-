/** The three axes. Five meaningless stars tell you nothing about a bench. */
export type Axis = "view" | "shade" | "comfort";

/** Attributes open data almost never has, which is exactly why they matter. */
export type BenchAttribute =
  | "backrest"
  | "armrests"
  | "step_free"
  | "shaded_afternoon"
  | "water_nearby"
  | "quiet";

export const BENCH_ATTRIBUTES: { key: BenchAttribute; label: string }[] = [
  { key: "backrest", label: "Backrest" },
  { key: "armrests", label: "Armrests" },
  { key: "step_free", label: "Step-free approach" },
  { key: "shaded_afternoon", label: "Shaded at 2pm" },
  { key: "water_nearby", label: "Water nearby" },
  { key: "quiet", label: "Quiet" },
];

export type BenchSource = "osm" | "user";

export interface Bench {
  id: string;
  /** Present only for benches seeded from OpenStreetMap. */
  osm_id: number | null;
  source: BenchSource;
  lat: number;
  lng: number;
  name: string | null;
  city: string;
  attributes: BenchAttribute[];
  /** Rolling averages, null until somebody has actually sat there. */
  avg_view: number | null;
  avg_shade: number | null;
  avg_comfort: number | null;
  sit_count: number;
  created_at: string;
}

export interface Sit {
  id: string;
  bench_id: string;
  user_id: string;
  view: number;
  shade: number;
  comfort: number;
  note: string | null;
  photo_path: string | null;
  created_at: string;
}

export interface BenchWithDistance extends Bench {
  distance_m: number;
}

export const AXIS_LABELS: Record<Axis, string> = {
  view: "View",
  shade: "Shade",
  comfort: "Comfort",
};
