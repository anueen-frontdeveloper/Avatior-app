import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,

} from "react-native";

import Svg, { Path, Image as SvgImage } from "react-native-svg";
import FastImage from "react-native-fast-image";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { getCrashPoint } from "../utils/getCrashPoint";
import Sound from "react-native-sound";
import { useSound } from "../context/SoundContext";
const { width } = Dimensions.get("window");
const HEIGHT = 215;
const WIDTH = 300;

type Props = {
  onCrash?: (val: number) => void;
  onUpdate?: (val: number, isRunning: boolean) => void;
  bets?: any[];   // <-- add this line

};


const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvgImage = Animated.createAnimatedComponent(SvgImage);

export default function BalloonThread({
  onCrash,
  onUpdate,
  bets
}: Props) {
  const points = [{ x: 20, y: 206 }, { x: 225, y: 50 }];
  const loopStart = { x: 225, y: 50 };
  const loopEnd = { x: 270, y: 100 };
  const riseDuration = 2500;
  const glow = useSharedValue(1);

  const progressAnim = useSharedValue(0);
  // shared values
  const multiplier = useSharedValue(1);
  const cx = useSharedValue(points[0].x);
  const cy = useSharedValue(points[0].y);
  const isCrashing = useSharedValue(false);

  const sway = useSharedValue(0);

  const [isRunning, setIsRunning] = useState(true);
  const [showCrash, setShowCrash] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { soundEnabled } = useSound();
  const [totalWinUser, setTotalWinUser] = useState(0);

  const crashPoint = useSharedValue(
    getCrashPoint({ totalBetAmount: 1000, cashouttotal: totalWinUser })
  );

  const animatedThreadProps = useAnimatedProps(() => {
    const midX = (cx.value + points[0].x) / 1.2 + sway.value;
    const midY = (cy.value + points[0].y) / 3 + 50;
    const threadD = `M${cx.value},${cy.value} Q${midX},${midY} ${points[0].x},${points[0].y}`;
    const d = `${threadD} L${midX},${HEIGHT}`;
    return {
      d,
      opacity: isCrashing.value ? 0 : 1,
    };
  });
  useEffect(() => {
    crashPoint.value = getCrashPoint({
      totalBetAmount: 1000,
      cashouttotal: totalWinUser,
    });
  }, [totalWinUser]);

  const animatedPlaneProps = useAnimatedProps(() => ({
    x: cx.value - 20,
    y: cy.value - 80,
  }));
  const animatedMultiplierText = useDerivedValue(() =>
    `${multiplier.value.toFixed(2)}x`
  );

  const animatedMultiplierProps = useAnimatedProps(() => ({
    text: animatedMultiplierText.value,
  }));
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  useEffect(() => {
    if (!isRunning && countdown > 0) {
      progressAnim.value = 0;
      progressAnim.value = withTiming(1, {
        duration: countdown * 1000,
        easing: Easing.linear,
      });
    } else {
      progressAnim.value = 0;
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        1,
        true
      );
    }
  }, [isRunning]);
  const animatedGlowStyle = useAnimatedStyle(() => {
    let glowColor = '#369CD4'; // default blue
    if (multiplier.value > 2) glowColor = '#9951ffff';
    if (multiplier.value > 10) glowColor = '#9D1F80';

    return {
      textShadowRadius: 19 + glow.value * 90,
      textShadowColor: glowColor,
      textShadowOffset: { width: 3, height: 0 },
    };
  });


  useEffect(() => {
    if (!isRunning) return;

    multiplier.value = 1;

    playStartSound(() => {
      setTimeout(() => {
        cx.value = withTiming(points[1].x, { duration: riseDuration });
        cy.value = withTiming(points[1].y, { duration: riseDuration }, () => {
          if (!isCrashing.value) {
            cx.value = withRepeat(
              withSequence(
                withTiming(loopEnd.x, { duration: 3000 }),
                withTiming(loopStart.x, { duration: 3000 })
              ),
              -1,
              true
            );
            cy.value = withRepeat(
              withSequence(
                withTiming(loopEnd.y, { duration: 3000 }),
                withTiming(loopStart.y, { duration: 3000 })
              ),
              -1,
              true
            );
          }
        });

        sway.value = withRepeat(withTiming(8, { duration: 1000 }), -1, true);

        // Start multiplier animation
        const startTime = Date.now();
        let rafId: number;

        const tick = () => {
          const elapsed = (Date.now() - startTime) / 1000; // seconds
          const growthRate = Math.log(100) / 120; // reach 100x at ~30s

          const next = Math.exp(growthRate * elapsed);
          multiplier.value = next;

          if (onUpdate) runOnJS(onUpdate)(next, true);

          if (next >= crashPoint.value) {
            runOnJS(handleCrash)(next);
            return;
          }
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);

        // Cleanup
        return () => {
          if (rafId) cancelAnimationFrame(rafId);
          cancelAnimation(cx);
          cancelAnimation(cy);
          cancelAnimation(sway);
        };
      }, 600); // 0.5s delay
    });
  }, [isRunning]);

  useEffect(() => {
    let timer: number; // number works for React Native

    if (!isRunning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning, countdown]);


  useEffect(() => {
    if (!isRunning && countdown === 0 && showCrash) {
      setShowCrash(false);
      isCrashing.value = false;
      crashPoint.value = getCrashPoint(({ totalBetAmount: 1000, cashouttotal: 200 }));

      // Reset multiplier BEFORE next round
      multiplier.value = 1;

      cx.value = points[0].x;
      cy.value = points[0].y;
      setIsRunning(true);
    }
  }, [isRunning, countdown, showCrash]);

  const handleCrash = (val: number) => {
    console.log("When Crash leak - fly away : ", val);

    isCrashing.value = true;
    cancelAnimation(cx);
    cancelAnimation(cy);
    cancelAnimation(sway);

    cx.value = withTiming(WIDTH + 600, { duration: 400, easing: Easing.quad });
    cy.value = withTiming(-600, { duration: 400, easing: Easing.quad });

    setShowCrash(true);
    playCrashSound();

    onCrash?.(val);
    if (onUpdate) {
      runOnJS(onUpdate)(val, false);
    }

    setTimeout(() => {
      setIsRunning(false);
      setCountdown(8);
    }, 2000);
  };

  const playStartSound = (onFinish?: () => void) => {
    if (!soundEnabled) {
      onFinish?.();
      return;
    }
    const start = new Sound("startingplane.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load starting sound", error);
        onFinish?.();
        return;
      }
      start.play(() => {
        start.release();
        onFinish?.();
      });
    });
  };

  const playCrashSound = () => {
    if (!soundEnabled) return;
    const crash = new Sound("flewaway1.mp3", Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load sound", error);
        return;
      }
      crash.play(() => crash.release());
    });
  };
  const animatedPlaneStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: cx.value - 34 }, // offset to center the plane
      { translateY: cy.value - 70 }, // offset to center the plane
    ],
  }));
  return (
    <View style={styles.container}>
      <FastImage
        source={isRunning ? require("../../assets/BGStart.gif") : require("../../assets/BGstop.jpg")}
        style={StyleSheet.absoluteFillObject}
        resizeMode={FastImage.resizeMode.cover}
      />
      {isRunning ? (
        <View style={styles.gameBox}>
          {isRunning && !showCrash && (
            <Animated.Text
              style={[styles.multiplierText, animatedGlowStyle]}>
              {multiplier.value.toFixed(2)}x
            </Animated.Text>
          )}

          <Svg width={width} height={HEIGHT} viewBox={`10 -10 ${width} ${HEIGHT}`}>
            <AnimatedPath
              animatedProps={animatedThreadProps}
              stroke="#ff0037ff"
              strokeWidth={6}
              strokeLinecap="round"
              fill="#d1000098"
            />
            <Animated.View style={animatedPlaneStyle}>
              <FastImage
                source={require("../../assets/Aviator.gif")}
                style={{ width: 120, height: 120 }}
              />
            </Animated.View>

          </Svg>
          {showCrash && (
            <View style={styles.crashOverlay}>
              <Text style={styles.flewAway}>FLEW AWAY!</Text>
              <Text style={styles.crashMultiplier}>
                {crashPoint.value.toFixed(2)}x
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.waitBox}>
          <Image source={require("../../assets/TopLogo.png")} style={styles.topLogo} resizeMode="contain" />
          {countdown > 0 && (
            <>
              <View style={styles.progressContainer}>
                <Animated.View style={[styles.progressBar, progressStyle]} />
              </View>
              <FastImage source={require("../../assets/Aviator.gif")} style={styles.waitingPlane} resizeMode={FastImage.resizeMode.contain} />
              <Image source={require("../../assets/spribe.png")} style={styles.spribeLogo} resizeMode="contain" />
            </>
          )}
        </View>
      )}
      <PlayerCounter
        isRunning={isRunning}
        isCrashed={showCrash}
        countdown={countdown}
        count={bets?.length ?? 0}   // ✅ safe access — shows 0 if bets is undefined
      />    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#292929ff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 212,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#3b3b3b",
    marginHorizontal: 5,
  },
  gameBox: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 215,
  },
  multiplierText: {
    position: "absolute",
    fontSize: 75,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 5, height: 1 },
    textShadowRadius: 3,
    width: '100%',
    color: 'white',       // always fully visible
  },

  crashOverlay: {
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  flewAway: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  crashMultiplier: {
    fontSize: 75,
    fontWeight: "bold",
    color: "red",
  },
  waitingPlane: {
    position: "absolute",
    left: -15,
    bottom: -39,
    width: 120,
    height: 120,
  },
  topLogo: {
    width: 160,
    height: 90,
  },
  spribeLogo: {
    width: 120,
    height: 80,
    marginTop: 8,
  },
  waitBox: {
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    minHeight: 215,
  },
  progressContainer: {
    width: WIDTH - 60,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#e7000c",
  },
});


