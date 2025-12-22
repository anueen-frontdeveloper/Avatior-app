// src/components/profile/profilesscree.tsx

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReferralCode from './referralcode';
import Withdrawal from './withdrawal';
import WithdrawlBank from './withdrawlbank';
import Transaction from './transcation'; // <--- NEW IMPORT
import SettingModal from '../Setting/SettingModal'; // <--- NEW IMPORT
import SettingChangeName from '../Setting/SettingChangeName'; // Import the new file
import SettingDoB from '../Setting/SettingDoB';
// Reusable Menu Item Component
const MenuItem = ({ icon, title, subtitle, showBorder = true }: any) => (
    <TouchableOpacity style={[styles.menuItem, showBorder && styles.menuItemBorder]}>
        <View style={styles.iconContainer}>
            <Icon name={icon} size={24} color="#666" />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.menuTitle}>{title}</Text>
            <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
);
type ViewState = 'profile' | 'referral' | 'withdrawal' | 'withdrawalBank' | 'transaction' | 'settings' | 'changeName' | 'changeDoB'; // <--- UPDATED TYPE

export default function ProfileScreen() {
    const [currentView, setCurrentView] = useState<ViewState>('profile');

    const handleClose = () => {
        console.log("Close modal/screen");
        setCurrentView('profile');
    };

    if (currentView === 'referral') {
        return (
            <ReferralCode
                onBack={() => setCurrentView('profile')}
                onClose={handleClose}
            />
        );
    }
    if (currentView === 'withdrawal') {
        return (
            <Withdrawal
                onClose={() => setCurrentView('profile')}
                onSelectMethod={(method) => {
                    if (method === 'IMPS') setCurrentView('withdrawalBank');
                }}
            />
        );
    }

    if (currentView === 'withdrawalBank') {
        return (
            <WithdrawlBank
                onBack={() => setCurrentView('withdrawal')}
                onClose={handleClose}
            />
        );
    }
    // New Transaction View Condition
    if (currentView === 'transaction') {
        return (
            <Transaction
                onBack={() => setCurrentView('profile')}
                onClose={handleClose}
            />
        );
    }
    // --- NEW SETTINGS CONDITION ---
    if (currentView === 'settings') {
        return (
            <SettingModal
                onBack={() => setCurrentView('profile')}
                onClose={handleClose}
                onNavigate={(screen) => {
                    if (screen === 'changeName') setCurrentView('changeName');
                }}
            />
        );
    }
    // NEW CONDITION
    if (currentView === 'changeName') {
        return (
            <SettingChangeName
                onBack={() => setCurrentView('settings')} // Go back to Settings
                onClose={handleClose}
            />
        );
    }

    if (currentView === 'changeDoB') {
        return (
            <SettingDoB
                onBack={() => setCurrentView('settings')} // Go back to Settings
                onClose={handleClose}
            />
        );
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity>
                        <Icon name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Anurag Kohli</Text>
                        <View style={styles.idContainer}>
                            <Icon name="card-account-details-outline" size={16} color="#666" style={{ marginRight: 5 }} />
                            <Text style={styles.userId}>ID 50661927</Text>
                            <TouchableOpacity>
                                <Icon name="content-copy" size={14} color="#999" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Wallet Card */}
                    <View style={styles.walletCard}>
                        <Text style={styles.walletLabel}>Main account</Text>
                        <Text style={styles.walletBalance}>₹0.05</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.actionBtn, styles.depositBtn]}>
                                <Icon name="plus-circle" size={20} color="#fff" style={{ marginRight: 5 }} />
                                <Text style={styles.depositText}>Deposit</Text>
                            </TouchableOpacity>

                            {/* WITHDRAW BUTTON TRIGGER */}
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.withdrawBtn]}
                                onPress={() => setCurrentView('withdrawal')}
                            >
                                <Text style={styles.withdrawText}>Withdraw</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Menu Group 1: Bonuses */}
                    <View style={styles.menuGroup}>
                        <MenuItem
                            icon="gift-outline"
                            title="Bonuses"
                            subtitle="Free spins and other offers"
                        />
                        <MenuItem
                            icon="ticket-percent-outline"
                            title="Bonus codes"
                            subtitle="Code activation"
                            showBorder={false}
                            onPress={() => setCurrentView('referral')}
                        />
                    </View>

                    {/* Menu Group 2: History */}
                    <View style={styles.menuGroup}>
                        <MenuItem
                            icon="clock-time-four-outline"
                            title="Bet history"
                            subtitle="Open and settled bets"
                        />
                        <MenuItem
                            icon="history"
                            title="Transaction history"
                            subtitle="Deposit and withdrawal statuses"
                            showBorder={false}
                            onPress={() => setCurrentView('transaction')}
                        />
                    </View>

                    {/* Menu Group 3: Settings */}
                    <View style={styles.menuGroup}>
                        <MenuItem
                            icon="cog-outline"
                            title="Settings"
                            subtitle="Edit personal data"
                            onPress={() => setCurrentView('settings')}

                        />
                        <MenuItem
                            icon="headset"
                            title="24/7 support"
                            subtitle="All contact info"
                            showBorder={false}
                        />
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', // Assuming the dark top background from image
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
    },
    userInfo: {
        alignItems: 'center',
        marginVertical: 15,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 5,
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userId: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },

    // Wallet Card
    walletCard: {
        backgroundColor: '#F7F8FA',
        borderRadius: 20,
        marginHorizontal: 16,
        padding: 20,
        marginBottom: 20,
    },
    walletLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    walletBalance: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    actionBtn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    depositBtn: {
        backgroundColor: '#00C853', // Bright Green
    },
    withdrawBtn: {
        backgroundColor: '#E5E5E5', // Light Gray
    },
    depositText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    withdrawText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },

    // Menu Groups
    menuGroup: {
        backgroundColor: '#F7F8FA', // Light grey background for groups
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    iconContainer: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#777',
    },
});