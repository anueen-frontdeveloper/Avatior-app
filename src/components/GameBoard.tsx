import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, Text, TextInput } from "react-native";
import Svg, { Path } from "react-native-svg";
import FastImage from "react-native-fast-image";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  useAnimatedProps,
  useAnimatedStyle,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";
import { useGame } from "../context/GameContext";

const { width } = Dimensions.get("window");
const HEIGHT = 215;
const WIDTH = 300;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Dummy avatar URLs for the visual example
const AVATAR_1 = "https://i.pravatar.cc/150?img=1";
const AVATAR_2 = "https://i.pravatar.cc/150?img=5";
const AVATAR_3 = "https://i.pravatar.cc/150?img=8";

export default function BalloonThread({ bets }: { bets?: any[] }) {
  const { status, crashPoint, countdown, getCurrentMultiplier } = useGame();

  const multiplierAnim = useSharedValue(1);
  const cx = useSharedValue(20);
  const cy = useSharedValue(206);
  const sway = useSharedValue(0);
  const isCrashing = useSharedValue(false);
  const progressAnim = useSharedValue(0);
  const glow = useSharedValue(0);

  const points = [{ x: 20, y: 206 }, { x: 225, y: 50 }];
  const loopStart = { x: 225, y: 50 };
  const loopEnd = { x: 270, y: 100 };

  useEffect(() => {
    let rafId: number;

    if (status === "RUNNING") {
      isCrashing.value = false;

      // Start Pulse for Glow
      glow.value = withRepeat(withTiming(1, { duration: 1600 }), -1, true);

      // --- PLANE MOVEMENT (Slow Start -> Speed Up -> Slow End) ---
      const moveEasing = Easing.inOut(Easing.quad);

      cx.value = withTiming(points[1].x, { duration: 5500, easing: moveEasing });

      cy.value = withTiming(points[1].y, { duration: 5500, easing: moveEasing }, () => {
        // Loop animation (floating) after arrival
        cx.value = withRepeat(
          withSequence(withTiming(loopEnd.x, { duration: 3000 }), withTiming(loopStart.x, { duration: 3000 })),
          -1, true
        );
        cy.value = withRepeat(
          withSequence(withTiming(loopEnd.y, { duration: 3000 }), withTiming(loopStart.y, { duration: 3000 })),
          -1, true
        );
      });

      sway.value = withRepeat(withTiming(8, { duration: 1000 }), -1, true);

      // Sync Loop
      const tick = () => {
        const val = getCurrentMultiplier();
        multiplierAnim.value = val;
        if (status === "RUNNING") rafId = requestAnimationFrame(tick);
      };
      tick();

    } else if (status === "CRASHED") {
      multiplierAnim.value = getCurrentMultiplier();
      handleVisualCrash();
    } else {
      resetVisuals();
      if (status === "COUNTDOWN" && countdown > 0) {
        progressAnim.value = 0;
        progressAnim.value = withTiming(1, { duration: countdown * 1000, easing: Easing.linear });
      }
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      cancelAnimation(cx);
      cancelAnimation(cy);
      cancelAnimation(sway);
      cancelAnimation(glow);
    };
  }, [status]);

  const handleVisualCrash = () => {
    isCrashing.value = true;
    cancelAnimation(cx);
    cancelAnimation(cy);
    cancelAnimation(sway);
    cx.value = withTiming(WIDTH + 1200, { duration: 400 });
    cy.value = withTiming(-1200, { duration: 400 });
  };

  const animatedGlowStyle = useAnimatedStyle(() => {
    const val = multiplierAnim.value;
    let activeColor = "#3aa7e2";
    if (val > 10) activeColor = "#a72187";
    else if (val > 2) activeColor = "#7b31e4";

    return {
      textShadowColor: activeColor,
      textShadowRadius: 12 + (glow.value * 60),
      color: "white",
    };
  });

  const resetVisuals = () => {
    isCrashing.value = false;
    cx.value = points[0].x;
    cy.value = points[0].y;
    multiplierAnim.value = 1.00;
  };

  const animatedTextProps = useAnimatedProps(() => {
    return { text: `${multiplierAnim.value.toFixed(2)}x`, value: `${multiplierAnim.value.toFixed(2)}x` } as any;
  });

  const animatedPlaneStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cx.value - 34 }, { translateY: cy.value - 70 }],
  }));

  const animatedStrokeProps = useAnimatedProps(() => {
    const midX = (cx.value + points[0].x) / 1.2 + sway.value;
    const midY = (cy.value + points[0].y) / 3 + 50;
    return { d: `M${cx.value},${cy.value} Q${midX},${midY} ${points[0].x},${points[0].y}`, opacity: isCrashing.value ? 0 : 1 };
  });

  const animatedFillProps = useAnimatedProps(() => {
    const midX = (cx.value + points[0].x) / 1.2 + sway.value;
    const midY = (cy.value + points[0].y) / 3 + 50;
    return { d: `M${cx.value},${cy.value} Q${midX},${midY} ${points[0].x},${points[0].y} L${points[0].x},${HEIGHT} L${cx.value},${HEIGHT} Z`, opacity: isCrashing.value ? 0 : 1 };
  });

  const progressStyle = useAnimatedStyle(() => ({ width: `${progressAnim.value * 100}%` }));

  return (
    <View style={styles.container}>
      <FastImage
        source={status === "RUNNING" ? require("../../assets/BGStart.gif") : require("../../assets/BGstop.jpg")}
        style={StyleSheet.absoluteFillObject}
        resizeMode={FastImage.resizeMode.cover}
      />

      {status === "RUNNING" || status === "CRASHED" ? (
        <View style={styles.gameBox}>

          <Svg width={width} height={HEIGHT} viewBox={`10 -10 ${width} ${HEIGHT}`}>
            <AnimatedPath animatedProps={animatedFillProps} fill="#d1000098" stroke="none" />
            <AnimatedPath animatedProps={animatedStrokeProps} stroke="#ff0037ff" strokeWidth={6} strokeLinecap="round" fill="none" />
            <Animated.View style={animatedPlaneStyle}>
              <FastImage source={require("../../assets/Aviator.gif")} style={{ width: 120, height: 120 }} />
            </Animated.View>
          </Svg>
          {status === "RUNNING" && (
            <AnimatedTextInput
              underlineColorAndroid="transparent"
              editable={false}
              style={[styles.multiplierText, animatedGlowStyle]}
              animatedProps={animatedTextProps}
            />
          )}

          {status === "CRASHED" && (
            <View style={styles.crashOverlay}>
              <Text style={styles.flewAway}>FLEW AWAY!</Text>
              <Text style={styles.crashMultiplier}>{crashPoint.toFixed(2)}x</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.waitBox}>
          <Image source={require("../../assets/TopLogo.png")} style={styles.topLogo} resizeMode="contain" />
          {status === "COUNTDOWN" && (
            <>
              <View style={styles.progressContainer}>
                <Animated.View style={[styles.progressBar, progressStyle]} />
              </View>
              <FastImage source={require("../../assets/Aviator.gif")} style={styles.waitingPlane} resizeMode={FastImage.resizeMode.contain} />
            </>
          )}
          <Image source={require("../../assets/spribe.png")} style={styles.bottomLogo} resizeMode="contain" />
        </View>
      )}

      {/* --- ADDED SOCIAL PILL HERE --- */}
      <View style={styles.socialPill}>
        <View style={styles.avatarGroup}>
          <FastImage source={{ uri: AVATAR_1 }} style={[styles.avatar, { zIndex: 1 }]} />
          <FastImage source={{ uri: AVATAR_2 }} style={[styles.avatar, { zIndex: 2, marginLeft: -12 }]} />
          <FastImage source={{ uri: AVATAR_3 }} style={[styles.avatar, { zIndex: 3, marginLeft: -12 }]} />
        </View>
        <Text style={styles.socialCount}>626</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#292929", borderRadius: 12, alignItems: "center", justifyContent: "center",
    minHeight: 212, overflow: "hidden", borderWidth: 0.5, borderColor: "#3b3b3b", marginHorizontal: 5,
  },
  gameBox: { alignItems: "center", justifyContent: "center", minHeight: 215, width: '100%' },
  waitBox: { alignItems: "center", justifyContent: "center", width: '100%', minHeight: 215 },
  multiplierText: {
    position: "absolute",
    fontSize: 75,
    fontWeight: "bold",
    textAlign: "center",
    width: '100%',
    padding: 0,
    backgroundColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
  },
  crashOverlay: { position: "absolute", top: "10%", alignItems: "center" },
  flewAway: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 6 },
  crashMultiplier: { fontSize: 75, fontWeight: "bold", color: "red" },
  topLogo: { width: 160, height: 90 },
  bottomLogo: { width: 140, height: 90, marginVertical: 10 },
  progressContainer: { width: WIDTH - 60, height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressBar: { height: "100%", backgroundColor: "#e7000c" },
  waitingPlane: { position: "absolute", left: -15, bottom: -39, width: 120, height: 120 },

  // --- NEW STYLES ---
  socialPill: {
    position: 'absolute',
    bottom: 12,
    right: 12, // Or use alignSelf: 'center' if you want it in the middle
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Opacity 0.5 black background
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 999, // Ensure it is on top of everything
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#42f54e', // Bright green border
    backgroundColor: '#333',
  },
  socialCount: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    marginRight: 4,
  },
});