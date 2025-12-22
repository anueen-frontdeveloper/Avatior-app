// src/components/HeaderLogin.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../context/AuthContext";
import RegisterModal from "./loginuser/register";
import LoginModal from "./loginuser/login";

export default function HeaderLogin() {
  const { showLogin, setShowLogin, showRegister, setShowRegister } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="chevron-back-outline" size={18} color="#c7c7c7ff" />
        <Text style={styles.backText}>Back</Text>
      </View>

      <View style={styles.right}>
        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={() => setShowLogin(true)}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerBtn} onPress={() => setShowRegister(true)}>
          <Text style={styles.registerText}>Registration</Text>
        </TouchableOpacity>

        {/* Star Icon */}
        <TouchableOpacity style={styles.starWrapper}>
          <FontAwesome name="star" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Login Modal */}
        <LoginModal
          visible={showLogin}
          onClose={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />

        {/* Register Modal */}
        <RegisterModal
          visible={showRegister}
          onClose={() => setShowRegister(false)}
          onLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#141414ff",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 10,
    fontFamily: "StackSansText-Regular",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginBtn: {
    backgroundColor: "#2c2c2cff",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  loginText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Ramabhadra-Regular",
  },
  registerBtn: {
    backgroundColor: "#50c246ff",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  registerText: {
    color: "white",
    fontSize: 11,
    fontFamily: "Ramabhadra-Regular",
  },
  starWrapper: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#181818ff",
    alignItems: "center",
    justifyContent: "center",
  },
});
