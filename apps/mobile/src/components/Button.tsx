import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme, useShadow, type, radius } from "@/theme";

type Variant = "primary" | "secondary" | "ghost";

/**
 * One button, so touch target and press feedback are decided once.
 *
 * Height is pinned at 52 rather than derived from padding: the platform
 * minimum is 44 and a button that shrinks with its label is the usual way
 * that floor gets breached without anyone noticing.
 *
 * Disabled is communicated by opacity *and* by the label going muted, never
 * by colour alone.
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  busy = false,
  icon,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  busy?: boolean;
  /** Optional leading glyph. Decorative — the label carries the meaning. */
  icon?: React.ReactNode;
  accessibilityLabel?: string;
}) {
  const c = useTheme();
  const lift = useShadow("sm");
  const off = disabled || busy;

  const ground =
    variant === "primary" ? c.pine : variant === "secondary" ? c.surface : "transparent";
  const ink =
    variant === "primary" ? c.onPine : variant === "ghost" ? c.muted : c.ink;

  return (
    <Pressable
      onPress={off ? undefined : onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: off, busy }}
      style={({ pressed }) => [
        styles.btn,
        variant !== "ghost" && lift,
        {
          backgroundColor: ground,
          borderColor: variant === "secondary" ? c.line : "transparent",
          borderWidth: variant === "secondary" ? 1 : 0,
          opacity: off ? 0.55 : 1,
          // A press that changes nothing reads as a dead control.
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {busy ? (
        <ActivityIndicator color={ink} />
      ) : (
        <View style={styles.row}>
          {icon}
          <Text style={[type.body, styles.label, { color: ink }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 9 },
  label: { fontWeight: "600" },
});
