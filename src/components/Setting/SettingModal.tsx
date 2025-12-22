// src/components/Setting/SettingModal.tsx

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SettingModalProps {
  onBack: () => void;
  onClose: () => void;
  onNavigate: (screen: string) => void; // <--- NEW PROP

}

// Reusable Row Component
const SettingRow = ({ label, value, showChevron, isVerified, showFlag, isLast, actionText, onPress }: any) => (
  <TouchableOpacity
    style={[styles.row, !isLast && styles.rowBorder]}
    disabled={!onPress} // Enable click only if onPress is passed
    onPress={onPress}
  >
    <Text style={styles.label}>{label}</Text>
    <View style={styles.rightSide}>
      {value && <Text style={styles.value}>{value}</Text>}
      {showFlag && <Text style={{ fontSize: 18, marginLeft: 5 }}>🇮🇳</Text>}
      {isVerified && <Icon name="check-decagram" size={18} color="#00C853" style={{ marginLeft: 8 }} />}
      {actionText && <Text style={styles.actionText}>{actionText}</Text>}
      {showChevron && <Icon name="chevron-right" size={20} color="#999" style={{ marginLeft: 5 }} />}
    </View>
  </TouchableOpacity>
);

export default function SettingModal({ onBack, onClose, onNavigate }: SettingModalProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Icon name="chevron-left" size={28} color="#007AFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Settings</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Section: Main Data */}
          <Text style={styles.sectionTitle}>Main data</Text>
          <View style={styles.cardGroup}>
            {/* CLICKING NAME NOW TRIGGERS NAVIGATION */}
            <SettingRow
              label="Name"
              value="Anurag Kohli"
              showChevron
              onPress={() => onNavigate('changeName')}
            />
            <SettingRow
              label="Date of birth"
              value="01/01/1990"
              showChevron
              onPress={() => onNavigate('changeDoB')}
            />
            
                        <SettingRow label="Country of registration" value="India" showFlag isLast />
          </View>


          {/* Section: Contact Info */}
          <Text style={styles.sectionTitle}>Contact info</Text>

          {/* Phone (Separate Card) */}
          <View style={styles.singleCard}>
            <SettingRow label="Phone number" value="+91 88474 08708" isVerified isLast />
          </View>

          {/* Email (Separate Card) */}
          <View style={styles.singleCard}>
            <SettingRow label="Email" value="anuragkohlicu@gmail.com" isVerified isLast />
          </View>

          <Text style={styles.helperText}>
            To change confirmed data <Text style={styles.linkText}>contact us</Text>
          </Text>

          {/* Section: Security */}
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.singleCard}>
            <SettingRow label="Password" showChevron isLast />
          </View>
          <Text style={styles.helperText}>
            Enter your current password to make changes
          </Text>

          {/* Section: Other settings */}
          <Text style={styles.sectionTitle}>Other settings</Text>
          <View style={styles.singleCard}>
            <SettingRow label="Active sessions" actionText="End" isLast />
            <Text style={styles.subLabel}>Log out on other devices</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 5,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -8 },
  backText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 20 },
  scrollContent: { paddingBottom: 20 },

  sectionTitle: { fontSize: 13, color: '#666', marginBottom: 8, marginTop: 10 },

  // Container for grouped items (Main data)
  cardGroup: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  // Container for single items (Phone, Email, Password)
  singleCard: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 2, // Slight padding adjustment
    marginBottom: 8,
  },

  // Row Styling
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  label: { fontSize: 15, fontWeight: '700', color: '#000' },
  rightSide: { flexDirection: 'row', alignItems: 'center' },
  value: { fontSize: 14, color: '#666', fontWeight: '500' },
  actionText: { fontSize: 14, color: '#D32F2F', fontWeight: '700' }, // Red/Orange for "End"

  helperText: { fontSize: 12, color: '#666', marginBottom: 15, marginTop: 2 },
  linkText: { color: '#007AFF', fontWeight: '600' },
  subLabel: { fontSize: 12, color: '#666', marginTop: -10, marginBottom: 14 },
});