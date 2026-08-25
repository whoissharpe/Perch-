import { palette, shadows, type Elevation, type Palette } from "@perch/core";
import { useScheme } from "./scheme";

export { fonts, type, space, radius } from "@perch/core";

/** Resolves the shared palette against the device's colour scheme. */
export function useTheme(): Palette {
  return useScheme() === "dark" ? palette.dark : palette.light;
}

/**
 * One step of the elevation scale, resolved for the current scheme.
 *
 * Spread it into a style: `style={[styles.card, useShadow("md")]}`. Dark mode
 * needs a blacker, deeper shadow because a tinted one disappears into the
 * ground entirely.
 */
export function useShadow(level: Elevation = "sm") {
  const scheme = useScheme();
  return shadows[scheme][level];
}
