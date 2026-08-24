import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, space } from "@/theme";
import { SAMPLE_MARKS } from "@/sample";
import { SpotCard } from "@/components/SpotCard";

export default function FeedScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <FlatList
        data={SAMPLE_MARKS}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{
          padding: space.md,
          paddingTop: insets.top + space.md,
          gap: space.md,
          paddingBottom: space.xl,
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: space.xs }}>
            <Text style={[type.hero, { color: c.ink }]}>Marked this week</Text>
            <Text style={[type.body, { color: c.muted, marginTop: 6 }]}>
              From the people you follow.
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
