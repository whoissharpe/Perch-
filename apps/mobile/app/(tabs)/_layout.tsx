import { Tabs, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme, fonts } from "@/theme";
import { Icon } from "@/components/Icon";

export default function TabsLayout() {
  const c = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.pine,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.line,
          height: 84,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: fonts.body, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <Icon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => <Icon name="feed" color={color} />,
        }}
      />

      {/* The centre slot is the whole product: mark a spot. It opens the
          capture modal rather than navigating to a tab. */}
      <Tabs.Screen
        name="mark-placeholder"
        options={{
          title: "",
          tabBarButton: () => (
            <Pressable
              style={styles.markWrap}
              onPress={() => router.push("/mark")}
              accessibilityRole="button"
              accessibilityLabel="Mark a spot"
            >
              <View style={[styles.markBtn, { backgroundColor: c.brass }]}>
                <Icon name="plus" color="#fff" size={22} />
              </View>
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <Icon name="bookmark" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "You",
          tabBarIcon: ({ color }) => <Icon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  markWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  markBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
