import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../context/AuthContext"; // Import Context
import RegisterModal from "./loginuser/register";
import LoginModal from "./loginuser/login";

export default function HeaderLogin() {
  // Grab the login function from context
  const { showLogin, setShowLogin, showRegister, setShowRegister, login } = useAuth();

  return (
    <View style={styles.container}>
      {/* ... Left Side and Right Side Buttons (Same as your code) ... */}
      <View style={styles.left}>
        <Ionicons name="chevron-back" size={20} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => setShowLogin(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => setShowRegister(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.registerText}>Registration</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.starWrapper} activeOpacity={0.7}>
          <FontAwesome name="star" size={14} color="#FFFFFF" />
        </TouchableOpacity>

        {/* --- MODALS --- */}
        <LoginModal
          visible={showLogin}
          onClose={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          // Pass the login function here
          onLoginSuccess={login} 
        />

        <RegisterModal
          visible={showRegister}
          onClose={() => setShowRegister(false)}
          onLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          // Pass the login function here
          onRegisterSuccess={login}
        />
      </View>
    </View>
  );
}

// ... styles remain the same
const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 50, // Matches main header status bar spacing
      paddingBottom: 15,
      paddingHorizontal: 15,
      backgroundColor: "#141414ff", // Consistent Dark Background
    },
  
    // --- Left ---
    left: {
      flexDirection: "row",
      alignItems: "center",
    },
    backText: {
      color: "#fff",
      fontSize: 15,
      marginLeft: 4,
      // YOUR FONT
      fontFamily: "Roboto-Medium",
    },
  
    // --- Right ---
    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8, // Spacing between buttons
    },
  
    // Login Button (Darker)
    loginBtn: {
      backgroundColor: "#2C2C2E", // Dark Grey
      borderRadius: 8,
      paddingVertical: 7,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: "#3A3A3C",
    },
    loginText: {
      color: "#fff",
      fontSize: 12,
      // YOUR FONT
      fontFamily: "Roboto-Bold",
    },
  
    // Register Button (Green)
    registerBtn: {
      backgroundColor: "#00C853", // Vibrant Green
      borderRadius: 8,
      paddingVertical: 8, // Slightly taller to pop
      paddingHorizontal: 14,
    },
    registerText: {
      color: "#fff",
      fontSize: 12,
      // YOUR FONT
      fontFamily: "Roboto-Bold",
      textTransform: 'uppercase', // Often stylized like this
      letterSpacing: 0.5,
    },
  
    // Star Icon
    starWrapper: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: "#2C2C2E",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
    },
  });