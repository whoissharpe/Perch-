import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, space } from "@/theme";
import { SAMPLE_MARKS } from "@/sample";
import { curatedNear } from "@/curated";
import { SpotCard } from "@/components/SpotCard";
import { Wordmark } from "@/components/Wordmark";
import { useLiveLocation } from "@/useLiveLocation";

const FALLBACK = { lat: 38.7223, lng: -9.1394 };

export default function FeedScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { location } = useLiveLocation(false);

  const centre = location ?? FALLBACK;

  // Two picks lead the feed. Enough to set the standard for what a mark looks
  // like; not so many that the feed becomes the team talking to itself.
  const data = useMemo(
    () => [...curatedNear(centre.lat, centre.lng).slice(0, 2), ...SAMPLE_MARKS],
    [centre.lat, centre.lng],
  );

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <FlatList
        data={data}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{
          padding: space.md,
          paddingTop: insets.top + space.md,
          gap: space.md,
          paddingBottom: space.xl,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: space.xs }}>
            <Wordmark size={22} tone={c.pine} />
            <Text style={[type.hero, { color: c.ink, marginTop: space.sm }]}>
              Marked this week
            </Text>
            <Text style={[type.body, { color: c.muted, marginTop: 6 }]}>
              From the people you follow, and a couple from us.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View>
            <SpotCard mark={item} />
            <Text style={[type.body, { color: c.body, marginTop: space.sm }]}>
              {item.caption}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Wordmark size={26} tone={c.muted} />
            <Text style={[type.small, { color: c.muted, marginTop: 8, textAlign: "center" }]}>
              Somewhere near you there is one nobody has marked yet.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  footer: { alignItems: "center", paddingTop: space.xl, paddingBottom: space.lg },
});
