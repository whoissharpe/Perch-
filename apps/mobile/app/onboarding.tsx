import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScheme } from "@/scheme";
import { useTheme, type, radius, space } from "@/theme";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Mark } from "@/components/Mark";
import { useFirstRun } from "@/firstRun";
import { useTransition } from "@/transition";
import { PICKS } from "@/curated";

/**
 * Three panes, and a way out on every one of them.
 *
 * The rule this is built around: onboarding earns attention by explaining what
 * the app is *for*, not by listing features, and it must never be a wall. Skip
 * is present from the first pane and finishes the flow properly rather than
 * dumping the user somewhere half-configured.
 *
 * The progress bar is segmented rather than a dot row because dots stop being
 * readable as progress the moment there are more than about four of them, and
 * because a bar answers "how much is left" at a glance.
 *
 * The pager is a transform, not a scroll view. It used to be a horizontal
 * ScrollView with pagingEnabled, which on the web sets CSS scroll-snap to
 * mandatory — and the browser's snap engine kept overriding the programmatic
 * scroll and re-snapping to the pane we had just left, so Next appeared to go
 * backwards. Trying to rescue that with timers only made it judder, because
 * the rescue and the snap took turns undoing each other. Driving translateX
 * directly takes the browser out of the argument: nothing can snap, the
 * position is whatever we last set, and the same code runs on both platforms.
 * Swipe is a PanResponder, which is the same gesture without the container.
 */
// Picks chosen from opposite ends of the list on purpose: three photographs of
// the same city would make the map look local, which is the wrong first
// impression.
/** One pane's worth of travel. */
const SLIDE_MS = 340;

const PANES = [
  {
    key: "map",
    title: "A map of places to sit",
    body: "Benches, viewpoints and quiet corners, pulled live from open map data. Hollow rings are places nobody has photographed yet.",
    pick: 0,
  },
  {
    key: "mark",
    title: "Mark the ones worth it",
    body: "Take a photo where you're sitting. That's the whole thing. Your mark tells everyone else whether it's any good.",
    pick: 3,
  },
  {
    key: "walk",
    title: "Follow it on the walk",
    body: "The map keeps up as you go, so you can head for one without staring at your phone the whole way.",
    pick: 9,
  },
];

