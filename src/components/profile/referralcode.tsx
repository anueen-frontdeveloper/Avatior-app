import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../../context/UserContext';

// --- MOCK DATA ---
const VALID_CODES = [
  '123-12312-312-3441-3122',
  'WELCOME2024',
  'BONUS50'
];

const EXPIRED_CODES = [
  '1231-12321-43-41363-1223',
  'OLDCODE2023'
];

interface ReferralCodeProps {
  onBack: () => void;
  onClose: () => void;
}

export default function ReferralCode({ onBack, onClose }: ReferralCodeProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const { addToBalance } = useUser(); // Get function

  // Handle Text Change
  const handleChange = (text: string) => {
    setCode(text);
    if (error) setError(null); // Clear error when user starts typing again
  };

  // Handle Activation Logic
  const handleActivate = () => {
    Keyboard.dismiss();

    // 1. Check Empty
    if (!code) return;

    // 2. Check Valid
     if (VALID_CODES.includes(code)) {
        const reward = 30; // $50
        addToBalance(reward); // <--- Updates global balance immediately
        setModalVisible(true);
     }
    // 3. Check Expired
    else if (EXPIRED_CODES.includes(code)) {
      setError('This code has expired.');
    }
    // 4. Invalid
    else {
      setError('Invalid code. Please check and try again.');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCode(''); // Reset field after success
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.iconButton}>
              <Icon name="arrow-left" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <Icon name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>

            <View style={styles.heroSection}>
              <View style={styles.iconCircle}>
                <Icon name="gift-open-outline" size={42} color="#007AFF" />
              </View>
              <Text style={styles.title}>Bonus Activation</Text>
              <Text style={styles.description}>
                Enter your promo code to receive a balance update instantly.
              </Text>
            </View>

            {/* Input Field */}
            <View style={styles.formSection}>
              <Text style={styles.label}>PROMO CODE</Text>

              <View style={[
                styles.inputContainer,
                error ? styles.inputError : null
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 123-123..."
                  placeholderTextColor="#B0B0B0"
                  value={code}
                  onChangeText={handleChange}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                {code.length > 0 && (
                  <TouchableOpacity onPress={() => setCode('')}>
                    <Icon name="close-circle" size={20} color="#CCC" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Error Message Area */}
              <View style={styles.messageContainer}>
                {error && (
                  <View style={styles.errorRow}>
                    <Icon name="alert-circle-outline" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[styles.activateBtn, !code && styles.activateBtnDisabled]}
                onPress={handleActivate}
                disabled={!code}
                activeOpacity={0.8}
              >
                <Text style={styles.activateBtnText}>Activate Code</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.termsButton}>
                <Text style={styles.termsText}>Terms and conditions apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* --- SUCCESS MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Icon name="check-decagram" size={60} color="#34C759" />
            </View>

            <Text style={styles.modalTitle}>Code Activated!</Text>
            <Text style={styles.modalSubtitle}>
              Your balance has been updated successfully.
            </Text>

            <View style={styles.rewardBox}>
              <Text style={styles.rewardLabel}>ADDED TO BALANCE</Text>
              <Text style={styles.rewardAmount}>${rewardAmount}.00</Text>
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Awesome</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginTop: -60, // Visual adjustment to center vertically
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  },

  // Form Section
  formSection: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    height: '100%',
  },
  messageContainer: {
    height: 24, // Fixed height to prevent jumping
    marginTop: 8,
    marginBottom: 16,
    paddingLeft: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  activateBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activateBtnDisabled: {
    backgroundColor: '#E5E5EA',
    shadowOpacity: 0,
    elevation: 0,
  },
  activateBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  termsButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  termsText: {
    color: '#999',
    fontSize: 13,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  rewardBox: {
    backgroundColor: '#F5F9FF',
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1F0FF',
    marginBottom: 25,
  },
  rewardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
    letterSpacing: 1,
  },
  rewardAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  modalButton: {
    backgroundColor: '#1A1A1A',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});