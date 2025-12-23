
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
// Sub-screen Imports
import ReferralCode from './referralcode';
import Withdrawal from './withdrawal';
import WithdrawlBank from './withdrawlbank';
import Transaction from './transcation';
import SettingModal from '../Setting/SettingModal';
import SettingChangeName from '../Setting/SettingChangeName';
import SettingDoB from '../Setting/SettingDoB';
import SettingPhoneNum from '../Setting/SettingPhoneNum';
import SettingEmail from '../Setting/SettingEmail';
import SettingPassword from '../Setting/SettingPassword';
import SupportModal from './SupportModal';
import { useUser } from '../../context/UserContext';

// --- 1. DEFINE THE VARIABLE STRUCTURE ---
interface UserData {
    name: string;
    id: string;
    balance: string;
    dob: string;
    country: string;
    phone: string;
    email: string;
    currency: string;
}
// Reusable Menu Item Component
// Added 'onPress' to props destructuring and TouchableOpacity
const MenuItem = ({ icon, title, subtitle, showBorder = true, onPress }: any) => (
    <TouchableOpacity
        style={[styles.menuItem, showBorder && styles.menuItemBorder]}
        onPress={onPress}
        activeOpacity={0.7}
    >
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
type ProfileScreenProps = {
    onClose: () => void;
};

// Updated Type Definition to include all screens
type ViewState =
    | 'profile'
    | 'referral'
    | 'withdrawal'
    | 'withdrawalBank'
    | 'transaction'
    | 'settings'
    | 'changeName'
    | 'changeDoB'
    | 'changePhone'
    | 'changeEmail'
    | 'changePassword';

export default function ProfileScreen({ onClose }: ProfileScreenProps) {
    const [currentView, setCurrentView] = useState<ViewState>('profile');
    const [showSupport, setShowSupport] = useState(false);
    const { userData, updateUser } = useUser();

    const updateField = (field: keyof UserData, value: string) => {
        updateUser(field, value);
    };

    // Global close handler (usually closes the whole modal/sheet)
    const handleClose = () => {
        console.log("Close modal/screen");
        setCurrentView('profile');
        // In a real app navigation stack, this might be navigation.goBack()
    };

    // --- NAVIGATION LOGIC ---

    if (currentView === 'referral') {
        return <ReferralCode onBack={() => setCurrentView('profile')} onClose={handleClose} />;
    }

    if (currentView === 'withdrawal') {
        return (
            <Withdrawal
                onClose={() => setCurrentView('profile')}
                onSelectMethod={(method: string) => {
                    if (method === 'IMPS') setCurrentView('withdrawalBank');
                }}
            />
        );
    }

    if (currentView === 'withdrawalBank') {
        return <WithdrawlBank onBack={() => setCurrentView('withdrawal')} onClose={handleClose} />;
    }

    if (currentView === 'transaction') {
        return <Transaction onBack={() => setCurrentView('profile')} onClose={handleClose} />;
    }


    // --- SETTINGS FLOW ---

    if (currentView === 'settings') {
        return (
            <SettingModal
                userData={userData}
                onBack={() => setCurrentView('profile')}
                onClose={handleClose}
                onNavigate={(screen) => {
                    if (screen === 'changeName') setCurrentView('changeName');
                    if (screen === 'changeDoB') setCurrentView('changeDoB');
                    if (screen === 'changePhone') setCurrentView('changePhone');
                    if (screen === 'changeEmail') setCurrentView('changeEmail');
                    if (screen === 'changePassword') setCurrentView('changePassword'); // <--- Logic
                }}
            />
        );
    }


    if (currentView === 'changeName') {
        return (
            <SettingChangeName
                currentName={userData.name} // Get name from Context
                onSave={(newName) => {
                    updateUser('name', newName); // <--- Update Global Context
                    setCurrentView('settings');
                }}
                onBack={() => setCurrentView('settings')}
                onClose={handleClose}
            />
        );
    }
    if (currentView === 'changeDoB') {
        return <SettingDoB onBack={() => setCurrentView('settings')} onClose={handleClose} />;
    }

    if (currentView === 'changePhone') {
        return <SettingPhoneNum onBack={() => setCurrentView('settings')} onClose={handleClose} />;
    }

    if (currentView === 'changeEmail') {
        return (
            <SettingEmail
                currentEmail={userData.email}
                onSave={(newEmail) => {
                    updateUser('email', newEmail); // <--- Update Global Context
                    setCurrentView('settings');
                }}
                onBack={() => setCurrentView('settings')}
                onClose={handleClose}
            />
        );
    }


    if (currentView === 'changePassword') {
        return <SettingPassword onBack={() => setCurrentView('settings')} onClose={handleClose} />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userData.name}</Text>
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
                        <Text style={styles.walletBalance}>₹{userData.balance}</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.actionBtn, styles.depositBtn]}>
                                <Icon name="plus-circle" size={20} color="#fff" style={{ marginRight: 5 }} />
                                <Text style={styles.depositText}>Deposit</Text>
                            </TouchableOpacity>

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
                        // onPress logic can be added later
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
                        // onPress logic can be added later
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
                            onPress={() => setShowSupport(true)} // <--- Open Modal
                        />
                    </View>
                    <SupportModal
                        visible={showSupport}
                        onClose={() => setShowSupport(false)}
                    />

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
        borderRadius: 16,
        marginHorizontal: 12,
        padding: 12,
        marginBottom: 12,
    },
    walletLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    walletBalance: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    actionBtn: {
        flex: 1,
        height: 36,
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
        fontSize: 14,
    },
    withdrawText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },

    // Menu Groups
    menuGroup: {
        backgroundColor: '#F7F8FA',
        borderRadius: 16,
        marginHorizontal: 12,
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
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
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#777',
    },
});