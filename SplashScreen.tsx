import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./App"; // adjust path if needed

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0) ;

  useEffect(() => {
    // Start animation
    scale.value = withSequence(
      withTiming(1.2, { duration: 800 }),
      withTiming(1, { duration: 300 })
    );
    opacity.value = withTiming(1, { duration: 800 });

    // Navigate to Home after 2.5 sec
    const timer = setTimeout(() => {
      navigation.replace("loading"); // ⬅️ replace so user can’t go back
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
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
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
});

export default SplashScreen;
