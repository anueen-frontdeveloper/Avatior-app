import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Bet = {
    id: string;
    game: string;
    amount: number;
    status: 'open' | 'settled';
};

type BetHistoryProps = {
    onBack: () => void;
    onClose: () => void;
};

// Sample data
const sampleBets: Bet[] = [
    { id: '1', game: 'Football', amount: 500, status: 'settled' },
    { id: '2', game: 'Cricket', amount: 200, status: 'open' },
    { id: '3', game: 'Tennis', amount: 100, status: 'settled' },
];

export default function BetHistory({ onBack, onClose }: BetHistoryProps) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bet History</Text>
                <TouchableOpacity onPress={onClose}>
                    <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* List of bets */}
            <FlatList
                data={sampleBets}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.betCard}>
                        <Text style={styles.gameName}>{item.game}</Text>
                        <Text style={styles.betAmount}>₹{item.amount}</Text>
                        <Text style={[styles.status, item.status === 'open' ? styles.open : styles.settled]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
    listContent: { padding: 16 },
    betCard: {
        backgroundColor: '#F7F8FA',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    gameName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    betAmount: { fontSize: 14, color: '#555', marginBottom: 2 },
    status: { fontSize: 12, fontWeight: '600' },
    open: { color: '#FFA000' },
    settled: { color: '#00C853' },
});
