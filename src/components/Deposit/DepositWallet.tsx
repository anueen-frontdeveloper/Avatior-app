import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useTotalBet } from "../../context/BalanceContext";

// Simple theme setup
const theme = {
  colors: {
    bg: "#F9FAFB",
    card: "#FFFFFF",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    accent: "#2563EB",
    accentDisabled: "#A5C1F4",
    surfaceAlt: "#EEF2FF",
    error: "#DC2626",
  },
  radius: 12,
  spacing: (n: number) => n * 8,
};

type DepositWalletProps = {
  method: {
    name?: string;
    currencySymbol?: string;
    minAmount?: number;
    maxAmount?: number;
  };
  onBack: () => void;
  onClose: () => void;
  onDeposit: (amount: number) => void;
};

const DepositWallet: React.FC<DepositWalletProps> = ({
  method,
  onBack,
  onClose,
  onDeposit,
}) => {
  const { balance, setBalance } = useTotalBet();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const symbol = method?.currencySymbol ?? "₹";

  // 💰 Hard rule: 1 to 25000
  const min = 300;
  const max = 25000;

  const validate = (val: number) => {
    if (isNaN(val)) return "Please enter a valid number";
    if (val < min) return `Minimum deposit is ${symbol}${min}`;
    if (val > max) return `Maximum allowed is ${symbol}${max}`;
    return "";
  };

  const handleDeposit = () => {
    const numeric = parseFloat(amount);
    const msg = validate(numeric);
    if (msg) {
      setError(msg);
      return;
    }

    setError("");
    setBalance((balance ?? 0) + numeric);
    onDeposit(numeric);
    setAmount("");
  };

  const isValid = amount && !validate(parseFloat(amount));

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
          Deposit to Wallet
        </Text>

        <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>
          Add funds using {method?.name || "your preferred method"} securely.
        </Text>

        {/* Current balance box */}
        <View
          style={[
            styles.balanceBox,
            { backgroundColor: theme.colors.surfaceAlt },
          ]}
        >
          <Text
            style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}
          >
            Current Balance
          </Text>
          <Text style={[styles.balanceValue, { color: theme.colors.textPrimary }]}>
            {symbol}
            {balance?.toLocaleString() ?? "—"}
          </Text>
        </View>

        {/* Amount input */}
        <View style={styles.inputBox}>
          <Text
            style={[
              styles.inputLabel,
              { color: theme.colors.textPrimary, marginBottom: 4 },
            ]}
          >
            Enter Amount ({symbol})
          </Text>

          {/* Helper text */}
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 12,
              marginBottom: 6,
            }}
          >
            Allowed range: ₹{min.toLocaleString()} – ₹{max.toLocaleString()}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor:
                  error !== "" ? theme.colors.error : theme.colors.border,
                color: theme.colors.textPrimary,
                backgroundColor: "#FFFFFF",
              },
            ]}
            placeholder={`${symbol} 0.00`}
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={(val) => {
              setAmount(val);
              if (error) setError("");
            }}
          />

          {error ? (
            <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>
              {error}
            </Text>
          ) : null}
        </View>

        {/* Deposit button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isValid
                ? theme.colors.accent
                : theme.colors.accentDisabled,
            },
          ]}
          disabled={!isValid}
          onPress={handleDeposit}
        >
          <Text style={styles.buttonText}>
            Deposit {amount ? `${symbol}${amount}` : ""}
          </Text>
        </TouchableOpacity>

        {/* Footer navigation */}
        <View style={styles.footer}>
          <Pressable onPress={onBack}>
            <Text style={[styles.linkText, { color: theme.colors.accent }]}>
              ← Back
            </Text>
          </Pressable>
          <Pressable onPress={onClose}>
            <Text style={[styles.linkText, { color: theme.colors.accent }]}>
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DepositWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: theme.radius,
    padding: theme.spacing(3),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: theme.spacing(1),
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: theme.spacing(3),
  },
  balanceBox: {
    padding: theme.spacing(2),
    borderRadius: theme.radius,
    marginBottom: theme.spacing(3),
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 13,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  inputBox: {
    marginBottom: theme.spacing(4),
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(3),
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
