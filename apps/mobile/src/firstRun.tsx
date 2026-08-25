import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "perch.onboarded.v1";

interface FirstRunValue {
  /**
   * `null` until storage has been read. Deliberately distinct from `false`:
   * the root layout has to hold rather than flash the welcome screen at
   * somebody who dismissed it months ago.
   */
  onboarded: boolean | null;
  finish: () => Promise<void>;
}

const FirstRunContext = createContext<FirstRunValue | null>(null);

/**
 * Whether this install has been through welcome and onboarding.
 *
 * This is a provider rather than a plain hook because the flag has two
 * readers: the redirect gate in the root layout, and the onboarding screen
 * that sets it. As independent hook instances they each held their own copy,
 * so finishing onboarding set one and the gate kept reading the other — and
 * bounced the user straight back to the welcome screen.
 *
 * Versioned in the key so a future rewrite of onboarding can decide to show
 * itself again without colliding with the old flag.
 */
export function FirstRunProvider({ children }: { children: ReactNode }) {
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then((v) => {
        if (alive) setOnboarded(v === "1");
      })
      // A storage failure should not lock anyone out; treat it as "already
      // onboarded" so the worst case is a missed intro, not a wall.
      .catch(() => {
        if (alive) setOnboarded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const finish = useCallback(async () => {
    setOnboarded(true);
    try {
      await AsyncStorage.setItem(KEY, "1");
    } catch {
      // Same reasoning: losing the flag costs one repeated intro, nothing more.
    }
  }, []);

  const value = useMemo(() => ({ onboarded, finish }), [onboarded, finish]);

  return <FirstRunContext.Provider value={value}>{children}</FirstRunContext.Provider>;
}

export function useFirstRun() {
  const ctx = useContext(FirstRunContext);
  if (!ctx) throw new Error("useFirstRun must be used inside FirstRunProvider");
  return ctx;
}
