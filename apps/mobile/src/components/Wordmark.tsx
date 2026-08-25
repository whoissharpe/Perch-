import { StyleSheet, Text, View } from "react-native";
import { useTheme, fonts } from "@/theme";
import { Mark } from "./Mark";

/**
 * The bird-on-a-bench plus the name, locked up together.
 *
 * Kept as one component so the gap and the optical alignment between the mark
 * and the word are decided once. Anywhere the brand appears in the interface
 * should use this rather than dropping a <Mark> next to a <Text>.
 */
export function Wordmark({
  size = 26,
  tone,
}: {
  size?: number;
  /** Colour of the word. Defaults to ink. */
  tone?: string;
}) {
  const c = useTheme();

  return (
    <View style={styles.row}>
      <Mark size={size} />
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
