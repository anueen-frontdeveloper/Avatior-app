import React, { useState } from 'react';
import {
    StyleSheet,
    Modal,
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
import Bonuses from './Bonuses';
import BetHistory from './BetHistory';
import DepositModal from './../Deposit/DepositModal';
import DepositWallet from './../Deposit/DepositWallet';

// --- TYPES ---
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

interface MenuItemProps {
    icon: string;
    title: string;
    subtitle?: string;
    showBorder?: boolean;
    onPress: () => void;
}

type ProfileScreenProps = {
    onClose: () => void;
};

type ViewState =
    | 'profile'
    | 'referral'
    | 'bonuses'
    | 'betHistory'
    | 'withdrawal'
    | 'withdrawalBank'
    | 'transaction'
    | 'settings'
    | 'changeName'
    | 'changeDoB'
    | 'changePhone'
    | 'changeEmail'
    | 'changePassword';

type PaymentMethod = any;

// --- MENU ITEM COMPONENT ---
const MenuItem: React.FC<MenuItemProps> = ({ icon, title, subtitle, showBorder = true, onPress }) => (
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
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <Icon name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
);

// --- PROFILE SCREEN ---
export default function ProfileScreen({ onClose }: ProfileScreenProps) {
    const [currentView, setCurrentView] = useState<ViewState>('profile');
    const [showSupport, setShowSupport] = useState(false);
    const { userData, updateUser } = useUser();
    const [walletVisible, setWalletVisible] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    const updateField = (field: keyof UserData, value: string) => {
        updateUser(field, value);
    };

    const handleClose = () => {
        setCurrentView('profile');
    };

    // --- NAVIGATION LOGIC ---
    switch (currentView) {
        case 'referral':
            return <ReferralCode onBack={() => setCurrentView('profile')} onClose={handleClose} />;
        case 'withdrawal':
            return (
                <Withdrawal
                    onClose={() => setCurrentView('profile')}
                    onSelectMethod={(method: string) => {
                        if (method === 'IMPS') setCurrentView('withdrawalBank');
                    }}
                />
            );
        case 'bonuses':
            return <Bonuses onBack={() => setCurrentView('profile')} onClose={handleClose} />;
        case 'withdrawalBank':
            return <WithdrawlBank onBack={() => setCurrentView('withdrawal')} onClose={handleClose} />;
        case 'transaction':
            return <Transaction onBack={() => setCurrentView('profile')} onClose={handleClose} />;
        case 'betHistory':
            return <BetHistory onBack={() => setCurrentView('profile')} onClose={handleClose} />;
        case 'settings':
            return (
                <SettingModal
                    userData={userData}
                    onBack={() => setCurrentView('profile')}
                    onClose={handleClose}
                    onNavigate={(screen) => {
                        setCurrentView(screen as ViewState);
                    }}
                />
            );
        case 'changeName':
            return (
                <SettingChangeName
                    currentName={userData.name}
                    onSave={(newName) => {
                        updateUser('name', newName);
                        setCurrentView('settings');
                    }}
                    onBack={() => setCurrentView('settings')}
                    onClose={handleClose}
                />
            );
        case 'changeDoB':
            return <SettingDoB onBack={() => setCurrentView('settings')} onClose={handleClose} />;
        case 'changePhone':
            return <SettingPhoneNum onBack={() => setCurrentView('settings')} onClose={handleClose} />;
        case 'changeEmail':
            return (
                <SettingEmail
                    currentEmail={userData.email}
                    onSave={(newEmail) => {
                        updateUser('email', newEmail);
                        setCurrentView('settings');
                    }}
                    onBack={() => setCurrentView('settings')}
                    onClose={handleClose}
                />
            );
        case 'changePassword':
            return <SettingPassword onBack={() => setCurrentView('settings')} onClose={handleClose} />;
    }

    // --- MAIN PROFILE VIEW ---
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
                            <Text style={styles.userId}>ID {userData.id}</Text>
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
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.depositBtn]}
                                onPress={() => setWalletVisible(true)}
                            >
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

                    {/* Menu Group 1 */}
                    <View style={styles.menuGroup}>
                        <MenuItem
                            icon="gift-outline"
                            title="Bonuses"
                            subtitle="Free spins and other offers"
                            onPress={() => setCurrentView('bonuses')}
                        />
                        <MenuItem
                            icon="ticket-percent-outline"
                            title="Bonus codes"
                            subtitle="Code activation"
                            showBorder={false}
                            onPress={() => setCurrentView('referral')}
                        />
                    </View>

                    {/* Menu Group 2 */}
                    <View style={styles.menuGroup}>
                        <MenuItem
                            icon="clock-time-four-outline"
                            title="Bet history"
                            subtitle="Open and settled bets"
                            onPress={() => setCurrentView('betHistory')}
                        />
                        <MenuItem
                            icon="history"
                            title="Transaction history"
                            subtitle="Deposit and withdrawal statuses"
                            showBorder={false}
                            onPress={() => setCurrentView('transaction')}
                        />
                    </View>

                    {/* Menu Group 3 */}
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
                            onPress={() => setShowSupport(true)}
                        />
                    </View>

                    <SupportModal visible={showSupport} onClose={() => setShowSupport(false)} />
                </ScrollView>

                {/* Deposit Modal */}
                <Modal visible={walletVisible} animationType="slide" transparent>
                    {selectedMethod ? (
                        <DepositWallet
                            method={selectedMethod}
                            onBack={() => setSelectedMethod(null)}
                            onClose={() => setWalletVisible(false)}
                            onDeposit={(amount) => console.log('Deposited:', amount)}
                        />
                    ) : (
                        <DepositModal
                            onClose={() => setWalletVisible(false)}
                            onSelectMethod={(method) => setSelectedMethod(method)}
                        />
                    )}
                </Modal>
            </View>
        </SafeAreaView>
    );
}

// --- STYLES ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#000' },
    container: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
    scrollContent: { paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 22, fontWeight: '700', color: '#000' },
    userInfo: { alignItems: 'center', marginVertical: 15 },
    userName: { fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 5 },
    idContainer: { flexDirection: 'row', alignItems: 'center' },
    userId: { fontSize: 14, color: '#666', fontWeight: '500' },
    walletCard: { backgroundColor: '#F7F8FA', borderRadius: 16, marginHorizontal: 12, padding: 12, marginBottom: 12 },
    walletLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
    walletBalance: { fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 12 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    actionBtn: { flex: 1, height: 36, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    depositBtn: { backgroundColor: '#00C853' },
    withdrawBtn: { backgroundColor: '#E5E5E5' },
    depositText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    withdrawText: { color: '#000', fontWeight: '600', fontSize: 14 },
    menuGroup: { backgroundColor: '#F7F8FA', borderRadius: 16, marginHorizontal: 12, marginBottom: 12, paddingHorizontal: 12, paddingVertical: 6 },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    iconContainer: { marginRight: 15 },
    textContainer: { flex: 1 },
    menuTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 2 },
    menuSubtitle: { fontSize: 12, color: '#777' },
});
