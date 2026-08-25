import { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_DEFAULT, type Region } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/theme";
import { MAP_STYLE_LIGHT, MAP_STYLE_DARK } from "@/mapStyle";
import { useScheme } from "@/scheme";
import { BIRD_ZOOM, PERCH_ZOOM, pinScale } from "@/birdSprites";
import { BirdPin } from "./BirdPin";
import type { SampleMark } from "@/sample";
import type { LiveLocation } from "@/useLiveLocation";

export interface MapCanvasProps {
  spots: SampleMark[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** The user's live position, or null before the first fix. */
  me: LiveLocation | null;
  /** Whether the camera should track them as they walk. */
  follow: boolean;
  /**
   * A one-shot request to fly the camera somewhere, e.g. tapping a Perch
   * Pick. Carries a nonce so asking for the same place twice still moves.
   */
  focus?: { lat: number; lng: number; n: number } | null;
}

/** react-native-maps reports a span, not a zoom level. This is the standard conversion. */
function zoomFrom(region: Region) {
  return Math.log2(360 / region.longitudeDelta);
}

/**
 * The native map. A `.web.tsx` sibling stands in for browsers, where
 * react-native-maps has no implementation — Metro picks by platform extension.
 */
export function MapCanvas({ spots, selectedId, onSelect, me, follow, focus }: MapCanvasProps) {
  const c = useTheme();
  const scheme = useScheme();
  const map = useRef<MapView>(null);
  const [perched, setPerched] = useState(false);
  const [zoom, setZoom] = useState(13.5);

  // On the pale map the pine drawing reads; on the dark one it vanishes.
  const tint = scheme === "dark" ? "paper" : "pine";

  // Follow the walk. Only when asked, so panning away does not fight back.
  useEffect(() => {
    if (!follow || !me) return;
    map.current?.animateCamera(
      { center: { latitude: me.lat, longitude: me.lng } },
      { duration: 900 },
    );
  }, [follow, me]);

  // Fly to a pick. Close enough that the bird is already perched on arrival.
  useEffect(() => {
    if (!focus) return;
    map.current?.animateCamera(
      { center: { latitude: focus.lat, longitude: focus.lng }, zoom: 16.2 },
      { duration: 1100 },
    );
  }, [focus]);

  return (
    <MapView
      ref={map}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      userInterfaceStyle={scheme === "dark" ? "dark" : "light"}
      // Ignored by Apple Maps on iOS, which follows userInterfaceStyle instead.
      customMapStyle={scheme === "dark" ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass={false}
      showsPointsOfInterest={false}
      initialRegion={{
        latitude: me?.lat ?? 38.7223,
        longitude: me?.lng ?? -9.1394,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      onRegionChange={(r) => {
        const z = zoomFrom(r);
        setZoom((prev) => (Math.abs(prev - z) < 0.05 ? prev : z));
        const next = z >= PERCH_ZOOM;
        setPerched((prev) => (prev === next ? prev : next));
      }}
      onPress={() => onSelect(null)}
    >
      {spots.map((m, i) => {
        const marked = m.marks > 0;
        return (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            onPress={() => onSelect(selectedId === m.id ? null : m.id)}
            // The bird animates, so this marker has to keep redrawing.
            tracksViewChanges={marked}
            anchor={{ x: 0.5, y: marked ? 1 : 0.5 }}
          >
            {marked ? (
              <BirdPin
                tint={tint}
                perched={perched}
                selected={selectedId === m.id}
                index={i}
                scale={pinScale(zoom)}
                far={zoom < BIRD_ZOOM}
              />
            ) : (
              // Nobody has been here yet: a quiet hollow ring, no bird.
              <View
                style={[
                  styles.empty,
                  {
                    borderColor: c.pine,
                    transform: [{ scale: selectedId === m.id ? 1.4 : 1 }],
                  },
                ]}
              />
            )}
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  empty: { width: 13, height: 13, borderRadius: 6.5, borderWidth: 2 },
});
