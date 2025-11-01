import React, { useState } from "react";
import { Modal } from "react-native";
import DepositModal from "./DepositModal";
import DepositWallet from "./DepositWallet";
import SuccessModal from "./SuccessModal";

type PaymentMethod = {
  id: number;
  name: string;
  image: any;
};

type DepositScreenProps = {
  onClose?: () => void;
};

const DepositScreen: React.FC<DepositScreenProps> = ({ onClose }) => {
  const [visible, setVisible] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | null>(null);

  const closeAll = () => {
    setVisible(false);
    onClose?.();
  };

  const handleDeposit = (amount: number) => {
    // only called if valid (DepositWallet already validates)
    setDepositAmount(amount);
    setVisible(false); // close deposit modal
    setTimeout(() => setShowSuccess(true), 250); // delay a bit
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    closeAll();
  };

  return (
    <>
      {/* Deposit selection & wallet */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={closeAll}
      >
        {selectedMethod ? (
          <DepositWallet
            method={selectedMethod}
            onBack={() => setSelectedMethod(null)}
            onClose={closeAll}
            onDeposit={handleDeposit}
          />
        ) : (
          <DepositModal
            onClose={closeAll}
            onSelectMethod={(method) => setSelectedMethod(method)}
          />
        )}
      </Modal>

      <SuccessModal
        visible={showSuccess}
        amount={depositAmount || undefined}
        onClose={handleSuccessClose}
      />
    </>
  );
};

export default DepositScreen;
