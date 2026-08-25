import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, space } from "@/theme";
import { curatedNear } from "@/curated";
import { SpotCard } from "@/components/SpotCard";
import { Wordmark } from "@/components/Wordmark";
import { EmptyPerch } from "@/components/EmptyPerch";

/** Saved is what you reach for on the walk, so it stays deliberately plain. */
export default function SavedScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  // Nothing is really saved until auth and Supabase are wired up; showing
  // a few picks is honest as long as it is not dressed up as the user's own.
  const saved = curatedNear(0, 0).slice(0, 3);

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <FlatList
        data={saved}
        keyExtractor={(m) => m.id}
        numColumns={2}
        columnWrapperStyle={{ gap: space.sm }}
        contentContainerStyle={{
          padding: space.md,
          paddingTop: insets.top + space.md,
          gap: space.sm,
          paddingBottom: space.xl,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: space.sm }}>
            <Wordmark size={20} />
            <Text style={[type.hero, { color: c.ink, marginTop: space.sm }]}>Saved</Text>
            <Text style={[type.body, { color: c.muted, marginTop: 6 }]}>
              Nothing saved yet — these are ours, so the screen has something
              to show. Yours will replace them.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyPerch
            title="Nothing saved yet"
            body="Tap the bookmark on a spot and it waits here for the walk."
          />
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <SpotCard mark={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
