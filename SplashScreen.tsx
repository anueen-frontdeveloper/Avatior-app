import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./App";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const { width, height } = Dimensions.get("window");

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // FIX: Start VISIBLE and CENTERED so you can see if the image loads
  const scale = useSharedValue(0); 
  const opacity = useSharedValue(1); 
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const handleNavigate = () => {
    navigation.replace("loading");
  };

  useEffect(() => {
    // 1. POP IN (Scale up in center)
    scale.value = withTiming(1, { duration: 800, easing: Easing.elastic(1.5) });

    // 2. PREPARE FOR TAKEOFF (Back up slightly and tilt)
    const takeoffDelay = 1000;
    
    translateX.value = withDelay(takeoffDelay, withTiming(-50, { duration: 500 }));
    rotation.value = withDelay(takeoffDelay, withTiming(-10, { duration: 500 }));

    // 3. FLY AWAY (Shoot to top right)
    const flyAwayDelay = 1500;

    translateX.value = withDelay(flyAwayDelay, withTiming(width, {
      duration: 800,
      easing: Easing.in(Easing.exp), // Accelerate fast
    }));

    translateY.value = withDelay(flyAwayDelay, withTiming(-height, {
      duration: 800,
      easing: Easing.in(Easing.exp),
    }));

    rotation.value = withDelay(flyAwayDelay, withTiming(-45, { duration: 800 }));
    opacity.value = withDelay(flyAwayDelay + 400, withTiming(0, { duration: 200 }));

    // Navigate
    const timer = setTimeout(() => {
      handleNavigate();
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* If this image doesn't show, check the filename 'logo1.png' exactly */}
      <Animated.Image
        source={require("./assets/logo1.png")} 
        style={[styles.logo, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;