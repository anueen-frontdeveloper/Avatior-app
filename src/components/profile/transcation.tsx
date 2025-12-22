// src/components/profile/transcation.tsx

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// 1. Mock Data
const TRANSACTIONS = [
  { id: '1', method: 'UPI', type: 'deposit', amount: '300.00', status: 'canceled', date: '14 October 2025', time: '04:56 pm' },
  { id: '2', method: 'PayTm', type: 'deposit', amount: '300.00', status: 'canceled', date: '23 September 2025', time: '12:45 pm' },
  { id: '3', method: 'PayTm', type: 'deposit', amount: '302.00', status: 'successful', date: '3 September 2025', time: '12:51 pm' },
  { id: '4', method: 'UPI', type: 'withdrawal', amount: '301.00', status: 'canceled', date: '3 September 2025', time: '12:41 pm' },
  { id: '5', method: 'Paytm pay in app', type: 'withdrawal', amount: '1,000.00', status: 'canceled', date: '16 October 2023', time: '12:23 pm' },
];

interface TransactionProps {
  onBack: () => void;
  onClose: () => void;
}

export default function Transaction({ onBack, onClose }: TransactionProps) {
  // 2. State for Filter
  const [activeTab, setActiveTab] = useState<'All' | 'Deposits' | 'Withdrawals'>('All');

  // 3. Filter Logic
  const getFilteredData = () => {
    if (activeTab === 'All') return TRANSACTIONS;
    if (activeTab === 'Deposits') return TRANSACTIONS.filter(t => t.type === 'deposit');
    if (activeTab === 'Withdrawals') return TRANSACTIONS.filter(t => t.type === 'withdrawal');
    return [];
  };

  const renderItem = ({ item }: any) => {
    const isSuccess = item.status === 'successful';
    
    // Choose icon based on method name (Simple logic for demo)
    const iconName = item.method.toLowerCase().includes('upi') ? 'bank-transfer' : 'wallet-outline';
    const iconColor = item.method.toLowerCase().includes('paytm') ? '#00BAF2' : '#1a73e8';

    return (
      <View style={styles.card}>
        {/* Left: Icon */}
        <View style={styles.iconBox}>
           <Icon name={iconName} size={24} color={iconColor} />
        </View>

        {/* Middle: Details */}
        <View style={styles.details}>
          <Text style={styles.methodText}>{item.method}</Text>
          <View style={styles.statusRow}>
            <Icon 
              name={isSuccess ? "check-circle" : "close-circle-outline"} 
              size={14} 
              color={isSuccess ? "#00C853" : "#888"} 
            />
            <Text style={[styles.statusText, { color: isSuccess ? "#00C853" : "#888" }]}>
              {isSuccess ? "Successful" : "Canceled"}
            </Text>
          </View>
        </View>

        {/* Right: Amount & Date */}
        <View style={styles.rightSide}>
          <Text style={styles.amountText}>+₹{item.amount}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.dateText}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
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

        <Text style={styles.title}>Transaction history</Text>

        {/* Filter Tabs */}
        <View style={styles.tabContainer}>
          {['All', 'Deposits', 'Withdrawals'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={getFilteredData()}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

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
    paddingVertical: 15,
    marginBottom: 5,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: -8 },
  backText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  title: { fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 20 },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
  },

  // List Item
  listContent: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f5f5', // Placeholder for logo bg
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
});