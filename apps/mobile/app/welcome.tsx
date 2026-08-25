import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useTransition } from "@/transition";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, space } from "@/theme";
import { Mark } from "@/components/Mark";
import { Button } from "@/components/Button";
import { PICKS } from "@/curated";

/**
 * The first screen.
 *
 * Deliberately one idea and two buttons. A welcome screen that explains the
 * product has already failed — that is what onboarding is for, and the fastest
 * way through this screen is the point of it.
 *
 * The photographs behind the mark are three of the real picks rather than
 * stock or an illustration: the product is other people's photographs of
 * places to sit, so the first screen may as well be exactly that.
 */
export default function WelcomeScreen() {
  const c = useTheme();
  const router = useRouter();
  const { flyTo } = useTransition();
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === "dark";

  /**
   * Three picks, chosen rather than sliced off the top of the list.
   *
   * `slice(0, 3)` gave whatever happened to be nearest, which put the
   * Southbank Riverwalk photo — a large blue wayfinding sign — dead centre as
   * the first thing anyone sees. These three are picked to read at thumbnail
   * size: the Loiba bench facing the Atlantic in the middle, because it is the
   * clearest picture of what this app is for.
   */
  const shots = [PICKS[0], PICKS[3], PICKS[8]].filter(Boolean);

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      {/* A loose fan of real picks, angled so it reads as photographs on a
          table rather than a carousel the user is meant to swipe. */}
      <View style={styles.deck} pointerEvents="none">
        {shots.map((p, i) => (
          <View
            key={p.name}
            style={[
              styles.shot,
              {
                backgroundColor: c.surface,
                borderColor: c.line,
                transform: [
                  { rotate: `${(i - 1) * 5}deg` },
                  // Tighter than it was: at ±96 with a 7° tilt the outer
                  // corners ran off both edges of a 390pt screen.
                  { translateX: (i - 1) * 70 },
                  { translateY: Math.abs(i - 1) * 16 },
                  { scale: i === 1 ? 1 : 0.92 },
                ],
                zIndex: i === 1 ? 2 : 1,
                shadowColor: "#000",
                shadowOpacity: dark ? 0.5 : 0.16,
                shadowRadius: 22,
                shadowOffset: { width: 0, height: 10 },
                elevation: 8,
              },
            ]}
          >
            <Image source={{ uri: p.image }} style={styles.img} contentFit="cover" />
          </View>
        ))}
        {/* Fades the deck into the page so the type below never fights it.
            Stepped bands rather than one flat panel: a single 92%-opaque block
            left a visible hard line straight across the photographs. Six bands
            read as a gradient without pulling in a dependency for one edge. */}
        <View style={styles.veil} pointerEvents="none">
          {VEIL_STEPS.map((o, i) => (
            <View key={i} style={{ height: 26, backgroundColor: c.paper, opacity: o }} />
          ))}
        </View>
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom + space.lg }]}>
        <Mark size={54} />

        <Text style={[type.hero, styles.title, { color: c.ink }]}>
          Somewhere good{"\n"}to sit
        </Text>
        <Text style={[type.body, styles.blurb, { color: c.body }]}>
          A map of benches, viewpoints and quiet places to stop — marked by the
          people who actually sat there.
        </Text>

        <View style={styles.actions}>
          <Button label="Get started" onPress={() => flyTo("/onboarding")} />
          <Pressable
            onPress={() => router.push("/sign-in")}
            accessibilityRole="button"
            style={styles.link}
          >
            <Text style={[type.small, { color: c.muted }]}>
              I already have an account
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** Bottom-up opacity ramp for the fade under the photo deck. */
const VEIL_STEPS = [0.12, 0.3, 0.52, 0.72, 0.88, 1];

const styles = StyleSheet.create({
  fill: { flex: 1 },
  deck: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "58%",
    alignItems: "center",
    justifyContent: "center",
  },
  shot: {
    position: "absolute",
    width: 172,
    height: 230,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  veil: { position: "absolute", left: 0, right: 0, bottom: 0 },
  body: {
    marginTop: "auto",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
  },
  title: { marginTop: space.md },
  blurb: { marginTop: space.sm, maxWidth: 340 },
  actions: { marginTop: space.lg, gap: space.sm },
  link: { alignItems: "center", paddingVertical: 14 },
});
