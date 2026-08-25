/**
 * One source of truth for the brand, shared by the mobile app and the
 * marketing site. The web mirrors these as CSS custom properties in
 * apps/web/app/globals.css — if you change a value here, change it there.
 *
 * Earthy forest green: olive and sage greens on warm bone, with a clay
 * terracotta as the single accent.
 *
 * Clay is the third accent this has had. Blaze orange shouted against the
 * green; brass sat too close to the olive in temperature and stopped reading
 * as a separate thing. Clay is warm enough to belong and far enough round the
 * wheel to survive on both grounds, which is the job of a map accent.
 */

export const palette = {
  light: {
    paper: "#f4f2e9",
    surface: "#fcfbf6",
    sunk: "#e7e5d9",
    ink: "#1e2a21",
    body: "#3d4b3f",
    muted: "#7b8479",
    /** The brand green. The mark is drawn in this. */
    pine: "#445c42",
    pineSoft: "#e1e7da",
    /** Map semantics only: a pin, a new mark, your location. */
    clay: "#a9523a",
    claySoft: "#f6e6df",
    line: "rgba(30, 42, 33, 0.13)",
    lineSoft: "rgba(30, 42, 33, 0.07)",
    onPine: "#f4f2e9",
  },
  dark: {
    paper: "#131a14",
    surface: "#1c2620",
    sunk: "#0e1410",
    ink: "#edf0e7",
    body: "#c4cdbf",
    muted: "#838c7e",
    pine: "#a8be9c",
    pineSoft: "rgba(168, 190, 156, 0.14)",
    clay: "#e0866a",
    claySoft: "rgba(224, 134, 106, 0.16)",
    line: "rgba(237, 240, 231, 0.13)",
    lineSoft: "rgba(237, 240, 231, 0.07)",
    onPine: "#131a14",
  },
} as const;

export type Scheme = keyof typeof palette;
export type Palette = (typeof palette)[Scheme];

/**
 * Fraunces carries the personality; Instrument Sans does the work; Space
 * Mono stamps coordinates. Names match the keys passed to expo-font.
 */
export const fonts = {
  display: "Fraunces_600SemiBold",
  body: "InstrumentSans_400Regular",
  bodyMedium: "InstrumentSans_500Medium",
  mono: "SpaceMono_400Regular",
} as const;

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 34, lineHeight: 37, letterSpacing: -0.8 },
  title: { fontFamily: fonts.display, fontSize: 24, lineHeight: 27, letterSpacing: -0.5 },
  cardTitle: { fontFamily: fonts.display, fontSize: 17, lineHeight: 21, letterSpacing: -0.3 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  meta: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 0.7 },
} as const;

export const space = { xs: 6, sm: 10, md: 16, lg: 24, xl: 36 } as const;
export const radius = { sm: 9, md: 14, lg: 20, pill: 999 } as const;

/**
 * Elevation.
 *
 * Three steps, and every surface picks one deliberately — flat cards on a flat
 * ground is what makes an interface look unfinished. Shadows are tinted with
 * the ink rather than pure black so they sit in the palette, and they stay
 * wide and low-opacity: the goal is a sense of the card being lifted off the
 * page, not a visible dark edge under it.
 *
 * React Native needs the iOS properties and the Android `elevation` number
 * separately; the web mirrors the same three steps as multi-layer box-shadows
 * in globals.css.
 */
export const shadows = {
  light: {
    sm: {
      shadowColor: "#1e2a21",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    md: {
      shadowColor: "#1e2a21",
      shadowOpacity: 0.09,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    lg: {
      shadowColor: "#1e2a21",
      shadowOpacity: 0.14,
      shadowRadius: 30,
      shadowOffset: { width: 0, height: 14 },
      elevation: 12,
    },
  },
  dark: {
    // Dark grounds swallow a tinted shadow, so these go blacker and deeper.
    sm: {
      shadowColor: "#000000",
      shadowOpacity: 0.34,
      shadowRadius: 7,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    md: {
      shadowColor: "#000000",
      shadowOpacity: 0.46,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 7 },
      elevation: 6,
    },
    lg: {
      shadowColor: "#000000",
      shadowOpacity: 0.58,
      shadowRadius: 32,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
    },
  },
} as const;

export type Elevation = keyof (typeof shadows)["light"];
