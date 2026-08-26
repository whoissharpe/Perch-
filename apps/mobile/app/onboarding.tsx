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
import { thumb } from "@/media";

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


  /**
   * The strip's offset in pixels. One value, one driver.
   *
   * This was two values composed with Animated.add: a native-driven slide plus
   * a JS-driven drag. React Native cannot mix drivers inside one transform —
   * the composed node ends up half on each side of the bridge — and that is
   * what was left of the glitch after the scroll container went. A single
   * value on the JS driver has nothing to desynchronise against, and the drag
   * writes to the very same value the animation settles.
   */
  const x = useRef(new Animated.Value(0)).current;
  /** Where the strip rests for the current pane, so a drag can start from it. */
  const restX = useRef(0);

  // Keep the resting offset correct if the window changes width mid-session.
  const paneWRef = useRef(paneW);
  useEffect(() => {
    paneWRef.current = paneW;
    const at = -indexRef.current * paneW;
    restX.current = at;
    x.setValue(at);
  }, [paneW, x]);


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
    const target = -next * paneW;
    indexRef.current = next;
    restX.current = target;
    setIndex(next);

    let arrived = false;

    Animated.timing(x, {
      toValue: target,
      duration: SLIDE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      arrived = finished;
    });

    // Arrival without frames. Animated only advances while frames are drawn,
    // so in a throttled view the pane would never change.
    //
    // Crucially this fires *only if the animation did not finish*. Writing the
    // value unconditionally — which is what it used to do — snapped the strip
    // the last few pixels on every single transition, on top of an animation
    // that had worked perfectly well. That was a self-inflicted stutter at the
    // end of every swipe.
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      if (arrived) return;
      x.setValue(target);
    }, SLIDE_MS + 120);
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
      onPanResponderMove: (_e, g) => {
        // Rubber-band past the ends rather than letting the strip run off
        // into empty space: resistance tells you there is nothing there.
        const raw = restX.current + g.dx;
        const min = -(PANES.length - 1) * paneWRef.current;
        const over = raw > 0 ? raw : raw < min ? raw - min : 0;
        x.setValue(over === 0 ? raw : raw - over * 0.6);
      },
      onPanResponderRelease: (_e, g) => {
        // A quick flick counts as much as a long drag.
        const far = Math.abs(g.dx) > 90 || Math.abs(g.vx) > 0.35;
        if (far) goToRef.current(indexRef.current + (g.dx < 0 ? 1 : -1));
        // Not far enough: fall back to where it started.
        else goToRef.current(indexRef.current);
      },
      onPanResponderTerminate: () => goToRef.current(indexRef.current),
    }),
  ).current;

  async function done() {
    await finish();
    // The bird carries you out of the intro and into the map.
    flyTo("/", "replace");
  }

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <View style={[styles.top, { paddingTop: insets.top + space.sm }]}>
        <Mark size={26} />

        {/* Discrete segments rather than a growing bar. The fill used to be
            an animated width percentage, which forces a layout pass on every
            frame of every transition — the most expensive way there is to
            move four pixels. Segments change colour instead, which costs
            nothing, and they match what the bar was always meant to say. */}
        <View style={styles.track}>
          {PANES.map((p, i) => (
            <View
              key={p.key}
              style={[
                styles.seg,
                { backgroundColor: i <= index ? c.pine : c.sunk },
              ]}
            />
          ))}
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
            { width: paneW * PANES.length, transform: [{ translateX: x }] },
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
                    source={{ uri: thumb(shot.image, 350) }}
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
  track: { flex: 1, flexDirection: "row", gap: 4 },
  seg: { flex: 1, height: 4, borderRadius: 2 },
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
