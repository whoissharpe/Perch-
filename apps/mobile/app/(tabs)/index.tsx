import { useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { KIND_LABELS, type SpotKind } from "@perch/core";
import { useTheme, type, radius, space } from "@/theme";
import { SAMPLE_MARKS } from "@/sample";
import { SpotCard } from "@/components/SpotCard";

const FILTERS: (SpotKind | "all")[] = ["all", "bench", "viewpoint", "trail_rest"];

export default function MapScreen() {
  const c = useTheme();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [filter, setFilter] = useState<SpotKind | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? SAMPLE_MARKS : SAMPLE_MARKS.filter((m) => m.kind === filter)),
    [filter],
  );

  const active = visible.find((m) => m.id === selected) ?? null;

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <MapView
        ref={mapRef}
        style={styles.fill}
        provider={PROVIDER_DEFAULT}
        userInterfaceStyle={scheme === "dark" ? "dark" : "light"}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: 38.7223,
          longitude: -9.1394,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
        onPress={() => setSelected(null)}
      >
        {visible.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            onPress={() => setSelected(m.id)}
            tracksViewChanges={false}
          >
            {/* Marked spots burn blaze; the hollow ring is a spot nobody
                has photographed yet. */}
            <View
              style={[
                styles.pin,
                {
                  backgroundColor: m.marks > 0 ? c.blaze : "transparent",
                  borderColor: m.marks > 0 ? c.blaze : c.pine,
                  transform: [{ scale: selected === m.id ? 1.35 : 1 }],
                },
              ]}
            />
          </Marker>
        ))}
      </MapView>

      {/* filters */}
      <View style={[styles.filters, { top: insets.top + 8 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingHorizontal: space.md }}
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
                <Text
                  style={[type.small, { color: on ? c.onPine : c.body }]}
                >
                  {f === "all" ? "Everything" : KIND_LABELS[f]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* count */}
      <View
        style={[
          styles.hud,
          { backgroundColor: c.surface, borderColor: c.line, bottom: active ? 300 : 24 },
        ]}
      >
        <Text style={[type.meta, { color: c.muted }]}>
          {visible.length} SPOTS · {visible.filter((m) => m.marks > 0).length} MARKED
        </Text>
      </View>

      {/* the tapped spot */}
      {active && (
        <View style={[styles.sheet, { bottom: 20 }]}>
          <SpotCard mark={active} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pin: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  filters: { position: "absolute", left: 0, right: 0 },
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
  },
  sheet: { position: "absolute", left: space.md, right: space.md },
});
