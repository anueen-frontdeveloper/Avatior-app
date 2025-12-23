import React, { useMemo, useRef, useEffect } from "react";
import {
  Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, TextInput,
  Platform, KeyboardAvoidingView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// --- Types ---
type Message =
  | { id: string; type: "ban"; user: string; duration: number; reason: string }
  | { id: string; type: "win"; user: string; amount: string; multiplier: string; avatar: string }
  | { id: string; type: "chat"; user: string; text: string; level: number }
  | { id: string; type: "gif"; user: string; gifUrl: string; level: number };

// --- Mock Data ---
const USERS = ["Player777", "LuckyJoe", "AviatorKing", "SpeedyG", "WinnerX", "CryptoFan", "Whale_01", "ElonM", "MoonBoy"];
const AVATARS = [
  "https://i.pravatar.cc/100?img=11",
  "https://i.pravatar.cc/100?img=12",
  "https://i.pravatar.cc/100?img=33",
  "https://i.pravatar.cc/100?img=5",
];

// 🟢 WORKING DIRECT GIF LINKS
const GIFS = [
  "https://media1.giphy.com/media/v1.Y2lkPTQiqR6SiQwfJaW9tXny3gLCkbdta7RMY3J6Y3J6Y3J6Y3J6Y3J6Y3J6Y3J6/l0Ex6kAKAoFRsFh6M/giphy.gif", // Money rain
  "https://media2.giphy.com/media/mi6DsSSNKDbUY/giphy.gif", // Rocket launch
  "https://media0.giphy.com/media/3o6UB5RrlQuMfZp82Y/giphy.gif", // Shocked
  "https://media4.giphy.com/media/xTiTnqUxyWbsAXq7Ju/giphy.gif", // Mind blown
  "https://media3.giphy.com/media/LdOyjZ7io5Msw/giphy.gif", // Mr Krabs Money
];

// 🟢 AI CHAT GENERATOR
const generateAiText = () => {
  const strategies = ["Auto cashout 2x", "Wait for pink", "All in now", "Betting small", "Sniper mode on"];
  const reactions = ["OMG", "Scam?", "RIGGED", "LFG!!!", "Nice one", "Too fast", "Fly baby fly"];
  const predictions = ["Next is 10x", "Don't bet", "1.1x incoming", "Green wall soon", "Recovering losses"];

  const type = Math.random();
  if (type < 0.3) return strategies[Math.floor(Math.random() * strategies.length)];
  if (type < 0.6) return reactions[Math.floor(Math.random() * reactions.length)];
  return predictions[Math.floor(Math.random() * predictions.length)];
};

const generateChat = (count: number): Message[] => {
  const msgs: Message[] = [];
  for (let i = 0; i < count; i++) {
    const seed = Math.random();
    const user = USERS[Math.floor(Math.random() * USERS.length)];

    if (seed < 0.05) {
      msgs.push({
        id: `ban-${i}`, type: "ban", user, duration: 120, reason: "Spam",
      });
    } else if (seed < 0.15) {
      msgs.push({
        id: `win-${i}`, type: "win", user,
        amount: (Math.random() * 5000 + 100).toFixed(0),
        multiplier: (Math.random() * 10 + 1.1).toFixed(2) + "x",
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      });
    } else if (seed < 0.25) {
      msgs.push({
        id: `gif-${i}`, type: "gif", user,
        gifUrl: GIFS[Math.floor(Math.random() * GIFS.length)],
        level: Math.floor(Math.random() * 50) + 1,
      });
    } else {
      msgs.push({
        id: `chat-${i}`, type: "chat", user,
        text: generateAiText(), // 🟢 Uses AI generator
        level: Math.floor(Math.random() * 20) + 1,
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
  const messages = useMemo(() => generateChat(40), [visible]);
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Live Chat</Text>
              <View style={styles.onlineBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.onlineCount}>18,402</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Chat Content */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            // 🟢 FIX: Auto-scroll to bottom immediately when content loads
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
          >
            {messages.map((msg) => {
              // --- BAN MESSAGE ---
              if (msg.type === "ban") {
                return (
                  <View key={msg.id} style={styles.banContainer}>
                    <Ionicons name="alert-circle" size={16} color="#FF453A" style={{ marginRight: 6 }} />
                    <Text style={styles.banText}>
                      <Text style={styles.banUser}>{msg.user}</Text> banned (Spam)
                    </Text>
                  </View>
                );
              }

              // --- WIN CARD ---
              if (msg.type === "win") {
                return (
                  <View key={msg.id} style={styles.winCard}>
                    <View style={styles.winHeader}>
                      <Text style={styles.winTitle}>BIG WIN</Text>
                      <Text style={styles.winMultiplier}>{msg.multiplier}</Text>
                    </View>
                    <View style={styles.winBody}>
                      <Image source={{ uri: msg.avatar }} style={styles.winAvatar} />
                      <View style={styles.winInfo}>
                        <Text style={styles.winUser}>{msg.user}</Text>
                        <Text style={styles.winAmount}>+ ₹{msg.amount}</Text>
                      </View>
                    </View>
                  </View>
                );
              }

              // --- GIF MESSAGE ---
              if (msg.type === "gif") {
                return (
                  <View key={msg.id} style={styles.chatRow}>
                    <View style={styles.chatAvatarContainer}>
                      <Image source={{ uri: `https://ui-avatars.com/api/?name=${msg.user}&background=random&color=fff&size=64` }} style={styles.chatAvatar} />
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{msg.level}</Text>
                      </View>
                    </View>
                    <View style={styles.gifBubble}>
                      <Text style={styles.chatUser}>{msg.user}</Text>
                      <Image
                        source={{ uri: msg.gifUrl }}
                        style={styles.gifImage}
                        resizeMode="cover" // 🟢 Ensures GIF fills the box
                      />
                    </View>
                  </View>
                );
              }

              // --- REGULAR CHAT ---
              if (msg.type === "chat") {
                return (
                  <View key={msg.id} style={styles.chatRow}>
                    <View style={styles.chatAvatarContainer}>
                      <Image source={{ uri: `https://ui-avatars.com/api/?name=${msg.user}&background=random&color=fff&size=64` }} style={styles.chatAvatar} />
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{msg.level}</Text>
                      </View>
                    </View>
                    <View style={styles.chatBubble}>
                      <Text style={styles.chatUser}>{msg.user}</Text>
                      <Text style={styles.chatText}>{msg.text}</Text>
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.gifBtn}>
              <Text style={styles.gifBtnText}>GIF</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Send a message..."
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.sendBtn}>
              <Ionicons name="arrow-up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    flexDirection: 'row',
  },
  modalContainer: {
    width: "100%",
    maxWidth: 420,
    height: "100%",
    backgroundColor: "#111",
    alignSelf: 'flex-end',
  },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 14, borderBottomWidth: 1, borderBottomColor: "#222", backgroundColor: "#161616",
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#fff", marginRight: 10 },
  onlineBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#222',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#30D158', marginRight: 5 },
  onlineCount: { fontSize: 10, color: '#aaa', fontWeight: '600' },
  closeBtn: { padding: 4 },

  scroll: { flex: 1, backgroundColor: "#0d0d0d" },
  scrollContent: { padding: 12, paddingBottom: 20 },

  banContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 69, 58, 0.08)',
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 6, marginBottom: 8,
    borderLeftWidth: 2, borderLeftColor: '#FF453A',
  },
  banText: { color: '#FF453A', fontSize: 11 },
  banUser: { fontWeight: '700' },

  winCard: {
    backgroundColor: "#1A1A1A", borderRadius: 8, marginBottom: 12,
    borderWidth: 1, borderColor: '#333', overflow: 'hidden'
  },
  winHeader: {
    backgroundColor: "rgba(48, 209, 88, 0.2)",
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 10, paddingVertical: 5,
  },
  winTitle: { color: '#30D158', fontWeight: '800', fontSize: 11 },
  winMultiplier: { color: '#fff', fontWeight: '700', fontSize: 11 },
  winBody: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  winAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  winInfo: { flex: 1 },
  winUser: { color: '#ccc', fontSize: 11, marginBottom: 1 },
  winAmount: { color: '#30D158', fontWeight: '700', fontSize: 13 },

  chatRow: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-start' },
  chatAvatarContainer: { marginRight: 10, alignItems: 'center', marginTop: 2 },
  chatAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#333' },
  levelBadge: {
    position: 'absolute', bottom: -4, backgroundColor: '#333',
    paddingHorizontal: 4, borderRadius: 4, borderWidth: 1, borderColor: '#111',
  },
  levelText: { color: '#aaa', fontSize: 8, fontWeight: 'bold' },

  chatUser: { color: '#666', fontSize: 11, fontWeight: '600', marginBottom: 3 },

  chatBubble: { flex: 1, justifyContent: 'center' },
  chatText: { color: '#E0E0E0', fontSize: 13, lineHeight: 18 },

  gifBubble: { flex: 1, maxWidth: 220 },
  gifImage: {
    width: 180, height: 120, borderRadius: 8, backgroundColor: '#222',
  },

  footer: {
    padding: 10, backgroundColor: "#161616",
    borderTopWidth: 1, borderTopColor: "#222",
    flexDirection: 'row', alignItems: 'center',
  },
  gifBtn: {
    backgroundColor: '#222', paddingHorizontal: 8, paddingVertical: 6,
    borderRadius: 4, marginRight: 8, borderWidth: 1, borderColor: '#333'
  },
  gifBtnText: { color: '#888', fontSize: 10, fontWeight: '800' },
  input: {
    flex: 1, backgroundColor: "#0a0a0a", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    color: "#fff", fontSize: 13, marginRight: 10,
    borderWidth: 1, borderColor: '#222'
  },
  sendBtn: {
    backgroundColor: "#30D158", width: 32, height: 32,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
});

export default ChatModal;