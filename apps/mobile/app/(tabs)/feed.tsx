import { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, space } from "@/theme";
import { curatedNear } from "@/curated";
import { SpotCard } from "@/components/SpotCard";
import { Wordmark } from "@/components/Wordmark";
import { useLiveLocation } from "@/useLiveLocation";

const FALLBACK = { lat: 30.3322, lng: -81.6557 };

export default function FeedScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { location } = useLiveLocation(false);

  const centre = location ?? FALLBACK;

  // Nobody you follow has marked anything yet, because nobody exists yet. The
  // feed shows the picks and says so, rather than inventing strangers.
  const data = useMemo(
    () => curatedNear(centre.lat, centre.lng),
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
              Nobody you follow has marked anything
            </Text>
            <Text style={[type.body, { color: c.muted, marginTop: 6 }]}>
              So here are ours. Thirteen real places, most of which you have
              probably never heard of.
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
