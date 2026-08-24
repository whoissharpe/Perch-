import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, space } from "@/theme";
import { SAMPLE_MARKS } from "@/sample";
import { SpotCard } from "@/components/SpotCard";

/** Saved is what you reach for on the walk, so it stays deliberately plain. */
export default function SavedScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const saved = SAMPLE_MARKS.filter((m) => m.saves > 90);

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
            <Text style={[type.hero, { color: c.ink }]}>Saved</Text>
            <Text style={[type.body, { color: c.muted, marginTop: 6 }]}>
              {saved.length} spots. Available offline on Pro.
            </Text>
          </View>
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
