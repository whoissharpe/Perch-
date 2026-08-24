/**
 * One source of truth for the brand, shared by the mobile app and the
 * marketing site. The web mirrors these as CSS custom properties in
 * apps/web/app/globals.css — if you change a value here, change it there.
 */

export const palette = {
  light: {
    paper: "#fcfcfa",
    surface: "#ffffff",
    sunk: "#f0f3f0",
    ink: "#16211d",
    body: "#3d4a45",
    muted: "#77837d",
    pine: "#1c4034",
    pineSoft: "#e7eeea",
    blaze: "#e1622f",
    blazeSoft: "#fceee7",
    line: "rgba(22, 33, 29, 0.12)",
    lineSoft: "rgba(22, 33, 29, 0.07)",
    onPine: "#fcfcfa",
  },
  dark: {
    paper: "#0e1613",
    surface: "#16211d",
    sunk: "#0a100e",
    ink: "#edf2ef",
    body: "#c3cfc9",
    muted: "#7e8c86",
    pine: "#8fbba6",
    pineSoft: "rgba(143, 187, 166, 0.13)",
    blaze: "#f2814f",
    blazeSoft: "rgba(242, 129, 79, 0.14)",
    line: "rgba(237, 242, 239, 0.13)",
    lineSoft: "rgba(237, 242, 239, 0.07)",
    onPine: "#0e1613",
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
