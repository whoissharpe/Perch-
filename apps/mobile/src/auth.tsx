import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isConfigured } from "./supabase";

interface AuthValue {
  session: Session | null;
  /** Set while the stored session is being restored on cold start. */
  loading: boolean;
  /** True when signed in for real, or browsing in demo mode. */
  canPost: boolean;
  demo: boolean;
  handle: string | null;
  sendCode: (email: string) => Promise<{ error: string | null }>;
  verifyCode: (email: string, token: string) => Promise<{ error: string | null }>;
  continueAsDemo: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      loading,
      demo,
      canPost: Boolean(session) || demo,
      handle: session?.user?.email?.split("@")[0] ?? (demo ? "you" : null),

      /**
       * Email one-time code rather than a magic link: a link bounces the
       * user out to a browser and back, which is a miserable flow to hit
       * halfway up a hill.
       */
      async sendCode(email: string) {
        if (!isConfigured) {
          return { error: "Supabase is not configured yet. Add your keys to .env.local." };
        }
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true },
        });
        return { error: error?.message ?? null };
      },

      async verifyCode(email: string, token: string) {
        if (!isConfigured) {
          return { error: "Supabase is not configured yet." };
        }
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: "email",
        });
        return { error: error?.message ?? null };
      },

      continueAsDemo() {
        setDemo(true);
      },

      async signOut() {
        setDemo(false);
        if (isConfigured) await supabase.auth.signOut();
        setSession(null);
      },
    }),
    [session, loading, demo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
