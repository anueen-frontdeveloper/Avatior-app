import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

// Create 70 dummy avatar URLs
const avatars = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    uri: `https://i.pravatar.cc/100?img=${i + 1}`,
}));

type Props = {
    visible: boolean;
    onClose: () => void;
    onSelect?: (uri: string) => void;
    selectedAvatar?: string;

};

const AvatarModal: React.FC<Props> = ({ visible, onClose, onSelect,selectedAvatar  }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>CHANGE AVATAR</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={22} color="#ccc" />
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    <FlatList
                        data={avatars}
                        numColumns={5}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            const isSelected = item.uri === selectedAvatar;
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.avatarWrapper,
                                        isSelected && { borderColor: "#1DB954", borderWidth: 2 } // highlight selected
                                    ]}
                                    onPress={() => onSelect?.(item.uri)}
                                >
                                    <Image source={{ uri: item.uri }} style={styles.avatarImage} />
                                </TouchableOpacity>
                            );
                        }}

                        contentContainerStyle={styles.avatarGrid}
                        showsVerticalScrollIndicator={true}
                        style={{ flex: 1 }} // 👈 add this line
                    />


                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Text style={styles.closeText}>CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)", // semi-transparent backdrop
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: width * 0.95,
        backgroundColor: "#000", // black background
        borderRadius: 10,
        height: 700, // make it square
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#333", // grey header
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    headerTitle: {
        color: "#fff",

        fontSize: 14,
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        backgroundColor: "#555",
    },
    avatarGrid: {
        paddingVertical: 8,
        paddingHorizontal: 5,
        backgroundColor: "#000",
    },
    avatarWrapper: {
        width: (width * 2.5) / 14 - 4, // fit 14 per row
        height: (width * 2.5) / 14 - 4,
        margin: 2,
        borderRadius: 50,
        borderWidth: 1,
        overflow: "hidden",
        backgroundColor: "#fafafaff",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
    },
    footer: {
        backgroundColor: "#242424ff", // grey footer
        paddingVertical: 10,
        alignItems: "center",
    },
    closeBtn: {
        borderBlockColor: "#888",
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 8,
    },
    closeText: {
        color: "#fff",
        fontWeight: "700",
        letterSpacing: 1,
    },
});

export default AvatarModal;
