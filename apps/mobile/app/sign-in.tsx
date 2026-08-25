import { useState } from "react";
import {
  ActivityIndicator,
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
          padding: space.lg,
          paddingTop: insets.top + space.xl,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Mark size={76} />

        <Text style={[type.hero, { color: c.ink, marginTop: space.lg }]}>
          {stage === "email" ? "Sign in to mark spots" : "Check your email"}
        </Text>
        <Text style={[type.body, { color: c.muted, marginTop: space.xs }]}>
          {stage === "email"
            ? "Browsing the map needs no account. Posting does, so people can follow you."
            : `We sent a six-digit code to ${email}.`}
        </Text>

        {stage === "email" ? (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={c.muted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              style={[
                styles.input,
                { color: c.ink, borderColor: c.line, backgroundColor: c.surface },
              ]}
            />
            <Pressable
              onPress={email.includes("@") && !busy ? submitEmail : undefined}
              style={[
                styles.btn,
                {
                  backgroundColor: email.includes("@") ? c.pine : c.sunk,
                  opacity: busy ? 0.6 : 1,
                },
              ]}
            >
              {busy ? (
                <ActivityIndicator color={c.onPine} />
              ) : (
                <Text
                  style={[
                    type.body,
                    { color: email.includes("@") ? c.onPine : c.muted, fontWeight: "600" },
                  ]}
                >
                  Email me a code
                </Text>
              )}
            </Pressable>
          </>
        ) : (
          <>
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor={c.muted}
              keyboardType="number-pad"
              maxLength={6}
              textContentType="oneTimeCode"
              style={[
                styles.input,
                styles.code,
                { color: c.ink, borderColor: c.line, backgroundColor: c.surface },
              ]}
            />
            <Pressable
              onPress={code.length === 6 && !busy ? submitCode : undefined}
              style={[
                styles.btn,
                {
                  backgroundColor: code.length === 6 ? c.pine : c.sunk,
                  opacity: busy ? 0.6 : 1,
                },
              ]}
            >
              {busy ? (
                <ActivityIndicator color={c.onPine} />
              ) : (
                <Text
                  style={[
                    type.body,
                    { color: code.length === 6 ? c.onPine : c.muted, fontWeight: "600" },
                  ]}
                >
                  Sign in
                </Text>
              )}
            </Pressable>
            <Pressable onPress={() => setStage("email")} style={styles.linkBtn}>
              <Text style={[type.small, { color: c.muted }]}>
                Use a different email
              </Text>
            </Pressable>
          </>
        )}

        {error && (
          <View style={[styles.error, { backgroundColor: c.claySoft }]}>
            <Text style={[type.small, { color: c.clay }]}>{error}</Text>
          </View>
        )}

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={() => {
            continueAsDemo();
            router.replace("/");
          }}
          style={styles.linkBtn}
        >
          <Text style={[type.small, { color: c.muted }]}>
            Just looking — explore with sample spots
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  input: {
    marginTop: space.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    fontSize: 16,
  },
  code: { fontSize: 22, letterSpacing: 8, textAlign: "center" },
  btn: {
    marginTop: space.sm,
    paddingVertical: 15,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  linkBtn: { paddingVertical: space.md, alignItems: "center" },
  error: {
    marginTop: space.md,
    padding: space.sm,
    borderRadius: radius.sm,
  },
});
