import { useColorScheme } from "react-native";
import { palette, type Palette } from "@perch/core";

export { fonts, type, space, radius } from "@perch/core";

/** Resolves the shared palette against the device's colour scheme. */
export function useTheme(): Palette {
  return useColorScheme() === "dark" ? palette.dark : palette.light;
}
