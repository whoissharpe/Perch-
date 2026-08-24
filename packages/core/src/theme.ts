/**
 * One source of truth for the brand, shared by the mobile app and the
 * marketing site. The web mirrors these as CSS custom properties in
 * apps/web/app/globals.css — if you change a value here, change it there.
 *
 * Earthy forest green: olive and sage greens on warm bone, with brass as the
 * single accent. Brass replaces the old blaze orange — against this much
 * green a bright orange shouted, where a warm metal sits in the same world
 * while staying clearly separate from every green on screen.
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
    brass: "#b7863f",
    brassSoft: "#f3e9d6",
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
    brass: "#d8a961",
    brassSoft: "rgba(216, 169, 97, 0.15)",
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
