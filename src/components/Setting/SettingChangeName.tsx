// src/components/Setting/SettingChangeName.tsx

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
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SettingChangeNameProps {
  currentName: string;
  onSave: (newName: string) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function SettingChangeName({ currentName, onSave, onBack, onClose }: SettingChangeNameProps) {
  // Initialize state with the passed prop
  const [name, setName] = useState(currentName);
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = () => {
    if (name.trim().length > 0) {
      onSave(name); // Pass the new name back to ProfileScreen
      Keyboard.dismiss();
    }
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
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Icon name="chevron-left" size={28} color="#007AFF" />
              <Text style={styles.backText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Change Name</Text>
            <Text style={styles.description}>
              Please enter your real name as it appears on your ID documents.
            </Text>

            <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor="#999"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="words"
              />
              {name.length > 0 && (
                <TouchableOpacity onPress={() => setName('')}>
                  <Icon name="close-circle" size={20} color="#CCC" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, name.length === 0 && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={name.length === 0}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -8 },
  backText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  content: { marginTop: 10 },
  title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 10 },
  description: { fontSize: 14, color: '#666', marginBottom: 30, lineHeight: 20 },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#F2F2F2',
    marginBottom: 20,
  },
  inputContainerFocused: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    height: '100%',
  },
  
  saveBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#E5E5EA',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});