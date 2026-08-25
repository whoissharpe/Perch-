import { useEffect } from "react";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";
import { palette } from "@perch/core";
import { AuthProvider } from "@/auth";
import { FirstRunProvider, useFirstRun } from "@/firstRun";
import { TransitionProvider } from "@/transition";
import { SchemeProvider, useScheme } from "@/scheme";

export default function RootLayout() {
  const [ready] = useFonts({
    Fraunces_600SemiBold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    SpaceMono_400Regular,
  });

  // Hold the splash until the display face is ready — a flash of system serif
  // reads as a different product entirely.
  if (!ready) return null;

  return (
    // Appearance sits outermost: the status bar and every screen background
    // below it resolve against the same choice, so the navigator itself has to
    // be a child of the provider rather than a sibling.
    <SchemeProvider>
      <AuthProvider>
        <FirstRunProvider>
          <TransitionProvider>
            <Navigation />
            <FirstRunGate />
          </TransitionProvider>
        </FirstRunProvider>
      </AuthProvider>
    </SchemeProvider>
  );
}

function Navigation() {
  const scheme = useScheme();
  const c = palette[scheme];

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.paper },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="welcome" options={{ animation: "fade" }} />
        <Stack.Screen name="onboarding" options={{ animation: "slide_from_right" }} />
        <Stack.Screen
          name="sign-in"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="mark"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="spot/[id]" options={{ animation: "slide_from_right" }} />
      </Stack>
    </>
  );
}

/**
 * Sends a first-time user to the welcome screen once the navigator exists.
 *
 * Rendering it as a child of the navigator is not enough on its own: effects
 * run child-first, so an effect here still fires before the Stack has finished
 * mounting and expo-router throws "Attempted to navigate before mounting the
 * Root Layout". Waiting for `useRootNavigationState().key` is the actual
 * ready signal. Guarding on `segments` keeps it from firing again while the
 * user is moving around inside the intro.
 */
function FirstRunGate() {
  const { onboarded } = useFirstRun();
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();

  useEffect(() => {
    // `null` means storage has not been read yet; do not redirect on a guess.
    if (!navState?.key || onboarded !== false) return;
    const top = segments[0];
    if (top === "welcome" || top === "onboarding" || top === "sign-in") return;
    router.replace("/welcome");
  }, [onboarded, segments, router, navState?.key]);

  return null;
}
