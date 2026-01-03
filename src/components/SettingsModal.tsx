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
import {
  CircleUserRound,
  Volume1,
  Music,
  CircleQuestionMarkIcon,
  Star,
  FileText,
  Wallet,
  History,
  Book,
  ScrollText,
  ShieldCheck,
  Home,
} from 'lucide-react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import AvatarModal from "./AvatarModal";
import Sound from 'react-native-sound';
Sound.setCategory('Playback');
import BetHistoryModal from "./BetHistoryModal";
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
  const [selectedAvatar, setSelectedAvatar] = useState("https://i.pravatar.cc/60");
  const [testBetVisible, setTestBetVisible] = useState(false);
  const [changeNameVisible, setChangeNameVisible] = useState(false);
  const { userData, updateUser } = useUser();
  const [ProfileVisible, setProfileVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(width)).current;
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
      sound.release();
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
      <View style={styles.header}>
        <View style={styles.userSection}>
          <Image
            source={{ uri: selectedAvatar }}
            style={styles.avatar}
          />
          <Text style={styles.username} numberOfLines={1}>{userData.name}</Text>
        </View>

        <TouchableOpacity
          style={styles.changeAvatarBtn}
          onPress={() => setAvatarVisible(true)}
        >
          <CircleUserRound size={22} color="#8a8a8aff" />
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
        <View style={styles.row}>
          <Volume1 size={20} color="#727272ff" />
          <Text style={styles.label}>Sound</Text>
          <Switch value={soundEnabled} onValueChange={setSoundEnabled}
            trackColor={{ false: "#575757ff", true: "#575757ff" }}
            thumbColor={soundEnabled ? "#ffffff" : "#aaa"}
            ios_backgroundColor="#3e3e3e" />
        </View>
        <View style={styles.row}>
          <Ionicons name="musical-notes-outline" size={20} color="#727272ff" />          <Text style={styles.label}>Music</Text>
          <Switch
            value={music}
            onValueChange={(val) => {
              setMusic(val);
              if (val) {
                player?.setNumberOfLoops(-1);
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
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <View style={styles.propellerContainer}>
              <View style={[styles.blade, styles.blade1]} />

              <View style={[styles.blade, styles.blade2]} />

              <View style={[styles.blade, styles.blade3]} />

              <View style={styles.centerHub} />
            </View>
          </TouchableOpacity>
          <Text style={styles.label}>Animation</Text>

          <Switch value={animation} onValueChange={setAnimation}
            trackColor={{ false: "#575757ff", true: "#575757ff" }}
            thumbColor={animation ? "#ffffff" : "#aaa"}
            ios_backgroundColor="#3e3e3e" />
        </View>

        <View style={styles.group}>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setTestBetVisible(true)}
          >
            <Star size={18} color="#727272ff" />
            <Text style={styles.menuText}>Free Bets</Text>
          </TouchableOpacity>
          <TestBetsModal visible={testBetVisible} onClose={() => setTestBetVisible(false)} />


          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setHistoryVisible(true)}
          >
            <History size={18} color="#727272ff" />
            <Text style={styles.menuText}>My Bet History</Text>
          </TouchableOpacity>
          <BetHistoryModal
            visible={historyVisible}
            onClose={() => setHistoryVisible(false)}
          />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setGameLimitsVisible(true)}
          >
            <View style={styles.billBody}>

              <View style={styles.centerRect} />

              <View style={[styles.cornerCircle, styles.topLeft]} />
              <View style={[styles.cornerCircle, styles.topRight]} />
              <View style={[styles.cornerCircle, styles.bottomLeft]} />
              <View style={[styles.cornerCircle, styles.bottomRight]} />

            </View>
            <Text style={styles.menuText}>Game Limits</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.menuItem} onPress={() => setHowToPlayVisible(true)}>
            <CircleQuestionMarkIcon size={18} color="#727272ff" />
            <Text style={styles.menuText}>How To Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setGameRulesVisible(true)}
          >
            <ScrollText
              size={18}
              color="#727272ff"
            />
            <Text style={styles.menuText}>Game Rules</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.menuItem} onPress={() => setProvablyFairVisible(true)}>
            <ShieldCheck size={18} color="#727272ff" />
            <Text style={styles.menuText}>Provably Fair Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.footer}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <View style={styles.houseContainer}>

          <View style={styles.roof} />

          <View style={styles.body}>

            <View style={styles.door} />

          </View>

        </View>
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>

      <GameLimits visible={gameLimitsVisible} onClose={() => setGameLimitsVisible(false)} />
      <ChangeNameModal visible={changeNameVisible} onClose={() => setChangeNameVisible(false)} />

      <HowToPlay visible={howToPlayVisible} onClose={() => setHowToPlayVisible(false)} />

      <GameRules visible={gameRulesVisible} onClose={() => setGameRulesVisible(false)} />

      <ProvablyFairModal visible={provablyFairVisible} onClose={() => setProvablyFairVisible(false)} />

      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    top: 44,
    right: 0,
    width: width * 0.90,
    marginRight: 20,
    backgroundColor: "#2C2E2F",
    zIndex: 999,
  },
  houseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  roof: {
    width: 14,
    height: 14,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: '#727272ff',
    backgroundColor: 'transparent',
    transform: [{ rotate: '45deg' }],
    marginBottom: -5,
    zIndex: 2,
  },

  body: {
    width: 16,
    height: 11,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#727272ff',
    backgroundColor: 'transparent',
    position: 'relative',
    alignItems: 'center',
  },

  door: {
    position: 'absolute',
    bottom: -1.9999,
    width: 6,
    height: 7,

    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,

    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#727272ff',

    backgroundColor: '#2A2A2A',
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  group: { marginTop: 18 },
  backdrop: {
    flex: 1,
  },
  billBody: {
    width: 22,
    height: 13,
    borderWidth: 1.5,
    borderColor: '#727272ff',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  centerRect: {
    width: 6,
    height: 5,
    borderRadius: 0.6,
    borderWidth: 0.6,
    borderColor: '#727272ff',
    backgroundColor: 'transparent',
    zIndex: 2,
  },

  cornerCircle: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1,
    borderColor: '#727272ff',
    zIndex: 1,
  },

  topLeft: {
    top: -4.5,
    left: -4.5,
  },
  topRight: {
    top: -4.5,
    right: -4.5,
  },
  bottomLeft: {
    bottom: -4.5,
    left: -4.5,
  },
  bottomRight: {
    bottom: -4.5,
    right: -4.5,
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
  },
  changeAvatarText: {
    color: "#a0a0a0ff",
    fontFamily: "Arial",
    fontSize: 11,
    marginLeft: 6,
    textAlign: 'left',
  },

  username: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 12,
    fontSize: 15,

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

  iconButton: {
    padding: 7,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },

  propellerContainer: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  blade: {
    position: 'absolute',
    width: 3.5,
    height: 11,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#727272ff',
    backgroundColor: 'transparent',
  },


  blade1: {
    transform: [
      { rotate: '0deg' },
      { translateY: -6.5 }
    ],
  },
  blade2: {
    transform: [
      { rotate: '120deg' },
      { translateY: -6.5 }
    ],
  },
  blade3: {
    transform: [
      { rotate: '240deg' },
      { translateY: -6.5 }
    ],
  },

  centerHub: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    borderWidth: 1.2,
    borderColor: '#727272ff',
    backgroundColor: '#4e4e4e',
    zIndex: 1,
  },

});

export default SettingsPopout;
