import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import Sound from "react-native-sound";

type Props = {
  visible: boolean;
  onClose: () => void;
  amount?: number;
};

const SuccessModal: React.FC<Props> = ({ visible, onClose, amount }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const SuccessSound = (onFinish?: () => void) => {
    const start = new Sound(
      "success_pay.mp3",
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log("Failed to load starting sound", error);
          onFinish?.();
          return;
        }
        start.play(() => {
          start.release();
          onFinish?.();
        });
      }
    );
  };
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withSpring(1, { damping: 10 });
      SuccessSound()
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none" // we control animation manually
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: opacity.value }]}>
        <Animated.View style={[styles.modalBox, animatedStyle]}>
          <MaterialCommunityIcons name="check-circle" size={70} color="#3CB01F" />

          <Text style={styles.title}>Welcome to RULE 🎉</Text>
          <Text style={styles.subtitle}>
            Deposit Successful{amount ? ` (+${amount} INR)` : "!"}
          </Text>

          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#1e1e1e",
    width: "80%",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 15,
    marginTop: 6,
    marginBottom: 20,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#3CB01F",
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SuccessModal;