// ✅ Correct props typing
const PlayerCounter: React.FC<{
  isRunning: boolean;
  isCrashed: boolean;
  countdown: number;
  count?: number;   // externally supplied value, e.g., bets.length
  style?: any;
}> = ({ isRunning, isCrashed, countdown, count, style }) => {
  const [internalCount, setInternalCount] = useState(0);
  const [avatars, setAvatars] = useState<string[]>([
    `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
    `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
    `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (!isRunning && !isCrashed) {
      interval = setInterval(() => {
        setInternalCount(c => c + 1);
        setAvatars([
          `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
          `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
          `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
        ]);
      }, 400);
    }

    if (isRunning && !isCrashed) {
      interval = setInterval(() => {
        setInternalCount(c => Math.max(0, c - Math.floor(Math.random() * 5 + 1)));
      }, 700);
    }

    if (isCrashed && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isCrashed]);

  return (
    <View style={[playerStyles.playerCounter, style]}>
      <View style={[playerStyles.container, style]}>
        <View style={playerStyles.avatars}>
          {avatars.map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={[playerStyles.avatar, { marginLeft: i === 0 ? 0 : -15 }]}
            />
          ))}
        </View>
        <Text style={playerStyles.count}>
          {count !== undefined ? count : internalCount}
        </Text>
      </View>
    </View>
  );
};
const playerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#414141a1",
    paddingHorizontal: 6,

    paddingVertical: 6,
    borderRadius: 35,
  },
  avatars: {
    flexDirection: "row",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "lime",
    backgroundColor: "#fff",
  },
  count: {
    color: "#fff",
    fontSize: 12,
    marginHorizontal: 5,
    fontFamily: "Slabo13px-Regular",
  },
  // ✅ positioning style for bottom right
  playerCounter: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