export default function OnboardingScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const dark = useScheme() === "dark";
  const { finish } = useFirstRun();
  const { flyTo } = useTransition();

  const { width: paneW } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;
  /** Settled offset, counted in panes rather than pixels. */
  const slide = useRef(new Animated.Value(0)).current;
  /** Live finger movement in pixels, added on top of the settled offset. */
  const drag = useRef(new Animated.Value(0)).current;

  const indexRef = useRef(0);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const last = index === PANES.length - 1;

  // Do not leave the settle timer running past the screen.
  useEffect(
    () => () => {
      if (settle.current) clearTimeout(settle.current);
    },
    [],
  );

  function goTo(i: number) {
    const next = Math.max(0, Math.min(PANES.length - 1, i));
    indexRef.current = next;
    setIndex(next);
    drag.setValue(0);

    Animated.parallel([
      Animated.timing(slide, {
        toValue: next,
        duration: SLIDE_MS,
        easing: Easing.bezier(0.32, 0.72, 0, 1),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: next,
        duration: SLIDE_MS,
        // Width cannot be driven natively; this is a 3-step bar, not a
        // per-frame animation, so the JS driver is the right trade here.
        useNativeDriver: false,
      }),
    ]).start();

    // Guarantee arrival. Animated.timing only advances while frames are being
    // drawn, so in a backgrounded or throttled view the strip would sit where
    // it was and the pane would never change — the same failure that has now
    // bitten the transition, the camera and this pager. setValue writes the
    // position directly, so if the animation did run this is a no-op and if it
    // did not, the pane still arrives.
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      slide.setValue(next);
      progress.setValue(next);
    }, SLIDE_MS + 80);
  }

  // The responder is created once, so it reaches the latest goTo through a ref
  // rather than closing over the first one.
  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  const pan = useRef(
    PanResponder.create({
      // Only claim the gesture once it is clearly horizontal, so a vertical
      // flick still belongs to the page rather than to the pager.
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_e, g) => drag.setValue(g.dx),
      onPanResponderRelease: (_e, g) => {
        // A quick flick counts as much as a long drag.
        const far = Math.abs(g.dx) > 90 || Math.abs(g.vx) > 0.35;
        if (far) goToRef.current(indexRef.current + (g.dx < 0 ? 1 : -1));
        else
          Animated.timing(drag, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }).start();
      },
      onPanResponderTerminate: () => {
        Animated.timing(drag, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  async function done() {
    await finish();
    // The bird carries you out of the intro and into the map.
    flyTo("/", "replace");
  }

  const stripX = Animated.add(
    slide.interpolate({
      inputRange: [0, PANES.length - 1],
      outputRange: [0, -paneW * (PANES.length - 1)],
    }),
    drag,
  );

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <View style={[styles.top, { paddingTop: insets.top + space.sm }]}>
        <Mark size={26} />

        <View style={[styles.track, { backgroundColor: c.sunk }]}>
          <Animated.View
            style={[
              styles.fillBar,
              {
                backgroundColor: c.pine,
                width: progress.interpolate({
                  inputRange: [0, PANES.length - 1],
                  outputRange: ["33%", "100%"],
                }),
              },
            ]}
          />
        </View>

        <Pressable
          onPress={done}
          accessibilityRole="button"
          accessibilityLabel="Skip the introduction"
          style={styles.skip}
        >
          <Text style={[type.small, { color: c.muted }]}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.viewport} {...pan.panHandlers}>
        <Animated.View
          style={[
            styles.strip,
            { width: paneW * PANES.length, transform: [{ translateX: stripX }] },
          ]}
        >
          {PANES.map((p) => {
            const shot = PICKS[p.pick];
            return (
              <View key={p.key} style={[styles.pane, { width: paneW }]}>
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: c.surface,
                      borderColor: c.line,
                      shadowColor: "#000",
                      shadowOpacity: dark ? 0.5 : 0.14,
                      shadowRadius: 26,
                      shadowOffset: { width: 0, height: 12 },
                      elevation: 10,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: shot.image }}
                    style={styles.img}
                    contentFit="cover"
                    transition={220}
                  />
                  <View style={[styles.caption, { backgroundColor: c.pine }]}>
                    <Icon name="pin" color={c.onPine} size={13} />
                    <Text style={[type.meta, { color: c.onPine }]}>
                      {shot.place.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={[type.title, { color: c.ink, marginTop: space.lg }]}>
                  {p.title}
                </Text>
                <Text style={[type.body, { color: c.body, marginTop: space.sm }]}>
                  {p.body}
                </Text>
              </View>
            );
          })}
        </Animated.View>
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + space.lg }]}>
        <Button
          label={last ? "Start exploring" : "Next"}
          onPress={() => (last ? done() : goTo(index + 1))}
        />
        <Text style={[type.meta, { color: c.muted, textAlign: "center", marginTop: 12 }]}>
          {`${index + 1} OF ${PANES.length}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
  },
  track: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  fillBar: { height: "100%", borderRadius: 2 },
  skip: { minWidth: 44, minHeight: 44, alignItems: "flex-end", justifyContent: "center" },
  viewport: { flex: 1, overflow: "hidden" },
  strip: { flex: 1, flexDirection: "row" },
  pane: { paddingHorizontal: space.lg, paddingTop: space.md },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    aspectRatio: 4 / 3,
  },
  img: { width: "100%", height: "100%" },
  caption: {
    position: "absolute",
    left: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  actions: { paddingHorizontal: space.lg, paddingTop: space.sm },
});
