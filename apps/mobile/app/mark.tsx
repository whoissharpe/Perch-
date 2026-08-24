import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SPOT_KINDS, SPOT_ATTRIBUTES, formatCoords, type SpotKind } from "@perch/core";
import { useTheme, type, radius, space } from "@/theme";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/auth";

export default function MarkScreen() {
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { canPost } = useAuth();

  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [kind, setKind] = useState<SpotKind>("bench");
  const [attrs, setAttrs] = useState<string[]>([]);

  // Posting needs an account so people can follow you. Bounce to sign-in
  // rather than letting someone fill the whole form and fail at the end.
  useEffect(() => {
    if (!canPost) router.replace("/sign-in");
  }, [canPost, router]);

  // Grab the position as soon as the sheet opens — by the time somebody has
  // framed the photo, the fix has settled.
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    })();
  }, []);

  async function capture(mode: "camera" | "library") {
    const perm =
      mode === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted) {
      Alert.alert(
        "Permission needed",
        mode === "camera"
          ? "Perch needs the camera to photograph the spot."
          : "Perch needs access to your library to pick a photo.",
      );
      return;
    }

    // Photos only for now. Video is planned, but it drags in transcoding,
    // upload size limits and a much bigger moderation surface — none of which
    // the first version needs to prove the loop.
    const opts: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: false,
    };

    const res =
      mode === "camera"
        ? await ImagePicker.launchCameraAsync(opts)
        : await ImagePicker.launchImageLibraryAsync(opts);

    if (!res.canceled) setMedia(res.assets[0]);
  }

  const ready = media !== null && name.trim().length > 0;

  function submit() {
    // Wiring: upload media to the `marks` bucket, insert the spot if this is
    // a new one, then insert the mark. See supabase/migrations/0001_init.sql.
    Alert.alert(
      "Marked",
      `“${name}” is on the map.${coords ? `\n${formatCoords(coords.lat, coords.lng)}` : ""}`,
      [{ text: "Good", onPress: () => router.back() }],
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: c.paper }]}>
      <View style={[styles.bar, { paddingTop: insets.top + 8, borderColor: c.line }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Icon name="close" color={c.muted} size={22} />
        </Pressable>
        <Text style={[type.cardTitle, { color: c.ink }]}>Mark a spot</Text>
        <Pressable onPress={ready ? submit : undefined} hitSlop={12}>
          <Text
            style={[
              type.body,
              { color: ready ? c.brass : c.muted, fontWeight: "600" },
            ]}
          >
            Post
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: space.md, paddingBottom: space.xl * 2 }}
        showsVerticalScrollIndicator={false}
      >
        {/* media — required, because a mark without a picture is just a pin */}
        {media ? (
          <Pressable onPress={() => setMedia(null)}>
            <Image source={{ uri: media.uri }} style={styles.preview} contentFit="cover" />
            <Text style={[type.meta, { color: c.muted, marginTop: 6 }]}>
              TAP TO REPLACE
            </Text>
          </Pressable>
        ) : (
          <View style={styles.pickRow}>
            <Pressable
              onPress={() => capture("camera")}
              style={[styles.pick, { borderColor: c.line, backgroundColor: c.surface }]}
            >
              <Icon name="camera" color={c.pine} size={26} />
              <Text style={[type.small, { color: c.body }]}>Take one</Text>
            </Pressable>
            <Pressable
              onPress={() => capture("library")}
              style={[styles.pick, { borderColor: c.line, backgroundColor: c.surface }]}
            >
              <Icon name="video" color={c.pine} size={26} />
              <Text style={[type.small, { color: c.body }]}>From library</Text>
            </Pressable>
          </View>
        )}

        {/* position */}
        <View style={[styles.coords, { borderColor: c.line }]}>
          <Icon name="pin" color={c.brass} size={16} />
          <Text style={[type.meta, { color: coords ? c.body : c.muted }]}>
            {coords ? formatCoords(coords.lat, coords.lng) : "FINDING YOU…"}
          </Text>
        </View>

        <Text style={[type.meta, { color: c.muted, marginTop: space.lg }]}>
          WHAT IS IT
        </Text>
        <View style={styles.chips}>
          {SPOT_KINDS.map((k) => {
            const on = kind === k.key;
            return (
              <Pressable
                key={k.key}
                onPress={() => setKind(k.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: on ? c.pine : c.surface,
                    borderColor: on ? c.pine : c.line,
                  },
                ]}
              >
                <Text style={[type.small, { color: on ? c.onPine : c.body }]}>
                  {k.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[type.meta, { color: c.muted, marginTop: space.lg }]}>
          NAME IT
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="The one with the whole city in it"
          placeholderTextColor={c.muted}
          style={[
            styles.input,
            { color: c.ink, borderColor: c.line, backgroundColor: c.surface },
          ]}
          maxLength={80}
        />

        <Text style={[type.meta, { color: c.muted, marginTop: space.lg }]}>
          ANYTHING WORTH KNOWING
        </Text>
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Go at seven. The whole hill turns orange."
          placeholderTextColor={c.muted}
          multiline
          style={[
            styles.input,
            styles.textarea,
            { color: c.ink, borderColor: c.line, backgroundColor: c.surface },
          ]}
          maxLength={280}
        />

        <Text style={[type.meta, { color: c.muted, marginTop: space.lg }]}>
          GOOD TO KNOW
        </Text>
        <View style={styles.chips}>
          {SPOT_ATTRIBUTES.map((a) => {
            const on = attrs.includes(a.key);
            return (
              <Pressable
                key={a.key}
                onPress={() =>
                  setAttrs((prev) =>
                    on ? prev.filter((x) => x !== a.key) : [...prev, a.key],
                  )
                }
                style={[
                  styles.chip,
                  {
                    backgroundColor: on ? c.brassSoft : c.surface,
                    borderColor: on ? c.brass : c.line,
                  },
                ]}
              >
                <Text style={[type.small, { color: on ? c.brass : c.body }]}>
                  {a.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.md,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  preview: { width: "100%", aspectRatio: 4 / 3, borderRadius: radius.md },
  pickRow: { flexDirection: "row", gap: space.sm },
  pick: {
    flex: 1,
    aspectRatio: 1.35,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  coords: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: space.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  input: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    fontSize: 15,
  },
  textarea: { minHeight: 88, textAlignVertical: "top" },
});
