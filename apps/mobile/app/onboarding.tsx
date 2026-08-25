import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
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
 */
// Picks chosen from opposite ends of the list on purpose: three photographs of
// the same city would make the map look local, which is the wrong first
// impression.
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

  const scroller = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  /**
   * Pane width, live.
   *
   * This was a `Dimensions.get("window")` snapshot taken once at module load.
   * Wherever that disagreed with the real width — a resized window, a browser
   * that had not settled its layout when the bundle evaluated — `i * width`
   * scrolled past the end, the browser clamped it, and every later tap
   * computed the same index straight back. Next worked once and then did
   * nothing.
   *
   * `useWindowDimensions` re-renders on change, so the value cannot go stale.
   * An `onLayout` measurement would be tighter still, but it depends on a
   * ResizeObserver firing and I could not verify that it does here; a hook
   * that is right from the first render is the safer trade.
   */
  const { width: paneW } = useWindowDimensions();

  /**
   * True while a programmatic scroll is in flight, so the momentum handler
   * does not answer our own scroll by issuing another one.
   */
  const programmatic = useRef(false);
  const release = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Do not leave a timer running past the screen.
  useEffect(
    () => () => {
      if (release.current) clearTimeout(release.current);
    },
    [],
  );

  const last = index === PANES.length - 1;

  /** Move to a pane. `scroll` is false when the user got there by swiping. */
  function goTo(i: number, scroll = true) {
    const next = Math.max(0, Math.min(PANES.length - 1, i));
    setIndex(next);
    Animated.timing(progress, {
      toValue: next,
      duration: 260,
      // Width cannot be driven natively; this is a 3-step bar, not a per-frame
      // animation, so the JS driver is the right trade here.
      useNativeDriver: false,
    }).start();

    if (!scroll || paneW === 0) return;
    programmatic.current = true;
    if (release.current) clearTimeout(release.current);
    release.current = setTimeout(() => {
      programmatic.current = false;
    }, 600);
    scrollToPane(scroller.current, next * paneW);
  }

  async function done() {
    await finish();
    // The bird carries you out of the intro and into the map.
    flyTo("/", "replace");
  }

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
          // 44 wide minimum, even though the word is short.
          style={styles.skip}
        >
          <Text style={[type.small, { color: c.muted }]}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          // Ignore the tail of our own scroll; only a real swipe should move
          // the index from here, and it must never re-issue a scroll.
          if (programmatic.current || paneW === 0) return;
          const i = Math.round(e.nativeEvent.contentOffset.x / paneW);
          if (i !== index) goTo(i, false);
        }}
        style={{ flex: 1 }}
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
      </ScrollView>

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

/**
 * Move the pager to an offset, on either platform.
 *
 * On native the ref is a ScrollView instance and takes React Native's
 * `{ x, y, animated }`. On web the same ref resolves to the underlying DOM
 * node, whose `scrollTo` expects `{ left, top, behavior }` and *silently
 * ignores* keys it does not recognise — so the native-shaped call is a no-op.
 * That is why the counter and the progress bar advanced while the panes sat
 * still: everything except the actual scroll was working.
 */
function scrollToPane(node: ScrollView | null, x: number) {
  if (!node) return;
  // A DOM element has nodeType 1; a ScrollView instance does not.
  if ((node as unknown as { nodeType?: number }).nodeType === 1) {
    const el = node as unknown as HTMLElement;
    if (typeof el.scrollTo === "function") {
      el.scrollTo({ left: x, behavior: "smooth" });
      // Smooth scrolling is frame-driven, so it does not run at all in a
      // backgrounded tab, and some browsers and OS settings disable it
      // outright. Check afterwards and jump if nothing moved: arriving
      // instantly beats never arriving.
      setTimeout(() => {
        if (Math.abs(el.scrollLeft - x) > 2) el.scrollLeft = x;
      }, 420);
    } else {
      // Older engines ignore the options object entirely.
      el.scrollLeft = x;
    }
    return;
  }
  node.scrollTo({ x, y: 0, animated: true });
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
