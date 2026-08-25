import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, radius, space } from "@/theme";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Mark } from "@/components/Mark";
import { useFirstRun } from "@/firstRun";
import { PICKS } from "@/curated";

const { width } = Dimensions.get("window");

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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === "dark";
  const { finish } = useFirstRun();

  const scroller = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  const last = index === PANES.length - 1;

  function goTo(i: number) {
    scrollToPane(scroller.current, i * width);
    setIndex(i);
    Animated.timing(progress, {
      toValue: i,
      duration: 260,
      // Width cannot be driven natively; this is a 3-step bar, not a per-frame
      // animation, so the JS driver is the right trade here.
      useNativeDriver: false,
    }).start();
  }

  async function done() {
    await finish();
    router.replace("/");
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
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== index) goTo(i);
        }}
        style={{ flex: 1 }}
      >
        {PANES.map((p) => {
          const shot = PICKS[p.pick];
          return (
            <View key={p.key} style={[styles.pane, { width }]}>
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
    } else {
      // Older engines ignore the options object entirely; jump instead of
      // doing nothing.
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
