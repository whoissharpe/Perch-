import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

export interface LiveLocation {
  lat: number;
  lng: number;
  heading: number | null;
  accuracy: number | null;
}

export type PermissionState = "unknown" | "granted" | "denied";

/**
 * Watches the user's position while the app is open, so the map can follow
 * them on a walk rather than making them re-centre by hand.
 *
 * Foreground only and deliberately so — background tracking is a much bigger
 * privacy ask, an extra store review, and a battery cost, and it buys nothing
 * for a product you look at while you are walking.
 */
export function useLiveLocation(enabled: boolean) {
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const sub = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;

      if (status !== "granted") {
        setPermission("denied");
        return;
      }
      setPermission("granted");

      // A first fix immediately, so the map does not sit on a default city
      // while the watcher warms up.
      try {
        const first = await Location.getLastKnownPositionAsync();
        if (first && !cancelled) {
          setLocation({
            lat: first.coords.latitude,
            lng: first.coords.longitude,
            heading: first.coords.heading ?? null,
            accuracy: first.coords.accuracy ?? null,
          });
        }
      } catch {
        // A missing last-known fix is normal on a cold device.
      }

      sub.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          // Walking pace: a few seconds or a few metres, whichever first.
          timeInterval: 4000,
          distanceInterval: 8,
        },
        (pos) => {
          if (cancelled) return;
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading ?? null,
            accuracy: pos.coords.accuracy ?? null,
          });
        },
      );
    }

    if (enabled) void start();

    return () => {
      cancelled = true;
      sub.current?.remove();
      sub.current = null;
    };
  }, [enabled]);

  return { location, permission };
}
