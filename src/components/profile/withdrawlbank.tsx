// src/components/profile/withdrawlbank.tsx

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
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface WithdrawlBankProps {
    onBack: () => void;
    onClose: () => void;
}

export default function WithdrawlBank({ onBack, onClose }: WithdrawlBankProps) {
    const [amount, setAmount] = useState('1,200');

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
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

                    {/* Title Logo */}
                    <View style={styles.titleRow}>
                        <Text style={[styles.impsLogo, { fontStyle: 'italic' }]}>IMPS</Text>
                        <Icon name="menu-right" size={30} color="orange" style={{ marginLeft: -5 }} />
                        <Text style={styles.titleText}>IMPS</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Bank Selector */}
                        <TouchableOpacity style={styles.inputWrapper}>
                            <Text style={styles.placeholderText}>Bank</Text>
                            <Icon name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.input}
                            placeholder="Full name"
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="IFSC code"
                            placeholderTextColor="#666"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="IMPS bank account number"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                        />

                        {/* Amount Field */}
                        <View style={styles.amountContainer}>
                            <Text style={styles.amountLabel}>Amount</Text>
                            <View style={styles.amountInputRow}>
                                <Text style={styles.currencySymbol}>₹</Text>
                                <TextInput
                                    style={styles.amountInput}
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <Text style={styles.helperText}>from ₹1,200 to ₹50,000</Text>

                        {/* Button */}
                        <TouchableOpacity style={styles.submitBtn}>
                            <Text style={styles.submitText}>Withdraw</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { paddingHorizontal: 20, paddingBottom: 40 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -8 },
    backText: { color: '#007AFF', fontSize: 16 },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, marginTop: 10 },
    impsLogo: { fontSize: 24, fontWeight: '900', color: '#555' },
    titleText: { fontSize: 18, fontWeight: '700', marginLeft: 10, color: '#000' },
    form: { gap: 12 },
    inputWrapper: {
        backgroundColor: '#F2F3F5',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        backgroundColor: '#F2F3F5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#000'
    },
    placeholderText: { color: '#666', fontSize: 16 },
    amountContainer: {
        backgroundColor: '#F2F3F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    amountLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
    amountInputRow: { flexDirection: 'row', alignItems: 'center' },
    currencySymbol: { fontSize: 18, fontWeight: '600', color: '#000' },
    amountInput: { fontSize: 18, fontWeight: '600', color: '#000', flex: 1, marginLeft: 5, padding: 0 },
    helperText: { fontSize: 12, color: '#666', marginTop: -5, marginLeft: 5 },
    submitBtn: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20
    },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});