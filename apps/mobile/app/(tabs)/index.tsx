import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KIND_LABELS, type SpotKind } from "@perch/core";
import { useTheme, useShadow, type, radius, space } from "@/theme";
import { curatedNear } from "@/curated";
import { useNearby } from "@/nearby";
import { SpotCard } from "@/components/SpotCard";
import { MapCanvas } from "@/components/MapCanvas";
import { Icon } from "@/components/Icon";
import { Wordmark } from "@/components/Wordmark";
import { BirdLoader } from "@/components/BirdLoader";
import { PickStrip } from "@/components/PickStrip";
import { useLiveLocation } from "@/useLiveLocation";

/** "picks" is not a SpotKind — it filters by who marked it, not what it is. */
type Filter = SpotKind | "all" | "picks";

const FILTERS: Filter[] = ["all", "picks", "bench", "viewpoint", "trail_rest"];

/**
 * Centre used until the first location fix lands. Jacksonville, because that
 * is where the first real picks are and an empty-handed first run should still
 * open onto something walkable.
 */
const FALLBACK = { lat: 30.3322, lng: -81.6557 };

export default function MapScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const floating = useShadow("sm");
  const raised = useShadow("md");

  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [follow, setFollow] = useState(true);
  const [focus, setFocus] = useState<{ lat: number; lng: number; n: number } | null>(
    null,
  );

  const { location, permission } = useLiveLocation(true);

  // The team's picks ring wherever the user actually is, so they recentre once
  // the first fix lands. Rounded to ~10 m so ordinary GPS jitter does not
  // rebuild every pin on the map.
  const centre = location
    ? { lat: round(location.lat), lng: round(location.lng) }
    : FALLBACK;

  const picks = useMemo(() => curatedNear(centre.lat, centre.lng), [centre.lat, centre.lng]);

  // Real benches and viewpoints around the user, live from OpenStreetMap.
  const nearby = useNearby(centre.lat, centre.lng);

  const all = useMemo(() => [...picks, ...nearby.spots], [picks, nearby.spots]);

  const visible = useMemo(() => {
    if (filter === "all") return all;
    if (filter === "picks") return picks;
    return all.filter((m) => m.kind === filter);
  }, [all, picks, filter]);

  const active = visible.find((m) => m.id === selected) ?? null;

  const openPick = (id: string) => {
    const p = picks.find((x) => x.id === id);
    if (!p) return;
    // Stop tracking the walk first, or the camera snaps straight back.
    setFollow(false);
    setFocus({ lat: p.lat, lng: p.lng, n: Date.now() });
    setSelected(id);
  };

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <MapCanvas
        spots={visible}
        selectedId={selected}
        onSelect={setSelected}
        me={location}
        follow={follow}
        focus={focus}
      />

      {/* brand + filters */}
      <View style={[styles.top, { top: insets.top + 8 }]}>
        <View style={styles.brandRow}>
          <View style={[styles.brand, floating, { backgroundColor: c.surface, borderColor: c.line }]}>
            <Wordmark size={26} />
          </View>

          <Pressable
            onPress={() => setFollow((f) => !f)}
            style={[
              styles.follow,
              floating,
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
                  floating,
                  {
                    backgroundColor: on ? c.pine : c.surface,
                    borderColor: on ? c.pine : c.line,
                  },
                ]}
              >
                <Text style={[type.small, { color: on ? c.onPine : c.body }]}>
                  {f === "all"
                    ? "Everything"
                    : f === "picks"
                      ? "Perch Picks"
                      : KIND_LABELS[f]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Status sits under the filters rather than bottom-left: down there
            it collided with both the open spot card and the map attribution,
            which has to stay visible for the licence. */}
        <View style={styles.hudRow}>
          <View style={[styles.hud, floating, { backgroundColor: c.surface, borderColor: c.line }]}>
            {/* The bird does the waiting, here as everywhere else. */}
            {nearby.loading && <BirdLoader size={16} />}
            <Text style={[type.meta, { color: c.muted }]}>
              {permission === "denied"
                ? "LOCATION OFF"
                : nearby.loading
                  ? "READING THE MAP…"
                  : nearby.error
                    ? "OPENSTREETMAP UNREACHABLE"
                    : nearby.spots.length === 0
                      ? "NO MAPPED SPOTS NEARBY"
                      : `${nearby.spots.length} REAL SPOTS NEARBY · NONE MARKED YET`}
            </Text>
          </View>
        </View>
      </View>

      {/* The strip and the detail sheet share the bottom of the screen, so
          only one of them is ever up. */}
      {active ? (
        <View style={[styles.sheet, raised]}>
          <SpotCard mark={active} />
        </View>
      ) : (
        <PickStrip picks={picks} onPick={openPick} />
      )}
    </View>
  );
}

/** ~10 m of precision: enough to place a pick, stable enough not to churn. */
function round(n: number) {
  return Math.round(n * 10_000) / 10_000;
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
  hudRow: { paddingHorizontal: space.md, marginTop: space.sm, flexDirection: "row" },
  hud: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  sheet: {
    position: "absolute",
    left: space.md,
    right: space.md,
    // clears the map attribution strip, which must stay legible
    bottom: 34,
    maxWidth: 380,
    zIndex: 6,
  },
});
