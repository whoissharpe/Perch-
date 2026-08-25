import { StyleSheet, Text, View } from "react-native";
import { useTheme, fonts } from "@/theme";
import { Mark } from "./Mark";

/**
 * The bird-on-a-bench plus the name, locked up together.
 *
 * Kept as one component so the gap and the optical alignment between the mark
 * and the word are decided once. Anywhere the brand appears in the interface
 * should use this rather than dropping a <Mark> next to a <Text>.
 *
 * The bird and the word carry the same weight on purpose. Headers used to
 * pass tone={pine}, which left a near-white bird beside a pale sage word —
 * two colours in one lockup, and it read as washed out next to the same
 * lockup inside the map's pill. `tone` now dims the mark to match instead of
 * only recolouring the text, so a quiet lockup goes quiet as a whole.
 */
export function Wordmark({
  size = 26,
  tone,
}: {
  size?: number;
  /**
   * Dims the whole lockup, word and bird together. Omit for the full-strength
   * mark, which is what every header should use.
   */
  tone?: string;
}) {
  const c = useTheme();

  return (
    <View style={styles.row}>
      {/* Opacity rather than a tint: the mark only has two tints and neither
          of them is "muted", and fading keeps bird and word in step. */}
      <View style={tone ? { opacity: 0.55 } : null}>
        <Mark size={size} />
      </View>
      <Text
        style={[
          styles.word,
          {
            color: tone ?? c.ink,
            fontSize: size * 0.66,
            // Fraunces sits high in its box; nudge it back onto the bird's line.
            marginBottom: size * 0.04,
          },
        ]}
      >
        Perch
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 7 },
  word: { fontFamily: fonts.display, letterSpacing: -0.4 },
});
