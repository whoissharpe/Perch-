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
  },
  paper: {
    up: require("../assets/bird-up-paper.png"),
    spread: require("../assets/bird-spread-paper.png"),
    perched: require("../assets/bird-perched-paper.png"),
    mark: require("../assets/mark-paper.png"),
  },
} as const;

export type BirdPose = "up" | "spread" | "perched";
export type BirdTint = keyof typeof BIRD;

/**
 * Resolves an asset to a plain URL, which the DOM markers on web need.
 *
 * `require()` of a PNG gives back a numeric asset id under Metro, and
 * react-native-web has no `Image.resolveAssetSource` to turn that into a URL.
 * expo-asset resolves it on every platform, so use that rather than branching.
 */
export function birdUri(tint: BirdTint, key: BirdPose | "mark"): string {
  return Asset.fromModule(BIRD[tint][key]).uri;
}

/**
 * The landing choreography. Timings are the same on both platforms so the
 * animation reads identically — a beat of descent, two wingbeats, then settle.
 */
export const LANDING = [
  { at: 0, pose: "up" as BirdPose, lift: 22 },
  { at: 130, pose: "spread" as BirdPose, lift: 13 },
  { at: 270, pose: "up" as BirdPose, lift: 6 },
  { at: 390, pose: "spread" as BirdPose, lift: 2 },
  { at: 500, pose: "perched" as BirdPose, lift: 0 },
];

export const LANDING_MS = 640;

/** Past this zoom the bench is legible, so the bird gets something to sit on. */
export const PERCH_ZOOM = 15.5;
