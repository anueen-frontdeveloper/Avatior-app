import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Animated, Modal,Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./App";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAuth } from "./src/context/AuthContext";
import HeaderLogin from "./src/components/HeaderLogin";
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
  const { isLoggedIn, setShowRegister } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleGuestClick = () => {
    setShowRegister(true);
  };
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
      {isLoggedIn ? <Header /> : <HeaderLogin />}


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
      <Modal visible={showWelcome} transparent animationType="fade">
        <View style={styles.welcomeOverlay}>
          <View style={styles.welcomeBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeSub}>You have successfully logged in.</Text>
          </View>
        </View>
      </Modal>
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
  welcomeOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeBox: {
    width: 280,
    backgroundColor: "#191919",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  welcomeTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  welcomeSub: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
  ball: {
    width: 12,  // All balls start same size
    height: 12, // All balls start same size
    borderRadius: 6,
    backgroundColor: "#e90000ff",
  },
});