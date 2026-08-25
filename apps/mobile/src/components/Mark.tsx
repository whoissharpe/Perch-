import { useColorScheme } from "react-native";
import { Image } from "expo-image";
import { BIRD, type BirdTint } from "@/birdSprites";

/**
 * The wordmark's bird-on-a-bench, for use inside the interface.
 *
 * Uses the transparent, tinted mark rather than assets/icon.png — the icon has
 * an opaque paper plate baked in (the App Store rejects alpha), which reads as
 * a pale square when it sits on any other surface.
 */
export function Mark({
  size = 26,
  tint,
}: {
  size?: number;
  /** Force a tint. Omit to follow the colour scheme. */
  tint?: BirdTint;
}) {
  const scheme = useColorScheme() === "dark" ? "paper" : "pine";
  const use = tint ?? scheme;

  return (
    <Image
      source={BIRD[use].mark}
      style={{ width: size, height: size }}
      contentFit="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
