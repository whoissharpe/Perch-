import { Asset } from "expo-asset";

/**
 * The landing sequence, as flat asset references.
 *
 * All three poses come from the same 512px square canvas and are scaled, not
 * trimmed, so the bird stays in register from frame to frame — see the sprite
 * section of scripts/make-icons.mjs.
 */
export const BIRD = {
  pine: {
    up: require("../assets/bird-up-pine.png"),
    spread: require("../assets/bird-spread-pine.png"),
    perched: require("../assets/bird-perched-pine.png"),
    mark: require("../assets/mark-pine.png"),
    open: require("../assets/open-pine.png"),
    drag: require("../assets/drag-pine.png"),
  },
  paper: {
    up: require("../assets/bird-up-paper.png"),
    spread: require("../assets/bird-spread-paper.png"),
    perched: require("../assets/bird-perched-paper.png"),
    mark: require("../assets/mark-paper.png"),
    open: require("../assets/open-paper.png"),
    drag: require("../assets/drag-paper.png"),
  },
} as const;

export type BirdPose = "up" | "spread" | "perched";
export type BirdTint = keyof typeof BIRD;
/**
 * Every drawable: the three animation poses, the two resting states, and the
 * wide flight-with-ribbon used by the screen transition.
 */
export type BirdKey = BirdPose | "mark" | "open" | "drag";

/**
 * Resolves an asset to a plain URL, which the DOM markers on web need.
 *
 * `require()` of a PNG gives back a numeric asset id under Metro, and
 * react-native-web has no `Image.resolveAssetSource` to turn that into a URL.
 * expo-asset resolves it on every platform, so use that rather than branching.
 */
export function birdUri(tint: BirdTint, key: BirdKey): string {
  return Asset.fromModule(BIRD[tint][key]).uri;
}

/**
 * The landing choreography. Timings are the same on both platforms so the
 * animation reads identically — a beat of descent, two wingbeats, then settle.
 */
export const LANDING = [
  { at: 0, pose: "up" as BirdPose, lift: 26 },
  { at: 170, pose: "spread" as BirdPose, lift: 19 },
  { at: 360, pose: "up" as BirdPose, lift: 11 },
  { at: 550, pose: "spread" as BirdPose, lift: 4 },
  { at: 730, pose: "perched" as BirdPose, lift: 0 },
];

/** When the bench arrives, just after the bird settles. */
export const LANDING_MS = 900;

/**
 * How long the bird takes to glide between two frames. Has to be a little
 * shorter than the gap between beats, or the descent never quite arrives
 * before the next one starts and the whole thing reads as a blur.
 */
export const LANDING_STEP_MS = 165;

/** Past this zoom the bench is legible, so the bird gets something to sit on. */
export const PERCH_ZOOM = 15.5;

/**
 * Below this, spots are drawn as small dots.
 *
 * A 76px bird is sized for standing next to a bench. At city scale there are
 * dozens on screen and they collide into an unreadable pile, so the map steps
 * down: dot -> bird -> bird on a bench.
 */
export const BIRD_ZOOM = 14;

/** How big the pin is at a given zoom, as a fraction of PIN_SIZE. */
export function pinScale(zoom: number): number {
  if (zoom >= PERCH_ZOOM) return 1;
  if (zoom <= BIRD_ZOOM) return 0.5;
  const t = (zoom - BIRD_ZOOM) / (PERCH_ZOOM - BIRD_ZOOM);
  return 0.5 + t * 0.5;
}
