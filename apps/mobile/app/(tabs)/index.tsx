import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KIND_LABELS, type SpotKind } from "@perch/core";
import { useTheme, type, radius, space } from "@/theme";
import { SAMPLE_MARKS } from "@/sample";
import { SpotCard } from "@/components/SpotCard";
import { MapCanvas } from "@/components/MapCanvas";
import { Icon } from "@/components/Icon";
import { useLiveLocation } from "@/useLiveLocation";

const FILTERS: (SpotKind | "all")[] = ["all", "bench", "viewpoint", "trail_rest"];

export default function MapScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();

  const [filter, setFilter] = useState<SpotKind | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [follow, setFollow] = useState(true);

  const { location, permission } = useLiveLocation(true);

  const visible = useMemo(
    () =>
      filter === "all" ? SAMPLE_MARKS : SAMPLE_MARKS.filter((m) => m.kind === filter),
    [filter],
  );

  const active = visible.find((m) => m.id === selected) ?? null;

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <MapCanvas
        spots={visible}
        selectedId={selected}
        onSelect={setSelected}
        me={location}
        follow={follow}
      />

      {/* brand + filters */}
      <View style={[styles.top, { top: insets.top + 8 }]}>
        <View style={styles.brandRow}>
          <View style={[styles.brand, { backgroundColor: c.surface, borderColor: c.line }]}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.brandMark}
              contentFit="contain"
            />
            <Text style={[type.cardTitle, { color: c.ink }]}>Perch</Text>
          </View>

          <Pressable
            onPress={() => setFollow((f) => !f)}
            style={[
              styles.follow,
              {
                backgroundColor: follow ? c.pine : c.surface,
                borderColor: follow ? c.pine : c.line,
              },
            ]}
            accessibilityLabel={follow ? "Stop following your walk" : "Follow your walk"}
          >
            <Icon name="pin" color={follow ? c.onPine : c.body} size={17} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingHorizontal: space.md }}
          style={{ marginTop: space.sm }}
        >
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: on ? c.pine : c.surface,
                    borderColor: on ? c.pine : c.line,
                  },
                ]}
              >
                <Text style={[type.small, { color: on ? c.onPine : c.body }]}>
                  {f === "all" ? "Everything" : KIND_LABELS[f]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* count / location state */}
      <View
        style={[
          styles.hud,
          {
            backgroundColor: c.surface,
            borderColor: c.line,
            bottom: active ? 320 : 24,
          },
        ]}
      >
        <Text style={[type.meta, { color: c.muted }]}>
          {permission === "denied"
            ? "LOCATION OFF"
            : follow && location
              ? "FOLLOWING YOUR WALK"
              : `${visible.length} SPOTS · ${visible.filter((m) => m.marks > 0).length} MARKED`}
        </Text>
      </View>

      {active && (
        <View style={styles.sheet}>
          <SpotCard mark={active} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  top: { position: "absolute", left: 0, right: 0, zIndex: 5 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.md,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingLeft: 6,
    paddingRight: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  brandMark: { width: 26, height: 26 },
  follow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  hud: {
    position: "absolute",
    left: space.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
    zIndex: 5,
  },
  sheet: {
    position: "absolute",
    left: space.md,
    right: space.md,
    bottom: 20,
    maxWidth: 380,
    zIndex: 6,
  },
});
