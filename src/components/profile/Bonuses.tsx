import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Bonus = {
    id: string;
    title: string;
    description: string;
};

type BonusesProps = {
    onBack: () => void;
    onClose: () => void;
};

const sampleBonuses: Bonus[] = [
    { id: '1', title: 'Free Spins', description: 'Get 10 free spins every week.' },
    { id: '2', title: 'Cashback Offer', description: '5% cashback on all deposits.' },
    { id: '3', title: 'Welcome Bonus', description: '100% bonus on first deposit.' },
];

export default function Bonuses({ onBack, onClose }: BonusesProps) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bonuses</Text>
                <TouchableOpacity onPress={onClose}>
                    <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Bonus List */}
            <FlatList
                data={sampleBonuses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.bonusCard}>
                        <Text style={styles.bonusTitle}>{item.title}</Text>
                        <Text style={styles.bonusDescription}>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    listContent: {
        padding: 16,
    },
    bonusCard: {
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    bonusTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    bonusDescription: {
        fontSize: 14,
        color: '#555',
    },
});
