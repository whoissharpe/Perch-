import { useColorScheme } from "react-native";
import { Image } from "expo-image";
import { BIRD } from "@/birdSprites";

/**
 * The wordmark's bird-on-a-bench, for use inside the interface.
 *
 * Uses the transparent, tinted mark rather than assets/icon.png — the icon has
 * an opaque paper plate baked in (the App Store rejects alpha), which reads as
 * a pale square when it sits on any other surface.
 */
export function Mark({ size = 26 }: { size?: number }) {
  const tint = useColorScheme() === "dark" ? "paper" : "pine";

  return (
    <Image
      source={BIRD[tint].mark}
      style={{ width: size, height: size }}
      contentFit="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
