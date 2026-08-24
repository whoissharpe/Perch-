import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";
import { palette } from "@perch/core";

export default function RootLayout() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const c = palette[scheme];

  const [ready] = useFonts({
    Fraunces_600SemiBold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    SpaceMono_400Regular,
  });

  // Holding the splash until the display face is ready avoids a flash of
  // system serif, which reads as a different product entirely.
  if (!ready) return null;

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
        <Stack.Screen
          name="mark"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="spot/[id]" options={{ animation: "slide_from_right" }} />
      </Stack>
    </>
  );
}
