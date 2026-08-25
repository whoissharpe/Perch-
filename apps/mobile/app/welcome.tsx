import { Image } from "expo-image";
import { useRouter } from "expo-router";
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
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === "dark";

  const shots = PICKS.slice(0, 3);

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
                  { rotate: `${(i - 1) * 7}deg` },
                  { translateX: (i - 1) * 96 },
                  { translateY: Math.abs(i - 1) * 18 },
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
        {/* Fades the deck into the page so the type below never fights it. */}
        <View
          style={[styles.veil, { backgroundColor: c.paper }]}
          // The gradient is faked with opacity because a real one would pull in
          // a dependency for a single decorative edge.
        />
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
          <Button label="Get started" onPress={() => router.push("/onboarding")} />
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
    width: 186,
    height: 248,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  veil: { position: "absolute", left: 0, right: 0, bottom: 0, height: 130, opacity: 0.92 },
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
