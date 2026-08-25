import { StyleSheet, Text, View } from "react-native";
import { useTheme, fonts } from "@/theme";
import { Mark } from "./Mark";

/**
 * The tell that a spot came from the Perch team rather than another user.
 *
 * It has to be legible on top of a photograph, so it carries its own ground
 * and its own small shadow rather than relying on whatever is behind it.
 */
export function PerchBadge({ compact = false }: { compact?: boolean }) {
  const c = useTheme();

  return (
    <View
      style={[
        styles.badge,
        compact && styles.compact,
        { backgroundColor: c.pine },
      ]}
    >
      {/* The paper-tinted mark, because the badge ground is always pine. */}
      <Mark size={compact ? 13 : 15} tint="paper" />
      <Text style={[styles.text, { color: c.onPine }]}>
        {compact ? "PERCH" : "PERCH PICK"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingLeft: 6,
    paddingRight: 9,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  compact: { paddingRight: 8, paddingVertical: 3 },
  text: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.8 },
});
