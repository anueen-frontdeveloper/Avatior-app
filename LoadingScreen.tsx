import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./App"; // adjust path
import HeaderLogin from "./src/components/HeaderLogin"; // ✅ replaced Header
import { useTotalBet } from "./src/context/BalanceContext";

type LoadingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "loading"
>;

const Loading = () => {
  const navigation = useNavigation<LoadingScreenNavigationProp>();
  const ballCount = 3;
  const animations = useRef(
    Array.from({ length: ballCount }, () => new Animated.Value(0))
  ).current;
  const { balance } = useTotalBet();

  useEffect(() => {
    // Animate balls
    animations.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -15,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Navigate to Home after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* ✅ Replaced with HeaderLogin */}
      <HeaderLogin />

      {/* Centered logo + loader */}
      <View style={styles.centerContent}>
        <Image
          source={require("./assets/StartLogo.png")}
          style={styles.logo}
        />

        <View style={styles.row}>
          {animations.map((anim, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.ball,
                {
                  transform: [{ translateY: anim }],
                  width: idx === 1 ? 16 : 8,
                  height: idx === 1 ? 16 : 8,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }, 
  logo: {
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 80,
  },
  ball: {
    borderRadius: 50,
    backgroundColor: "#e90000ff",
  },
});
