import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme, useShadow, type, radius, space } from "@/theme";
import { Icon } from "./Icon";
import { BirdLoader } from "./BirdLoader";
import { searchLoaded, searchPlaces, awayLabel, type PlaceHit } from "@/search";
import type { SampleMark } from "@/sample";

/**
 * Search over the map.
 *
 * Two sources, one list: spots already on the map first, then places to fly
 * to. A hit on something already pinned is the more specific answer, so it
 * wins the top of the list even when the geocoder has an exact name match.
 *
 * The network side is debounced at 450 ms. That is not only for the user's
 * benefit — Nominatim is donated infrastructure and its usage policy asks for
 * at most one request a second, so firing per keystroke would be abusing a
 * free service. Local matching is instant because it costs nothing.
 */
export function SearchSheet({
  spots,
  near,
  onPickSpot,
  onPickPlace,
  onClose,
}: {
  spots: SampleMark[];
  near: { lat: number; lng: number } | null;
  onPickSpot: (id: string) => void;
  onPickPlace: (hit: PlaceHit) => void;
  onClose: () => void;
}) {
  const c = useTheme();
  const lift = useShadow("md");

  const [q, setQ] = useState("");
  const [places, setPlaces] = useState<PlaceHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const local = searchLoaded(q, spots, near);

  const ctrl = useRef<AbortController | null>(null);

  useEffect(() => {
    ctrl.current?.abort();
    if (q.trim().length < 2) {
      setPlaces([]);
      setBusy(false);
      setError(null);
      return;
    }

    const t = setTimeout(() => {
      const a = new AbortController();
      ctrl.current = a;
      setBusy(true);
      searchPlaces(q, near, a.signal)
        .then((r) => {
          setPlaces(r);
          setError(null);
        })
        .catch((e: unknown) => {
          if (a.signal.aborted) return;
          setPlaces([]);
          setError(e instanceof Error ? e.message : "Search unavailable.");
        })
        .finally(() => {
          if (!a.signal.aborted) setBusy(false);
        });
    }, 450);

    return () => clearTimeout(t);
  }, [q, near]);

  const nothing = q.trim().length >= 2 && !busy && local.length === 0 && places.length === 0;

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <View style={[styles.bar, lift, { backgroundColor: c.surface, borderColor: c.line }]}>
        <Icon name="search" color={c.muted} size={17} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search a place or a spot"
          placeholderTextColor={c.muted}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search places and spots"
          style={[styles.input, { color: c.ink }]}
        />
        {busy && <BirdLoader size={20} />}
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
          accessibilityRole="button"
          accessibilityLabel="Close search"
          hitSlop={10}
          style={styles.cancel}
        >
          <Text style={[type.small, { color: c.pine }]}>Cancel</Text>
        </Pressable>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}>
        {local.length > 0 && (
          <Text style={[type.meta, styles.section, { color: c.muted }]}>ON THE MAP</Text>
        )}
        {local.map((h) => (
          <Row key={h.id} hit={h} onPress={() => onPickSpot(h.spotId!)} pinned />
        ))}

        {places.length > 0 && (
          <Text style={[type.meta, styles.section, { color: c.muted }]}>PLACES</Text>
        )}
        {places.map((h) => (
          <Row key={h.id} hit={h} onPress={() => onPickPlace(h)} />
        ))}

        {error && (
          <Text style={[type.small, styles.note, { color: c.clay }]}>{error}</Text>
        )}
        {nothing && (
          <Text style={[type.small, styles.note, { color: c.muted }]}>
            Nothing by that name. Try a suburb, a park, or a street.
          </Text>
        )}
        {places.length > 0 && (
          <Text style={[type.meta, styles.credit, { color: c.muted }]}>
            PLACE SEARCH © OPENSTREETMAP CONTRIBUTORS
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function Row({
  hit,
  onPress,
  pinned = false,
}: {
  hit: PlaceHit;
  onPress: () => void;
  pinned?: boolean;
}) {
  const c = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        { borderColor: c.lineSoft, backgroundColor: pressed ? c.sunk : "transparent" },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: pinned ? c.claySoft : c.pineSoft }]}>
        <Icon name={pinned ? "pin" : "map"} color={pinned ? c.clay : c.pine} size={15} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { color: c.ink }]} numberOfLines={1}>
          {hit.name}
        </Text>
        <Text style={[type.small, { color: c.muted }]} numberOfLines={1}>
          {[hit.context, awayLabel(hit.metresAway)].filter(Boolean).join(" · ")}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: 14,
    minHeight: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginHorizontal: space.md,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 14 },
  cancel: { minHeight: 44, justifyContent: "center" },
  list: { paddingHorizontal: space.md, paddingTop: space.md, paddingBottom: space.xl },
  section: { marginTop: space.sm, marginBottom: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
    borderBottomWidth: 1,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  note: { marginTop: space.md },
  credit: { marginTop: space.lg },
});
