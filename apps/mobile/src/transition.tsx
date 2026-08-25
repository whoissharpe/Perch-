import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { BIRD } from "@/birdSprites";
import { palette } from "@perch/core";

/**
 * The bird drags the next screen in behind it.
 *
 * A wipe rather than a fade, because a wipe has a direction and a direction
 * can have a character pulling it. The bird flies leading edge first, the
 * paper panel follows on a cord, the route changes while the screen is
 * covered, then bird and panel carry on out the other side. The user never
 * sees a blank frame and never sees the swap.
 *
 * The bird is a single wide sprite drawn holding a ribbon, so the cord is
 * part of the artwork rather than a hairline View pretending to be one. The
 * ribbon's tail meets the panel's leading edge, which is what sells the pull.
 *
 * Everything animated here is a transform, so it all runs on the native
 * driver.
 *
 * Honours reduce-motion: if the system asks for less movement, the navigation
 * happens instantly with no overlay at all. A decorative transition is exactly
 * the kind of motion that setting exists to remove.
 *
 * The navigation and the teardown are driven by timers, not by the animation's
 * completion callback. An `Animated` callback only fires if the animation
 * actually runs, and it does not run in a backgrounded or non-compositing
 * view — which leaves the user staring at a blank panel forever with the route
 * never changing. Decoration must never be able to trap someone: the timers
 * are the contract, the animation is the decoration on top of it.
 */

const DURATION = 460;

interface TransitionValue {
  /** Navigate with the bird pulling the screen across. */
  flyTo: (href: string, mode?: "push" | "replace") => void;
  busy: boolean;
}

const TransitionContext = createContext<TransitionValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const c = palette[scheme];

  const [busy, setBusy] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Read once, then follow changes — someone can flip the setting mid-session.
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (alive) setReduceMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) =>
      setReduceMotion(v),
    );
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  const slide = useRef(new Animated.Value(0)).current;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const flyTo = useCallback(
    (href: string, mode: "push" | "replace" = "push") => {
      const go = () =>
        mode === "replace" ? router.replace(href as never) : router.push(href as never);

      if (reduceMotion) {
        go();
        return;
      }

      clearTimers();
      setBusy(true);
      slide.setValue(0);

      Animated.sequence([
        Animated.timing(slide, {
          toValue: 1,
          duration: DURATION,
          // Fast out of the gate, settling as it covers — a bird leaving a
          // branch rather than a panel on a rail.
          easing: Easing.bezier(0.32, 0.72, 0, 1),
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: 2,
          duration: DURATION,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ]).start();

      // Swap the route while the paper is covering the screen, and clear the
      // overlay once it should be gone — both on their own timers, so neither
      // depends on a frame ever being drawn.
      timers.current.push(setTimeout(go, DURATION));
      timers.current.push(
        setTimeout(() => {
          setBusy(false);
          slide.setValue(0);
        }, DURATION * 2),
      );
    },
    [reduceMotion, router, slide, clearTimers],
  );

  const value = useMemo(() => ({ flyTo, busy }), [flyTo, busy]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      {busy && (
        <Curtain
          slide={slide}
          paper={c.paper}
          tint={scheme === "dark" ? "paper" : "pine"}
        />
      )}
    </TransitionContext.Provider>
  );
}

function Curtain({
  slide,
  paper,
  tint,
}: {
  slide: Animated.Value;
  paper: string;
  tint: "pine" | "paper";
}) {
  const { width, height } = Dimensions.get("window");

  // 0 → off right, 1 → covering, 2 → off left.
  const panelX = slide.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [width, 0, -width],
  });

  // The sprite is bird-on-the-left, ribbon-to-the-right, so anchoring its
  // right edge to the panel's left edge puts the ribbon exactly where the pull
  // should be. It leads by its own width the whole way across.
  const birdX = slide.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [width, -DRAG_W, -width - DRAG_W],
  });

  // A shallow dip in the middle: level flight looks like a slide, a slight
  // arc looks like something alive is doing the pulling.
  const birdY = slide.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2],
    outputRange: [0, 26, 0, -22, 0],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: paper, transform: [{ translateX: panelX }] },
        ]}
      />

      <Animated.View
        style={[
          styles.bird,
          {
            top: height / 2 - DRAG_H / 2,
            transform: [{ translateX: birdX }, { translateY: birdY }],
          },
        ]}
      >
        <Image
          source={BIRD[tint].drag}
          style={{ width: DRAG_W, height: DRAG_H }}
          contentFit="contain"
          transition={0}
        />
      </Animated.View>
    </View>
  );
}

/** Matches the 640×360 sprite's aspect so the ribbon never squashes. */
const DRAG_W = 260;
const DRAG_H = 146;

const styles = StyleSheet.create({
  bird: { position: "absolute", left: 0, width: DRAG_W, height: DRAG_H },
});

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used inside TransitionProvider");
  return ctx;
}
