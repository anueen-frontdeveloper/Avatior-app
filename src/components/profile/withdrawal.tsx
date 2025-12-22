// src/components/profile/withdrawal.tsx

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface WithdrawalProps {
    onClose: () => void;
    onSelectMethod: (method: string) => void;
}

export default function Withdrawal({ onClose, onSelectMethod }: WithdrawalProps) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Withdrawal</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="close" size={24} color="#999" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Region Selector */}
                    <View style={styles.regionContainer}>
                        <View style={styles.regionInfo}>
                            <Text style={styles.flag}>🇮🇳</Text>
                            <View>
                                <Text style={styles.regionLabel}>Payment methods</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.regionValue}>India</Text>
                                    <Icon name="help-circle-outline" size={14} color="#999" style={{ marginLeft: 4 }} />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.changeLink}>Change</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Payment Methods Grid */}
                    <View style={styles.grid}>
                        {/* IMPS Card */}
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => onSelectMethod('IMPS')}
                        >
                            <View style={styles.logoRow}>
                                <Text style={[styles.impsText, { fontStyle: 'italic', fontWeight: '900' }]}>IMPS</Text>
                                <Icon name="menu-right" size={24} color="orange" />
                            </View>
                            <Text style={styles.cardLabel}>IMPS</Text>
                        </TouchableOpacity>

                        {/* Crypto Card */}
                        <TouchableOpacity style={styles.card}>
                            <View style={styles.cryptoIcons}>
                                <View style={[styles.coinIcon, { backgroundColor: '#F7931A' }]}>
                                    <Icon name="bitcoin" size={16} color="#fff" />
                                </View>
                                <View style={[styles.coinIcon, { backgroundColor: '#627EEA', marginLeft: -8 }]}>
                                    <Icon name="ethereum" size={16} color="#fff" />
                                </View>
                                <View style={[styles.coinIcon, { backgroundColor: '#FF0000', marginLeft: -8 }]}>
                                    <Icon name="rhombus-outline" size={16} color="#fff" />
                                </View>
                                <View style={[styles.coinIcon, { backgroundColor: '#eee', marginLeft: -8 }]}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>19</Text>
                                </View>
                            </View>
                            <Text style={styles.cardLabel}>Cryptocurrency</Text>
                        </TouchableOpacity>
                    </View>
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
        paddingVertical: 20,
    },
    headerTitle: { fontSize: 22, fontWeight: '700', color: '#000' },
    content: { paddingBottom: 20 },
    regionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    regionInfo: { flexDirection: 'row', alignItems: 'center' },
    flag: { fontSize: 24, marginRight: 10 },
    regionLabel: { fontSize: 12, color: '#999' },
    regionValue: { fontSize: 14, fontWeight: '700', color: '#000' },
    changeLink: { color: '#007AFF', fontWeight: '600' },
    grid: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
    card: {
        flex: 1,
        backgroundColor: '#F2F3F5',
        borderRadius: 16,
        padding: 15,
        height: 100,
        justifyContent: 'space-between',
    },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    impsText: { fontSize: 20, color: '#555' },
    cardLabel: { fontSize: 12, fontWeight: '600', color: '#000', marginTop: 10 },
    cryptoIcons: { flexDirection: 'row', alignItems: 'center' },
    coinIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
});