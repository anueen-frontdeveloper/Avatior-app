// src/components/Setting/SettingChangeName.tsx

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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SettingChangeNameProps {
    onBack: () => void;
    onClose: () => void;
}

export default function SettingChangeName({ onBack, onClose }: SettingChangeNameProps) {
    const [name, setName] = useState('Anurag Kohli');

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >

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

                <View style={styles.content}>
                    <Text style={styles.title}>Change name</Text>
                    <Text style={styles.subtitle}>Enter your name</Text>

                    {/* Input Field with Label inside */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter name"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Change Button */}
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
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
        marginBottom: 10,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -8 },
    backText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },

    content: { flex: 1 },
    title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 25 },

    inputContainer: {
        backgroundColor: '#F2F3F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    input: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        padding: 0, // Reset default Android padding
    },

    button: {
        backgroundColor: '#7CB1FF', // Matches the lighter blue in screenshot
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});