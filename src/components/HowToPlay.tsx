// src/components/HowToPlay.tsx

import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Linking,
    StyleSheet,
    Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

type Props = {
    visible: boolean;
    onClose: () => void;
};

const HowToPlay: React.FC<Props> = ({ visible, onClose }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>HOW TO PLAY?</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* YouTube Watch Section */}
                    <TouchableOpacity style={styles.youtubeBox} onPress={() => Linking.openURL("https://youtu.be/xA7L77X7Reg?si=qytuiIdzxn8-1DWO")}
                    >
                        <Ionicons name="logo-youtube" size={24} color="#fff" />
                        <Text style={styles.youtubeText}>WATCH</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerBlack} />

                    {/* Steps */}
                    <View style={styles.stepContainer}>
                        <View style={styles.stepRow}>
                            <View style={styles.iconRed}>
                                <FontAwesome5 name="money-bill-wave" color="#fff" size={16} />
                            </View>
                            <Text style={styles.stepText}>
                                <Text style={styles.stepNumber}>01 </Text>
                                Make a bet, or even two at the same time and wait for the round
                                to start.
                            </Text>
                        </View>

                        <View style={styles.stepRow}>
                            <View style={styles.iconRed}>
                                <FontAwesome5 name="fighter-jet" color="#fff" size={16} />
                            </View>
                            <Text style={styles.stepText}>
                                <Text style={styles.stepNumber}>02 </Text>
                                Look after the lucky plane. Your win is your bet multiplied by
                                the coefficient of the lucky plane.
                            </Text>
                        </View>

                        <View style={styles.stepRow}>
                            <View style={styles.iconRed}>
                                <FontAwesome5 name="hand-holding-usd" color="#fff" size={16} />
                            </View>
                            <Text style={styles.stepText}>
                                <Text style={styles.stepNumber}>03 </Text>
                                Cash out before the plane flies away and the money is yours!
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: width * 0.9,
        backgroundColor: "#1c1c1c",
        borderRadius: 10,
        overflow: "hidden",
    },
    header: {
        backgroundColor: "#ffc400ff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    title: {
        color: "#1c1c1c",
        fontWeight: "700",
        fontSize: 15,
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        backgroundColor: "#333",
    },
    youtubeBox: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#ff0000",
        
        borderRadius: 8,
        justifyContent: "center",
        marginVertical: 10,
    },
    youtubeText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
    },
    dividerBlack: {
        height: 1,
        backgroundColor: "#000",
        marginVertical: 10,
    },
    stepContainer: {
        backgroundColor: "#ffc400ff",
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    iconRed: {
        width: 35,
        height: 35,
        backgroundColor: "#b22222",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    stepText: {
        flex: 1,
        color: "#1c1c1c",
        fontSize: 14,
        lineHeight: 20,
    },
    stepNumber: {
        fontWeight: "700",
    },
});

export default HowToPlay;
