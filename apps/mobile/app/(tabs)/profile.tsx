import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, type, radius, space } from "@/theme";
import { useAuth } from "@/auth";
import { SAMPLE_MARKS } from "@/sample";
import { SpotCard } from "@/components/SpotCard";

export default function ProfileScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { canPost, handle, demo, signOut } = useAuth();

  const mine = SAMPLE_MARKS.slice(0, 2);

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
        <Image
          source={require("../../assets/icon.png")}
          style={styles.mark}
          contentFit="contain"
        />
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
          <View style={{ gap: space.sm, marginTop: space.sm }}>
            {mine.map((m) => (
              <SpotCard key={m.id} mark={m} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", gap: space.sm },
  mark: { width: 56, height: 56 },
  btn: {
    marginTop: space.md,
    paddingVertical: 13,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: "center",
  },
});
