import { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KIND_LABELS, formatCoords } from "@perch/core";
import { useTheme, type, radius, space } from "@/theme";
import { Icon } from "@/components/Icon";
import { curatedById } from "@/curated";

export default function SpotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);

  const spot = curatedById(id);

  if (!spot) {
    return (
      <View style={[styles.fill, styles.center, { backgroundColor: c.paper }]}>
        <Text style={[type.body, { color: c.muted }]}>That spot has gone.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: space.xl * 2 }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Image source={{ uri: spot.image }} style={styles.hero} contentFit="cover" />
          <Pressable
            onPress={() => router.back()}
            style={[styles.back, { top: insets.top + 8 }]}
            hitSlop={10}
          >
            <Icon name="close" color="#fff" size={20} />
          </Pressable>
        </View>

        <View style={{ padding: space.md }}>
          <Text style={[type.meta, { color: c.clay }]}>
            {KIND_LABELS[spot.kind].toUpperCase()}
          </Text>
          <Text style={[type.hero, { color: c.ink, marginTop: 6 }]}>{spot.name}</Text>
          <Text style={[type.meta, { color: c.muted, marginTop: 8 }]}>
            {formatCoords(spot.lat, spot.lng)}
          </Text>

          <View style={styles.actions}>
            <Pressable
              onPress={() => setSaved((s) => !s)}
              style={[
                styles.action,
                {
                  backgroundColor: saved ? c.pine : "transparent",
                  borderColor: saved ? c.pine : c.line,
                },
              ]}
            >
              <Icon name="bookmark" color={saved ? c.onPine : c.ink} size={16} />
              <Text style={[type.body, { color: saved ? c.onPine : c.ink }]}>
                {saved ? "Saved" : "Save"}
              </Text>
            </Pressable>
            <Pressable style={[styles.action, { borderColor: c.line }]}>
              <Icon name="pin" color={c.ink} size={16} />
              <Text style={[type.body, { color: c.ink }]}>Directions</Text>
            </Pressable>
          </View>

          <View style={[styles.author, { borderColor: c.line }]}>
            <View style={[styles.avatar, { backgroundColor: c.pineSoft }]}>
              <Text style={{ color: c.pine, fontWeight: "600", fontSize: 13 }}>
                {spot.who.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { color: c.ink }]}>@{spot.who}</Text>
              <Text style={[type.small, { color: c.muted }]}>
                Marked this spot first
              </Text>
            </View>
            <Pressable
              style={[styles.follow, { borderColor: c.pine }]}
            >
              <Text style={[type.small, { color: c.pine }]}>Follow</Text>
            </Pressable>
          </View>

          <Text style={[type.body, { color: c.body, marginTop: space.md }]}>
            {spot.caption}
          </Text>

          {/* A pick is a real place, so every claim on this screen should be
              checkable, and the photographer has to be credited. */}
          {spot.source && (
            <Pressable
              onPress={() => Linking.openURL(spot.source!)}
              style={[styles.source, { borderColor: c.line }]}
            >
              <Text style={[type.small, { color: c.pine }]}>
                Verify this place on Wikipedia
              </Text>
              {spot.credit && (
                <Text style={[type.meta, { color: c.muted, marginTop: 3 }]}>
                  PHOTO: {spot.credit.toUpperCase()}
                </Text>
              )}
            </Pressable>
          )}

          <Text style={[type.title, { color: c.ink, marginTop: space.lg }]}>
            {spot.marks} marks here
          </Text>
          <Text style={[type.small, { color: c.muted, marginTop: 4 }]}>
            {spot.saves} people saved it
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  source: {
    marginTop: space.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.md - 4,
    borderWidth: 1,
    borderRadius: radius.sm,
  },
  fill: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  hero: { width: "100%", aspectRatio: 4 / 3 },
  back: {
    position: "absolute",
    left: space.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(22,33,29,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { flexDirection: "row", gap: space.sm, marginTop: space.md },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  author: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: 1,
  },
  avatar: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  follow: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
