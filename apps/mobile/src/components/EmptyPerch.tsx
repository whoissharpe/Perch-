import { StyleSheet, Text, View } from "react-native";
import { useTheme, type, space } from "@/theme";
import { Mark } from "./Mark";

/**
 * An empty list, with the bird on its bench and nothing on it.
 *
 * Empty states are where most apps put a shrug — a grey line of text, or a
 * generic inbox glyph borrowed from an icon set. This is the one place the
 * mark actually earns its keep: an empty bench is a literal picture of the
 * situation, and it reads as an invitation rather than a dead end.
 *
 * The whole thing is one accessibility node, because a screen reader should
 * hear "no marks yet, the bench you walk past every day counts" as a single
 * thought rather than three fragments.
 */
export function EmptyPerch({ title, body }: { title: string; body: string }) {
  const c = useTheme();

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityLabel={`${title}. ${body}`}
    >
      {/* Sat back a little, so it reads as decoration rather than a control. */}
      <View style={{ opacity: 0.45 }}>
        <Mark size={68} />
      </View>
      <Text style={[type.cardTitle, styles.title, { color: c.ink }]}>{title}</Text>
      <Text style={[type.small, styles.body, { color: c.muted }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingVertical: space.xl, paddingHorizontal: space.lg },
  title: { marginTop: space.sm, textAlign: "center" },
  body: { marginTop: 5, textAlign: "center", maxWidth: 280 },
});
