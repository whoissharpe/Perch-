import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, radius, space } from "@/theme";
import { useAuth } from "@/auth";
import { Mark } from "@/components/Mark";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

/**
 * Sign-in.
 *
 * Two decisions worth recording. First, every field has a visible label rather
 * than a placeholder standing in for one — a placeholder disappears the moment
 * somebody types, which is exactly when they need to check what they are
 * filling in. Second, errors render against the field they belong to, not in a
 * summary at the top, so the fix sits next to the problem.
 *
 * Apple and Google are the two providers that measurably cut sign-in friction,
 * so the design has room for them. They are rendered disabled rather than
 * faked: neither is configured yet, and a button that looks live and does
 * nothing is worse than one that admits it.
 */

/**
 * Flip once Apple and Google exist as Supabase auth providers and
 * expo-web-browser + expo-auth-session are wired up for the redirect.
 */
const PROVIDERS_READY = false;

export default function SignInScreen() {
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sendCode, verifyCode, continueAsDemo } = useAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = /\S+@\S+\.\S+/.test(email.trim());

  async function submitEmail() {
    setBusy(true);
    setError(null);
    const { error } = await sendCode(email.trim());
    setBusy(false);
    if (error) setError(error);
    else setStage("code");
  }

  async function submitCode() {
    setBusy(true);
    setError(null);
    const { error } = await verifyCode(email.trim(), code.trim());
    setBusy(false);
    if (error) setError(error);
    else router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      style={[styles.fill, { backgroundColor: c.paper }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: space.lg,
          paddingTop: insets.top + space.lg,
          paddingBottom: insets.bottom + space.lg,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <Mark size={44} />
        </View>

        <Text style={[type.hero, { color: c.ink, marginTop: space.md }]}>
          {stage === "email" ? "Sign in to mark spots" : "Check your email"}
        </Text>
        <Text style={[type.body, { color: c.body, marginTop: space.xs }]}>
          {stage === "email"
            ? "Browsing the map needs no account. Marking a spot does, so people can follow you back."
            : `We sent a six-digit code to ${email}.`}
        </Text>

        {stage === "email" ? (
          <>
            <View style={styles.providers}>
              <Button
                label="Continue with Apple"
                variant="secondary"
                disabled={!PROVIDERS_READY}
                onPress={() => {}}
                icon={<Icon name="person" color={c.ink} size={17} />}
              />
              <Button
                label="Continue with Google"
                variant="secondary"
                disabled={!PROVIDERS_READY}
                onPress={() => {}}
                icon={<Icon name="person" color={c.ink} size={17} />}
              />
              {!PROVIDERS_READY && (
                <Text style={[type.small, styles.note, { color: c.muted }]}>
                  Apple and Google sign-in aren&rsquo;t set up yet. Email works.
                </Text>
              )}
            </View>

            <View style={styles.divider}>
              <View style={[styles.rule, { backgroundColor: c.line }]} />
              <Text style={[type.meta, { color: c.muted }]}>OR</Text>
              <View style={[styles.rule, { backgroundColor: c.line }]} />
            </View>

            <Field label="Email address" error={error}>
              <TextInput
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (error) setError(null);
                }}
                placeholder="you@example.com"
                placeholderTextColor={c.muted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="go"
                onSubmitEditing={emailOk && !busy ? submitEmail : undefined}
                accessibilityLabel="Email address"
                style={[
                  styles.input,
                  {
                    color: c.ink,
                    borderColor: error ? c.clay : c.line,
                    backgroundColor: c.surface,
                  },
                ]}
              />
            </Field>

            <View style={{ marginTop: space.sm }}>
              <Button
                label="Email me a code"
                onPress={submitEmail}
                disabled={!emailOk}
                busy={busy}
              />
            </View>
          </>
        ) : (
          <>
            <Field label="Six-digit code" error={error}>
              <TextInput
                value={code}
                onChangeText={(v) => {
                  setCode(v);
                  if (error) setError(null);
                }}
                placeholder="123456"
                placeholderTextColor={c.muted}
                keyboardType="number-pad"
                maxLength={6}
                textContentType="oneTimeCode"
                accessibilityLabel="Six-digit sign-in code"
                style={[
                  styles.input,
                  styles.code,
                  {
                    color: c.ink,
                    borderColor: error ? c.clay : c.line,
                    backgroundColor: c.surface,
                  },
                ]}
              />
            </Field>

            <View style={{ marginTop: space.sm }}>
              <Button
                label="Sign in"
                onPress={submitCode}
                disabled={code.length !== 6}
                busy={busy}
              />
            </View>

            <Pressable
              onPress={() => {
                setStage("email");
                setError(null);
              }}
              accessibilityRole="button"
              style={styles.link}
            >
              <Text style={[type.small, { color: c.muted }]}>Use a different email</Text>
            </Pressable>
          </>
        )}

        <View style={{ flex: 1, minHeight: space.lg }} />

        <Pressable
          onPress={() => {
            continueAsDemo();
            router.replace("/");
          }}
          accessibilityRole="button"
          style={styles.link}
        >
          <Text style={[type.small, { color: c.muted }]}>
            Just looking — explore the map first
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Label above, error below, both attached to the control between them. */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error: string | null;
  children: React.ReactNode;
}) {
  const c = useTheme();
  return (
    <View style={{ marginTop: space.lg }}>
      <Text style={[type.small, styles.label, { color: c.body }]}>{label}</Text>
      {children}
      {error && (
        <View style={styles.errorRow}>
          <Icon name="pin" color={c.clay} size={13} />
          <Text style={[type.small, { color: c.clay, flex: 1 }]}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  head: { flexDirection: "row", alignItems: "center" },
  providers: { marginTop: space.lg, gap: space.sm },
  note: { textAlign: "center", marginTop: 2 },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.lg,
  },
  rule: { flex: 1, height: 1 },
  label: { marginBottom: 7, fontWeight: "500" },
  input: {
    paddingHorizontal: 16,
    // 52 tall to match the buttons, comfortably over the 44 touch minimum.
    height: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    fontSize: 16,
  },
  code: { fontSize: 22, letterSpacing: 8, textAlign: "center" },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 7 },
  link: { alignItems: "center", justifyContent: "center", paddingVertical: 14, minHeight: 44 },
});
