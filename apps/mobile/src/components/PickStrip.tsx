import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useTheme, useShadow, type, radius, space } from "@/theme";
import { PerchBadge } from "./PerchBadge";
import { Mark } from "./Mark";
import type { SampleMark } from "@/sample";

/**
 * A rail of the team's picks along the bottom of the map.
 *
 * This is the answer to a first run: the map alone tells you nothing about
 * what a good mark looks like. Tapping one flies the map to it, so the strip
 * is a way of walking somebody around their own neighbourhood rather than a
 * decorative banner.
 *
 * It hides itself the moment a spot is selected — the detail sheet takes the
 * same corner, and two stacked cards down there was the thing that made the
 * old layout feel cluttered.
 *
 * It can also be put away. Standing permanently across the bottom third of a
 * map is a lot of rent for a suggestion, and the map is the product; the
 * dismiss control hands that space back, and the heading pill brings the rail
 * out again.
 */
export function PickStrip({
  picks,
  onPick,
  onDismiss,
}: {
  picks: SampleMark[];
  onPick: (id: string) => void;
  onDismiss: () => void;
}) {
  const c = useTheme();
  const lift = useShadow("md");

  if (picks.length === 0) return null;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.heading}>
        <View style={[styles.headPill, lift, { backgroundColor: c.pine }]}>
          <Mark size={15} tint="paper" />
          <Text style={[type.meta, { color: c.onPine }]}>PERCH PICKS</Text>
        </View>

        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Hide Perch Picks"
          hitSlop={10}
          style={[styles.hide, lift, { backgroundColor: c.surface, borderColor: c.line }]}
        >
          <Text style={[type.meta, { color: c.muted }]}>HIDE</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
        // The rail overhangs the screen edge on purpose: a card cut off at the
        // right is the clearest possible signal that it scrolls.
        decelerationRate="fast"
        snapToInterval={CARD + space.sm}
      >
        {picks.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => onPick(p.id)}
            style={({ pressed }) => [
              styles.card,
              lift,
              {
                backgroundColor: c.surface,
                borderColor: c.line,
                transform: [{ scale: pressed ? 0.975 : 1 }],
              },
            ]}
          >
            <View style={styles.mediaWrap}>
              <Image
                source={{ uri: p.image }}
                style={styles.media}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.badge}>
                <PerchBadge compact />
              </View>
            </View>

            <View style={styles.body}>
              <Text style={[type.cardTitle, { color: c.ink }]} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={[type.small, { color: c.body, marginTop: 3 }]} numberOfLines={1}>
                {p.note}
              </Text>
              <Text style={[type.meta, { color: c.muted, marginTop: 6 }]}>
                {away(p.metresAway ?? 0)}
              </Text>
            </View>
          </Pressable>
        ))}

        <View style={[styles.card, styles.endCard, { borderColor: c.line }]}>
          <Mark size={30} />
          <Text style={[type.cardTitle, { color: c.ink, textAlign: "center", marginTop: 8 }]}>
            Now find your own
          </Text>
          <Text
            style={[type.small, { color: c.muted, textAlign: "center", marginTop: 4 }]}
          >
            None of these are near you. That is the point — there is one that
            should be, and nobody has marked it.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * Distance, said the way a person would say it. These are real places at real
 * coordinates, so most of them are nowhere near the user — the label gives a
 * walk time only when walking is actually plausible, and otherwise just states
 * the distance rather than dressing it up.
 */
function away(m: number) {
  if (m <= 0) return "";
  if (m < 2000) {
    // 80 m/min is an unhurried pace, which is the pace this app is for.
    return `${Math.max(1, Math.round(m / 80))} MIN WALK · ${Math.round(m)} M`;
  }
  const km = m / 1000;
  return `${km < 100 ? km.toFixed(1) : Math.round(km).toLocaleString()} KM AWAY`;
}

const CARD = 208;

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, bottom: 30, zIndex: 4 },
  heading: {
    paddingHorizontal: space.md,
    marginBottom: space.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hide: {
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  headPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 7,
    paddingRight: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  rail: { paddingHorizontal: space.md, gap: space.sm },
  card: {
    width: CARD,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  mediaWrap: { width: "100%", height: 96 },
  media: { width: "100%", height: "100%" },
  badge: { position: "absolute", top: 7, left: 7 },
  body: { padding: 11 },
  endCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: space.md,
    backgroundColor: "transparent",
    borderStyle: "dashed",
  },
});
