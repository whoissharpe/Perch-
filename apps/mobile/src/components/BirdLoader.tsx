import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import { Image } from "expo-image";
import { useScheme } from "@/scheme";
import { BIRD, type BirdPose } from "@/birdSprites";

/**
 * The bird, hovering, instead of a spinner.
 *
 * A rotating ring is the same on every app ever made. This is two sprite
 * frames on a timer plus a small vertical bob — the bird holding station,
 * which is what waiting looks like for something with wings.
 *
 * The bob runs on the native driver; the wing swap is a timer, because two
 * discrete frames are the whole animation and interpolating between them
 * would read as a cross-fade rather than a flap.
 */
export function BirdLoader({
  size = 44,
  tint,
}: {
  size?: number;
  /** Force a tint. Omit to follow the colour scheme. */
  tint?: "pine" | "paper";
}) {
  const scheme = useScheme() === "dark" ? "paper" : "pine";
  const use = tint ?? scheme;

  const [pose, setPose] = useState<BirdPose>("spread");
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const flap = setInterval(
      () => setPose((p) => (p === "up" ? "spread" : "up")),
      130,
    );

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => {
      clearInterval(flap);
      loop.stop();
    };
  }, [bob]);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      style={{ width: size, height: size }}
    >
      <Animated.View
        style={{
          transform: [
            {
              translateY: bob.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -size * 0.13],
              }),
            },
          ],
        }}
      >
        <Image
          source={BIRD[use][pose]}
          style={{ width: size, height: size }}
          contentFit="contain"
          transition={0}
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
    </View>
  );
}
