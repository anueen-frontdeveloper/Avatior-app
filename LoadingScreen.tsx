import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./App"; 
// import HeaderLogin from "./src/components/Header";
import { useTotalBet } from "./src/context/BalanceContext";
import Header from "./src/components/Header";
type LoadingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "loading"
>;

const Loading = () => {
  const navigation = useNavigation<LoadingScreenNavigationProp>();
  
  // Create 3 individual animated values starting at Scale 1
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const duration = 200; // Speed of the transition

    // Defines the sequence: Ooo -> oOo -> ooO -> ooo
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          // Step 1: First ball grows (Ooo)
          Animated.timing(scale1, {
            toValue: 1.6,
            duration: duration,
            useNativeDriver: true,
          }),

          // Step 2: First shrinks, Second grows (oOo)
          Animated.parallel([
            Animated.timing(scale1, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(scale2, {
              toValue: 1.6,
              duration: duration,
              useNativeDriver: true,
            }),
          ]),

          // Step 3: Second shrinks, Third grows (ooO)
          Animated.parallel([
            Animated.timing(scale2, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(scale3, {
              toValue: 1.6,
              duration: duration,
              useNativeDriver: true,
            }),
          ]),

          // Step 4: Third shrinks (ooo)
          Animated.timing(scale3, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          
          // Optional: Tiny pause before restarting
          Animated.delay(100),
        ])
      ).start();
    };

    animate();

    // Navigate to Home after 3 seconds   
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.centerContent}>
        <Image
          source={require("./assets/StartLogo.png")}
          style={styles.logo}
        />

        <View style={styles.row}>
          {/* Ball 1 */}
          <Animated.View style={[styles.ball, { transform: [{ scale: scale1 }] }]} />
          {/* Ball 2 */}
          <Animated.View style={[styles.ball, { transform: [{ scale: scale2 }] }]} />
          {/* Ball 3 */}
          <Animated.View style={[styles.ball, { transform: [{ scale: scale3 }] }]} />
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
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    gap: 15, // Space between balls
    height: 30, // Fixed height to prevent layout jumping when balls grow
  },
  ball: {
    width: 12,  // All balls start same size
    height: 12, // All balls start same size
    borderRadius: 6,
    backgroundColor: "#e90000ff",
  },
});