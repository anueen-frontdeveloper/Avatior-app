import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";

type Message =
  | { id: string; type: "ban"; user: string; duration: number; reason: string }
  | { id: string; type: "bot"; user: string; text: string; cashedOut: string; win: string; round: string; bet: string; avatar: string } // ✅ added avatar
  | { id: string; type: "user"; user: string; text: string };
const avatars = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
];

// Helper to generate random messages
const generateMessages = (count: number): Message[] => {
  const users = ["4***d", "6***r", "3***n", "5***a", "2***x"];
  const reasons = ["Spam", "Abuse", "Scam"];

  const msgs: Message[] = [];
  for (let i = 0; i < count; i++) {
    const typePick = Math.random();

    if (typePick < 0.6) {
      // 60% chance = ban
      msgs.push({
        id: `ban-${i}`,
        type: "ban",
        user: users[Math.floor(Math.random() * users.length)],
        duration: 10000,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
      });
    } else if (typePick < 0.75) {
      // 15% chance = bot
      msgs.push({
        id: `bot-${i}`,
        type: "bot",
        user: users[Math.floor(Math.random() * users.length)],
        text: "Best in this round with HUGE WIN!",
        cashedOut: (50 + Math.random() * 20).toFixed(2) + "x",
        win: (500 + Math.random() * 200).toFixed(2),
        round: (60 + Math.random() * 10).toFixed(2) + "x",
        bet: "FREE BET",
        avatar: avatars[Math.floor(Math.random() * avatars.length)], // ✅ assign avatar

      });
    } else {
      // 25% chance = normal chat
      msgs.push({
        id: `user-${i}`,
        type: "user",
        user: users[Math.floor(Math.random() * users.length)],
        text:
          ["see odds!", "this round crazy", "free bet win!", "lol", "chop ban here"].sort(
            () => 0.5 - Math.random()
          )[0],
      });
    }
  }
  return msgs;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const ChatModal: React.FC<Props> = ({ visible, onClose }) => {
  // Generate once (memoized)
  const messages = useMemo(() => generateMessages(20), []);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.header}>● 1148</Text>

          {/* Messages */}
          <ScrollView style={styles.scroll}>
            {messages.map((msg) => {
              if (msg.type === "ban") {
                return (
                  <View key={msg.id} style={styles.banBox}>
                    <Text style={styles.banText}>
                      <Text style={styles.user}>{msg.user}</Text> has been{" "}
                      <Text style={styles.bold}>banned</Text> from chat for{" "}
                      {msg.duration} d.
                    </Text>
                    <Text style={styles.reason}>Reason: {msg.reason}</Text>
                  </View>
                );
              }
              if (msg.type === "bot") {
                return (
                  <View key={msg.id} style={styles.botBox}>
                    {/* header */}
                    <Text style={styles.botHeader}>🤖 {msg.text}</Text>

                    {/* card */}
                    <View style={styles.botCard}>
                      {/* avatar + username */}
                      <View style={styles.userRow}>
                        <Image
                          source={{ uri: msg.avatar ?? "https://i.pravatar.cc/40" }} // user avatar
                          style={styles.avatar}
                        />
                        <Text style={styles.botUser}>{msg.user}</Text>
                      </View>

                      {/* info rows */}
                      <View style={styles.row}>
                        <Text style={styles.label}>Cashed out:</Text>
                        <Text style={styles.cashedOut}>{msg.cashedOut}</Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.label}>Win, INR:</Text>
                        <Text style={styles.value}>{msg.win}</Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.label}>Round:</Text>
                        <Text style={styles.value}>{msg.round}</Text>
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.label}>Bet, INR:</Text>
                        <Text style={styles.value}>{msg.bet}</Text>
                      </View>
                    </View>
                  </View>
                );
              }

              if (msg.type === "user") {
                return (
                  <View key={msg.id} style={styles.userBox}>
                    <Text style={styles.userMsg}>
                      <Text style={styles.user}>{msg.user}</Text>: {msg.text}
                    </Text>
                  </View>
                );
              }

              return null;
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  botBox: {
    marginVertical: 8,
    marginHorizontal: 10,
  },
  botHeader: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
  },
  botCard: {
    backgroundColor: "#3b0a45", // dark purple card
    borderRadius: 10,
    padding: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 8,
  },
  botUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    color: "#aaa",
    fontSize: 13,
  },
  value: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  cashedOut: {
    color: "#ff4da6", // pink highlight
    fontWeight: "bold",
    fontSize: 13,
  },
  modal: {
    backgroundColor: "#000",
    width: 330,
    maxHeight: "100%",
    borderRadius: 8,
    padding: 10,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  closeText: { fontSize: 20, color: "#ccc" },
  header: { color: "#00ff00", fontSize: 16, textAlign: "center", marginBottom: 10 },
  scroll: { marginTop: 5 },

  // Ban
  banBox: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  banText: {
    color: "#fff", fontSize: 10,
    textAlign: "center",
  },
  reason: { color: "#ccc", fontSize: 12, marginTop: 3, textAlign: "center", },
  user: { color: "#ff5555", fontWeight: "bold" },
  bold: { fontWeight: "bold" },

  // Bot
  botText: { color: "#1e90ff", marginBottom: 6, fontWeight: "600" },
  botLine: { color: "#fff", fontSize: 12 },

  // User
  userBox: { marginBottom: 8 },
  userMsg: { color: "#fff", fontSize: 13 },
});

export default ChatModal;
