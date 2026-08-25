import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme as useSystemScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "perch.appearance.v1";

/** What the user picked, which is not the same as what is on screen. */
export type Appearance = "system" | "light" | "dark";
/** What is actually on screen. */
export type Scheme = "light" | "dark";

interface SchemeValue {
  appearance: Appearance;
  scheme: Scheme;
  setAppearance: (a: Appearance) => void;
}

const SchemeContext = createContext<SchemeValue | null>(null);

/**
 * Light and dark, chosen rather than inherited.
 *
 * Every screen used to call React Native's `useColorScheme()` directly, which
 * reads the OS setting and cannot be overridden. That is fine until somebody
 * wants the map dark at midday, or light on a phone that lives in dark mode —
 * a map is looked at outdoors in bright sun, which is exactly the case where
 * the system preference is the wrong one.
 *
 * So there is one resolver. `appearance` is the user's choice and persists;
 * `scheme` is what that resolves to right now, following the OS while the
 * choice is "system". Everything else in the app reads `useScheme()` and does
 * not care which of the two it got.
 */
export function SchemeProvider({ children }: { children: ReactNode }) {
  const system = useSystemScheme() === "dark" ? "dark" : "light";
  const [appearance, setStored] = useState<Appearance>("system");

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then((v) => {
        if (alive && (v === "light" || v === "dark" || v === "system")) setStored(v);
      })
      // Losing the preference costs one wrong theme, not a broken app.
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const setAppearance = useCallback((a: Appearance) => {
    setStored(a);
    AsyncStorage.setItem(KEY, a).catch(() => {});
  }, []);

  const scheme: Scheme = appearance === "system" ? system : appearance;

  const value = useMemo(
    () => ({ appearance, scheme, setAppearance }),
    [appearance, scheme, setAppearance],
  );

  return <SchemeContext.Provider value={value}>{children}</SchemeContext.Provider>;
}

/** What is on screen right now. Use this instead of `useColorScheme()`. */
export function useScheme(): Scheme {
  return useContext(SchemeContext)?.scheme ?? "light";
}

/** The setting itself, for the control that changes it. */
export function useAppearance() {
  const ctx = useContext(SchemeContext);
  if (!ctx) throw new Error("useAppearance must be used inside SchemeProvider");
  return ctx;
}
