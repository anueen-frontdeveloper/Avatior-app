import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./App";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const { width, height } = Dimensions.get("window");

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // --- Shared Values ---

  // Plane Animation Values
  const planeScale = useSharedValue(0);
  const planeX = useSharedValue(0);
  const planeY = useSharedValue(0);
  const planeRotation = useSharedValue(0);

  // Text/Logo Animation Values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  // Navigation Callback
  const handleNavigate = () => {
    navigation.replace("loading");
  };

  useEffect(() => {
    // --- PHASE 1: ENTRANCE (0ms - 1000ms) ---

    // 1. Text fades in and scales gently
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });

    // 2. Plane pops in with a spring (bouncy effect)
    planeScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // --- PHASE 2: ANTICIPATION (1000ms - 1600ms) ---
    // The plane pulls back slightly before taking off (makes it feel realistic)
    const takeoffDelay = 1200;

    planeX.value = withDelay(takeoffDelay, withTiming(-30, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));
    planeY.value = withDelay(takeoffDelay, withTiming(30, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));
    planeRotation.value = withDelay(takeoffDelay, withTiming(-15, { duration: 600 }));

    // --- PHASE 3: TAKEOFF (1800ms - End) ---
    // The plane shoots off to top-right
    const flyAwayDelay = 1800;
    const duration = 1000;

    planeX.value = withDelay(flyAwayDelay, withTiming(width, {
      duration: duration,
      easing: Easing.in(Easing.exp) // Starts slow, gets very fast
    }));

    planeY.value = withDelay(flyAwayDelay, withTiming(-height, {
      duration: duration,
      easing: Easing.in(Easing.exp)
    }));

    planeRotation.value = withDelay(flyAwayDelay, withTiming(45, { duration: duration }));

    // Text fades out as plane leaves
    logoOpacity.value = withDelay(flyAwayDelay + 200, withTiming(0, { duration: 400 }));

    // Navigate after animation finishes
    const timer = setTimeout(() => {
      runOnJS(handleNavigate)();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // --- Animated Styles ---

  const planeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: planeX.value },
      { translateY: planeY.value },
      { scale: planeScale.value },
      { rotate: `${planeRotation.value}deg` },
    ],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Plane Image */}
        <Animated.Image
          source={require("./assets/plane.png")}
          style={[styles.plane, planeStyle]}
          resizeMode="contain"
        />

        {/* Text Logo Image */}
        <Animated.Image
          source={require("./assets/logo.png")}
          style={[styles.logoText, logoStyle]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 300,
  },
  plane: {
    width: 150,
    height: 150,
    marginBottom: -40, // Pulls the plane closer to the text
    zIndex: 2, // Ensures plane is visually on top of text
  },
  logoText: {
    width: 250,
    height: 80,
    zIndex: 1,
  },
});

export default SplashScreen;