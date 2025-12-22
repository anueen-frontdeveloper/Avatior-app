import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SupportModal({ visible, onClose }: SupportModalProps) {
  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Click overlay to close */}
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} />
        
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>24/7 support</Text>
                <TouchableOpacity onPress={onClose}>
                    <Icon name="close" size={22} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                
                {/* Top Grid: Chat & Telegram */}
                <View style={styles.gridRow}>
                    {/* Chat Card */}
                    <TouchableOpacity style={styles.gridCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>Online chat</Text>
                            <View style={styles.iconBlueBox}>
                                <Icon name="chat-processing" size={18} color="#fff" />
                            </View>
                        </View>
                        <Text style={styles.cardMainText}>Response</Text>
                        <Text style={styles.cardMainText}>within 2 min.</Text>
                    </TouchableOpacity>

                    {/* Telegram Card */}
                    <TouchableOpacity style={styles.gridCard}>
                         <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>Telegram</Text>
                            <View style={styles.iconBlueBox}>
                                <Icon name="send" size={18} color="#fff" style={{marginLeft: -2}} /> 
                            </View>
                        </View>
                        <Text style={[styles.cardMainText, {marginTop: 20, fontWeight: '600'}]}>@FAQ_1win_bot</Text>
                    </TouchableOpacity>
                </View>

                {/* Phone Rows */}
                <View style={styles.rowCard}>
                    <View>
                        <Text style={styles.rowLabel}>For calls within India</Text>
                        <Text style={styles.rowValue}>+917901656971</Text>
                    </View>
                    <TouchableOpacity style={styles.phoneBtn}>
                        <Icon name="phone" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.rowCard}>
                     <View>
                        <Text style={styles.rowLabel}>For calls within India</Text>
                        <Text style={styles.rowValue}>+917901656951</Text>
                    </View>
                    <TouchableOpacity style={styles.phoneBtn}>
                        <Icon name="phone" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Email Rows */}
                <View style={styles.simpleCard}>
                    <Text style={styles.rowLabel}>Technical support</Text>
                    <Text style={styles.rowValue}>support@1win.social</Text>
                </View>

                 <View style={styles.simpleCard}>
                    <Text style={styles.rowLabel}>Security</Text>
                    <Text style={styles.rowValue}>security@1win.social</Text>
                </View>

                {/* Close Button */}
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>

                <View style={{height: 20}} />
            </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Dark background
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '85%', // Takes up mostly bottom part of screen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    paddingBottom: 20,
  },
  
  // Grid
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 15,
    minHeight: 100,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardLabel: { fontSize: 12, color: '#999' },
  iconBlueBox: {
    backgroundColor: '#007AFF', // Blue icon bg
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMainText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },

  // Row Cards (Phone/Email)
  rowCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simpleCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  rowLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  rowValue: { fontSize: 15, fontWeight: '700', color: '#000' },
  
  phoneBtn: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom Button
  closeBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});