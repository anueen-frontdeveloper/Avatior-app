import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SettingPasswordProps {
  onBack: () => void;
  onClose: () => void;
}

export default function SettingPassword({ onBack, onClose }: SettingPasswordProps) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [repeatPass, setRepeatPass] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
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

          <Text style={styles.title}>Password change</Text>

          {/* Current Password */}
          <Text style={styles.label}>Enter current password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#999" style={styles.inputIcon} />
            <TextInput 
                style={styles.input}
                placeholder="Current password"
                placeholderTextColor="#999"
                secureTextEntry
                value={currentPass}
                onChangeText={setCurrentPass}
            />
          </View>

          {/* New Password */}
          <Text style={styles.label}>Create a new password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#999" style={styles.inputIcon} />
            <TextInput 
                style={styles.input}
                placeholder="New password"
                placeholderTextColor="#999"
                secureTextEntry
                value={newPass}
                onChangeText={setNewPass}
            />
          </View>

          {/* Validation List */}
          <View style={styles.validationList}>
            <Text style={styles.validationItem}>•  At least 8 characters</Text>
            <Text style={styles.validationItem}>•  Includes 1 digit</Text>
            <Text style={styles.validationItem}>•  Includes uppercase and lowercase letters</Text>
            <Text style={styles.validationItem}>•  Differs from the old password by 50%</Text>
          </View>

          {/* Repeat Password */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#999" style={styles.inputIcon} />
            <TextInput 
                style={styles.input}
                placeholder="Repeat new password"
                placeholderTextColor="#999"
                secureTextEntry
                value={repeatPass}
                onChangeText={setRepeatPass}
            />
          </View>

          {/* Change Button */}
          <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -8 },
  backText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  
  title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8, marginTop: 10 },

  inputContainer: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    padding: 0, 
  },

  validationList: { marginLeft: 5, marginBottom: 20, marginTop: 5 },
  validationItem: { fontSize: 13, color: '#666', lineHeight: 20 },

  button: {
    backgroundColor: '#007AFF', // Standard Blue
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});