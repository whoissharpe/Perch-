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
  scale,
  far,
}: {
  tint: BirdTint;
  perched: boolean;
  selected: boolean;
  index: number;
  /** Size at the current zoom, as a fraction of the full pin. */
  scale: number;
  /** Too far out for a bird to read — draw a dot instead. */
  far: boolean;
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
  const showDot = far && !selected;

  if (showDot) {
    // A 76px bird at city scale collides with its neighbours into an
    // unreadable pile, so far out each spot is just a point.
    return (
      <View style={styles.dotWrap}>
        <View style={[styles.dot, { backgroundColor: BLAZE }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          transform: [{ scale: scale * (selected ? 1.5 : 1) }],
        },
      ]}
    >
      {/* the flying / standing bird */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: selected ? 0 : birdOut,
            transform: [{ translateY: lift }],
          },
        ]}
      >
        <Image source={BIRD[tint][pose]} style={styles.img} contentFit="contain" />
      </Animated.View>

      {/* settled on the bench, wings closed */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: selected ? 0 : benchIn }]}
      >
        <Image source={BIRD[tint].mark} style={styles.img} contentFit="contain" />
      </Animated.View>

      {/* open: turned to face you, wings spread, while its post is showing */}
      <View style={[StyleSheet.absoluteFill, { opacity: selected ? 1 : 0 }]}>
        <Image source={BIRD[tint].open} style={styles.img} contentFit="contain" />
      </View>
    </View>
  );
}

const BLAZE = "#e1622f";

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  dotWrap: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  dot: { width: 11, height: 11, borderRadius: 5.5 },
  img: { width: "100%", height: "100%" },
});
