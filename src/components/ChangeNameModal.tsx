// ChangeNameModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext'; // Import your context hook

interface ChangeNameModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangeNameModal: React.FC<ChangeNameModalProps> = ({ visible, onClose }) => {
  const { username, setUsername } = useUser();
  const [name, setName] = useState(username);

  // keep local state synced with context when modal opens
  useEffect(() => {
    if (visible) setName(username);
  }, [visible, username]);

  const handleChange = () => {
    setUsername(name.trim() || username); // don’t allow empty
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.backText} onPress={onClose}>{'< Back'}</Text>

          <Text style={styles.title}>Change name</Text>
          <Text style={styles.subtitle}>Enter your name</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.button} onPress={handleChange}>
            <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default ChangeNameModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',},
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    height: '85%',
    borderRadius: 12,
    padding: 20,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitle: {
    color: '#555',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#60A5FA',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
