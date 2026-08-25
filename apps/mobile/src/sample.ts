import type { SpotKind } from "@perch/core";

/**
 * The shape of a spot on the map.
 *
 * This file used to also export eleven invented spots with generated
 * photographs, so the app would look populated before Supabase was wired up.
 * They are gone. Everything the app shows is now real: curated picks from
 * src/curated.ts, and live OpenStreetMap data from src/nearby.ts.
 */
export interface SampleMark {
  id: string;
  name: string;
  kind: SpotKind;
  lat: number;
  lng: number;
  image: string;
  who: string;
  caption: string;
  saves: number;
  isVideo: boolean;
  marks: number;
  /** Marked by the Perch team -- see src/curated.ts. Renders as a Perch Pick. */
  curated?: boolean;
  /** Why the team picked it, e.g. "Go at golden hour". Curated spots only. */
  note?: string;
  /** True great-circle distance from the user, in metres. */
  metresAway?: number;
  /** Wikipedia record for a real place, so its claims can be checked. */
  source?: string;
  /** Photographer and licence for a Wikimedia Commons image. */
  credit?: string;
  /** Came from OpenStreetMap rather than a Perch user. */
  osm?: boolean;
}
