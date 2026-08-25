import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { KIND_LABELS, formatCoords } from "@perch/core";
import { useTheme, useShadow, type, radius, space } from "@/theme";
import { Icon } from "./Icon";
import { PerchBadge } from "./PerchBadge";
import { Mark } from "./Mark";
import type { SampleMark } from "@/sample";

export function SpotCard({ mark }: { mark: SampleMark }) {
  const c = useTheme();
  const shadow = useShadow("md");
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/spot/${mark.id}`)}
      style={({ pressed }) => [
        styles.card,
        shadow,
        {
          backgroundColor: c.surface,
          borderColor: c.line,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      <View style={styles.mediaWrap}>
        <Image
          source={{ uri: mark.image }}
          style={styles.media}
          contentFit="cover"
          transition={220}
        />
        {mark.curated ? (
          // A pick announces itself instead of the kind — who marked it is
          // the more useful fact when the team marked it.
          <View style={styles.topLeft}>
            <PerchBadge />
          </View>
        ) : (
          <View style={styles.kindChip}>
            <Text style={[styles.kindText, type.meta]}>
              {KIND_LABELS[mark.kind].toUpperCase()}
            </Text>
          </View>
        )}
        {mark.isVideo && (
          <View style={styles.playDot}>
            <Icon name="video" color="#fff" size={13} />
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={[type.cardTitle, { color: c.ink }]} numberOfLines={2}>
          {mark.name}
        </Text>
        <Text style={[type.meta, { color: c.muted, marginTop: 5 }]}>
          {formatCoords(mark.lat, mark.lng)}
        </Text>

        {mark.curated && mark.note && (
          <View style={[styles.note, { backgroundColor: c.pineSoft }]}>
            <Text style={[type.small, { color: c.pine }]}>{mark.note}</Text>
          </View>
        )}

        <View style={styles.row}>
          <View style={styles.who}>
            {mark.curated ? (
              <>
                <View style={[styles.avatar, { backgroundColor: c.pine }]}>
                  <Mark size={15} tint="paper" />
                </View>
                <Text style={[type.small, { color: c.pine }]}>The Perch team</Text>
              </>
            ) : (
              <>
                <View style={[styles.avatar, { backgroundColor: c.pineSoft }]}>
                  <Text style={[styles.avatarText, { color: c.pine }]}>
                    {mark.who.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <Text style={[type.small, { color: c.muted }]}>@{mark.who}</Text>
              </>
            )}
          </View>
          <View style={styles.saves}>
            <Icon name="bookmark" color={c.muted} size={13} />
            <Text style={[type.small, { color: c.muted }]}>{mark.saves}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  mediaWrap: { aspectRatio: 4 / 3, width: "100%" },
  media: { width: "100%", height: "100%" },
  topLeft: { position: "absolute", top: 9, left: 9 },
  note: {
    alignSelf: "flex-start",
    marginTop: space.sm,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  kindChip: {
    position: "absolute",
    top: 9,
    left: 9,
    backgroundColor: "rgba(255,255,255,0.93)",
    // lifts the chip off a busy photograph
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  kindText: { color: "#16211d" },
  playDot: {
    position: "absolute",
    right: 9,
    bottom: 9,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(22,33,29,0.62)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: space.md - 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: space.sm,
  },
  who: { flexDirection: "row", alignItems: "center", gap: 7 },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 10, fontWeight: "600" },
  saves: { flexDirection: "row", alignItems: "center", gap: 5 },
});
