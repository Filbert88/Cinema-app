import React, { useState } from "react";
import Modal from "./modal";

interface WithdrawModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  showExceedToast: () => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  toggleModal,
  showExceedToast,
  balance,
  setBalance,
}) => {
  const [amount, setAmount] = useState("");
  const maxWithdraw = 500000;

  const handleWithdraw = () => {
    const numAmount = parseInt(amount);
    if (numAmount > maxWithdraw) {
      showExceedToast();
      return;
    }
    if (numAmount > balance) {
      alert("Insufficient balance");
      return;
    }
    setBalance(balance - numAmount);
    toggleModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Withdraw Money"
      description="Withdraw money from your account with a maximum of Rp 500,000"
      onClose={toggleModal}
      onConfirm={handleWithdraw}
      confirmText="Confirm"
      inputValue={amount}
      onInputChange={setAmount}
    />
  );
};

export default WithdrawModal;
