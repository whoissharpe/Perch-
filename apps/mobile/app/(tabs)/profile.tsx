import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, radius, space } from "@/theme";
import { useAuth } from "@/auth";
import { Mark } from "@/components/Mark";
import { EmptyPerch } from "@/components/EmptyPerch";

import { SpotCard } from "@/components/SpotCard";
import type { SampleMark } from "@/sample";

export default function ProfileScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { canPost, handle, demo, signOut } = useAuth();

  // You have not marked anything yet, and the app should say so rather than
  // inventing a history for you.
  const mine: SampleMark[] = [];

  return (
    <ScrollView
      style={{ backgroundColor: c.paper }}
      contentContainerStyle={{
        padding: space.md,
        paddingTop: insets.top + space.md,
        paddingBottom: space.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.head}>
        <Mark size={56} />
        <View style={{ flex: 1 }}>
          <Text style={[type.title, { color: c.ink }]}>
            {canPost ? `@${handle}` : "Not signed in"}
          </Text>
          <Text style={[type.small, { color: c.muted }]}>
            {demo
              ? "Demo mode — sample spots"
              : canPost
                ? `${mine.length} spots marked`
                : "Sign in to mark spots and follow people"}
          </Text>
        </View>
      </View>

      {canPost ? (
        <Pressable onPress={signOut} style={[styles.btn, { borderColor: c.line }]}>
          <Text style={[type.body, { color: c.ink }]}>Sign out</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => router.push("/sign-in")}
          style={[styles.btn, { backgroundColor: c.pine, borderColor: c.pine }]}
        >
          <Text style={[type.body, { color: c.onPine, fontWeight: "600" }]}>
            Sign in
          </Text>
        </Pressable>
      )}

      {canPost && (
        <>
          <Text style={[type.title, { color: c.ink, marginTop: space.lg }]}>
            Your marks
          </Text>
          {mine.length === 0 ? (
            <EmptyPerch
              title="No marks yet"
              body="The bench you walk past every day counts. Start there."
            />
          ) : (
            <View style={{ gap: space.sm, marginTop: space.sm }}>
              {mine.map((m) => (
                <SpotCard key={m.id} mark={m} />
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", gap: space.sm },
  btn: {
    marginTop: space.md,
    paddingVertical: 13,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
  },
});
