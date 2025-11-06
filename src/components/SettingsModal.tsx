import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Sound from 'react-native-sound';
Sound.setCategory('Playback');
import AvatarModal from "./AvatarModal";
import BetHistoryModal from "./BetHistoryModal"; // 👈 path to your modal file
import GameLimits from "./GameLimits";
import HowToPlay from "./HowToPlay";
import GameRules from "./GameRules";
import ProvablyFairModal from "./ProvablyFairModal";
import TestBetsModal from "./TestBetsModal";
import { useSound } from "../context/SoundContext";
import ChangeNameModal from "./ChangeNameModal";

import { useUser } from '../context/UserContext';

const { width } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;

}

const SettingsPopout: React.FC<Props> = ({
  visible,
  onClose,
}) => {
  const [avatarVisible, setAvatarVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const { soundEnabled, setSoundEnabled } = useSound();
  const [music, setMusic] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [gameLimitsVisible, setGameLimitsVisible] = useState(false);
  const [howToPlayVisible, setHowToPlayVisible] = useState(false);
  const [gameRulesVisible, setGameRulesVisible] = useState(false);
  const [provablyFairVisible, setProvablyFairVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("https://i.pravatar.cc/60"); // default avatar
  const [testBetVisible, setTestBetVisible] = useState(false); // ✅ new system‑info toggle
  const [changeNameVisible, setChangeNameVisible] = useState(false);
  const { username } = useUser(); // 👈 get username from context

  const slideAnim = useRef(new Animated.Value(width)).current; // starts off-screen right
  const [player, setPlayer] = useState<Sound | null>(null);

  useEffect(() => {
    const sound = new Sound('music.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('❌ Failed to load sound', error);
        return;
      }
      console.log('✅ Sound loaded');
    });

    setPlayer(sound);

    return () => {
      sound.release(); // clean up on unmount
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.panel,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: selectedAvatar }}
          style={styles.avatar}
        />

        <TouchableOpacity onPress={() => setChangeNameVisible(true)}>
          <Text style={styles.username}>{username}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.changeAvatarBtn}
          onPress={() => setAvatarVisible(true)}
        >          <Ionicons name="person-circle-outline" size={22} color="#8a8a8aff" />
          <Text style={styles.changeAvatarText}>Change{"\n"}Avatar</Text>
        </TouchableOpacity>
        <AvatarModal
          visible={avatarVisible}
          onClose={() => setAvatarVisible(false)}
          onSelect={(uri) => setSelectedAvatar(uri)}
          selectedAvatar={selectedAvatar}
        />


      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Toggles */}
        <View style={styles.row}>
          <Ionicons name="volume-high-outline" size={20} color="#ccc" />
          <Text style={styles.label}>Sound</Text>
          <Switch value={soundEnabled} onValueChange={setSoundEnabled}
            trackColor={{ false: "#575757ff", true: "#575757ff" }}
            thumbColor={soundEnabled ? "#ffffff" : "#aaa"}
            ios_backgroundColor="#3e3e3e" />
        </View>
        <View style={styles.row}>
          <Ionicons name="musical-notes-outline" size={20} color="#ccc" />
          <Text style={styles.label}>Music</Text>
          <Switch
            value={music}
            onValueChange={(val) => {
              setMusic(val);
              if (val) {
                player?.setNumberOfLoops(-1); // loop forever
                player?.play();
              } else {
                player?.pause();
              }
            }}
            trackColor={{ false: "#575757ff", true: "#575757ff" }}
            thumbColor={music ? "#ffffff" : "#aaa"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>

        <View style={styles.row}>
          <Ionicons name="sparkles-outline" size={20} color="#ccc" />
          <Text style={styles.label}>Animation</Text>
          <Switch value={animation} onValueChange={setAnimation}
            trackColor={{ false: "#575757ff", true: "#575757ff" }}
            thumbColor={animation ? "#ffffff" : "#aaa"}
            ios_backgroundColor="#3e3e3e" />
        </View>

        <View style={styles.group}>

          <TouchableOpacity
            style={styles.menuItem}
            // onPress={() => setTestBetVisible(true)} // open modal
          >
            <Ionicons name="gift-outline" size={18} color="#ccc" />
            <Text style={styles.menuText}>FREE Bets</Text>
          </TouchableOpacity>
          {/* <TestBetsModal visible={testBetVisible} onClose={() => setTestBetVisible(false)} /> */}


          <TouchableOpacity
            style={styles.menuItem}
            // onPress={() => setHistoryVisible(true)}
          >            <Ionicons name="document-text-outline" size={18} color="#ccc" />
            <Text style={styles.menuText}>My Bet History</Text>
          </TouchableOpacity>
          {/* <BetHistoryModal
            visible={historyVisible}
            onClose={() => setHistoryVisible(false)}
          /> */}


          <TouchableOpacity
            style={styles.menuItem}
            // onPress={() => setGameLimitsVisible(true)}
          >
            <Ionicons name="cash-outline" size={18} color="#ccc" />
            <Text style={styles.menuText}>Game Limits</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.menuItem} onPress={() => setHowToPlayVisible(true)}>
            <Ionicons name="book-outline" size={18} color="#ccc" />
            <Text style={styles.menuText}>How To Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setGameRulesVisible(true)}>
            <Ionicons name="newspaper-outline" size={18} color="#ccc" />
            <Text style={styles.menuText}>Game Rules</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setProvablyFairVisible(true)}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#ccc" />
            <Text style={styles.menuText}>Provably Fair Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="home-outline" size={18} color="#ccc" />
        <Text style={styles.footerText}>Home</Text>
      </View>
      {/* <GameLimits visible={gameLimitsVisible} onClose={() => setGameLimitsVisible(false)} /> */}
      <ChangeNameModal visible={changeNameVisible} onClose={() => setChangeNameVisible(false)} />

      <HowToPlay visible={howToPlayVisible} onClose={() => setHowToPlayVisible(false)} />

      <GameRules visible={gameRulesVisible} onClose={() => setGameRulesVisible(false)} />

      {/* <ProvablyFairModal visible={provablyFairVisible} onClose={() => setProvablyFairVisible(false)} /> */}

      {/* Close button */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    top: 44,
    right: 0,
    width: width * 0.90, // 75% screen width
    marginRight: 20,
    backgroundColor: "#2C2E2F",
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,

  },
  group: { marginTop: 18 },
  backdrop: {
    flex: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
  },
  changeAvatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#292929ff",
    borderRadius: 46,
    borderColor: "#a0a0a0ff",
    borderWidth: 0.3,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 40,
  },
  changeAvatarText: {
    color: "#a0a0a0ff",
    fontFamily: "Arial",
    fontSize: 13,
    marginLeft: 6,
  },

  username: {
    flex: 1,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
    marginTop: 18,
  },
  changeAvatar: {
    fontSize: 12,
    color: "#aaa",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 15,

    paddingVertical: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  label: {
    flex: 1,
    color: "#b1b1b1ff",
    marginLeft: 10,
    fontSize: 13,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 12,
    marginVertical: 1,
  },
  menuText: {
    color: "#afafafff",
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#2A2A2A",
    borderRadius: 6,
    marginTop: 15,
  },
  footerText: {
    color: "#afafafff",
    marginLeft: 6,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 15,
  },
});

export default SettingsPopout;
