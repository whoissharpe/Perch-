import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, radius, space } from "@/theme";
import { SAMPLE_MARKS } from "@/sample";
import { SpotCard } from "@/components/SpotCard";

export default function ProfileScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const mine = SAMPLE_MARKS.slice(0, 2);

  return (
    <ScrollView
      style={{ backgroundColor: c.paper }}
      contentContainerStyle={{
        padding: space.md,
        paddingTop: insets.top + space.md,
        paddingBottom: space.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.head}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.mark}
          contentFit="contain"
        />
        <View style={{ flex: 1 }}>
          <Text style={[type.title, { color: c.ink }]}>@you</Text>
          <Text style={[type.small, { color: c.muted, marginTop: 2 }]}>
            Joined this week
          </Text>
        </View>
      </View>

      <View style={[styles.stats, { borderColor: c.line }]}>
        {[
          ["2", "Marked"],
          ["4", "Saved"],
          ["11", "Following"],
        ].map(([n, label]) => (
          <View key={label} style={{ flex: 1 }}>
            <Text style={[type.title, { color: c.ink }]}>{n}</Text>
            <Text style={[type.meta, { color: c.muted, marginTop: 2 }]}>
              {label.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.pro,
          { backgroundColor: c.pineSoft, borderColor: "transparent" },
        ]}
      >
        <Text style={[type.cardTitle, { color: c.pine }]}>Perch Pro</Text>
        <Text style={[type.small, { color: c.body, marginTop: 4 }]}>
          Offline maps, rest routing and shade by time of day. €3.50 a month,
          free for 30 days.
        </Text>
      </View>

      <Text style={[type.title, { color: c.ink, marginTop: space.lg }]}>
        Your marks
      </Text>
      <View style={{ gap: space.md, marginTop: space.sm }}>
        {mine.map((m) => (
          <SpotCard key={m.id} mark={m} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", gap: space.sm },
  mark: { width: 54, height: 54 },
  stats: {
    flexDirection: "row",
    marginTop: space.lg,
    paddingVertical: space.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  pro: {
    marginTop: space.lg,
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
