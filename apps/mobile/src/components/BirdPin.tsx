import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { BIRD, LANDING, LANDING_MS, type BirdPose, type BirdTint } from "@/birdSprites";

/**
 * A marked spot's pin. Zoomed out it is the bird alone; once the map is close
 * enough for a bench to read, the bird swoops down, beats its wings twice and
 * lands on one.
 */
export function BirdPin({
  tint,
  perched,
  selected,
  index,
}: {
  tint: BirdTint;
  perched: boolean;
  selected: boolean;
  index: number;
}) {
  const [pose, setPose] = useState<BirdPose>("perched");
  const lift = useRef(new Animated.Value(0)).current;
  const benchIn = useRef(new Animated.Value(perched ? 1 : 0)).current;
  const birdOut = useRef(new Animated.Value(perched ? 0 : 1)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const first = useRef(true);

  useEffect(() => {
    // Do not play the landing on mount — only when the zoom actually crosses.
    if (first.current) {
      first.current = false;
      return;
    }

    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (!perched) {
      setPose("perched");
      lift.setValue(0);
      Animated.parallel([
        Animated.timing(benchIn, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(birdOut, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      return;
    }

    // A small stagger so a screenful of birds does not land in lockstep.
    const offset = (index % 5) * 55;

    benchIn.setValue(0);
    birdOut.setValue(1);

    LANDING.forEach((step) => {
      timers.current.push(
        setTimeout(() => {
          setPose(step.pose);
          Animated.timing(lift, {
            toValue: -step.lift,
            duration: 120,
            easing: Easing.bezier(0.32, 0.72, 0, 1),
            useNativeDriver: true,
          }).start();
        }, offset + step.at),
      );
    });

    timers.current.push(
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(benchIn, { toValue: 1, duration: 220, useNativeDriver: true }),
          Animated.timing(birdOut, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start();
      }, offset + LANDING_MS),
    );

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [perched, index, lift, benchIn, birdOut]);

  const size = 76;

  // Selected: wings wide and larger. It is the tell that this is the bird
  // whose post is open below, and it reads from across the map.
  const shownPose = selected ? "spread" : pose;

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, transform: [{ scale: selected ? 1.55 : 1 }] },
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: selected ? 1 : birdOut,
            transform: [{ translateY: lift }],
          },
        ]}
      >
        <Image source={BIRD[tint][shownPose]} style={styles.img} contentFit="contain" />
      </Animated.View>

      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: selected ? 0 : benchIn }]}
      >
        <Image source={BIRD[tint].mark} style={styles.img} contentFit="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  img: { width: "100%", height: "100%" },
});
