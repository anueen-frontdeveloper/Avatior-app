import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type InfoModalProps = {
    visible: boolean;
    onClose: () => void;
    betAmount: number;
    frozenMultiplier: number;
};

const InfoModal: React.FC<InfoModalProps> = ({
    visible,
    onClose,
    betAmount,
    frozenMultiplier,
}) => {
    const totalWin = betAmount * frozenMultiplier;

    // Auto-close after 2 seconds
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000); // 2000ms = 2 seconds
            return () => clearTimeout(timer);
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Left text */}
                    <View style={styles.leftBox}>
                        <Text style={styles.cashoutText}>You have cashed out!</Text>
                        <Text style={styles.multiplier}>{frozenMultiplier.toFixed(2)}x</Text>
                    </View>

                    {/* Center Win Box */}
                    <View style={styles.winBox}>
                        <Text style={styles.winLabel}>WIN INR</Text>
                        <Text style={styles.winValue}>{totalWin.toFixed(2)}</Text>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1c6b2a",
        borderRadius: 50,
        borderBlockColor: "#3CD83C",
        borderWidth: 2,
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    leftBox: {
        marginRight: 15,
    },
    cashoutText: {
        color: "#d6f5d6",
        fontSize: 15,
    },
    multiplier: {
        color: "#d6f5d6",
        fontSize: 15,
        fontFamily: "Barlow-SemiBold",
        marginTop: 4,
        textAlign: "center",
    },
    winBox: {
        backgroundColor: "#3CD83C",
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    winLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        fontStyle: "italic",
        textShadowColor: "rgba(0,0,0,0.7)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    winValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginTop: 2,
        textShadowColor: "rgba(0,0,0,0.8)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    closeBtn: {
        marginLeft: 15,
    },
    closeText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default InfoModal;
