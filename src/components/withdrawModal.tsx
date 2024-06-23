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

  const handleWithdraw = async () => {
    const numAmount = parseInt(amount);
    if (numAmount <= 0 || numAmount > maxWithdraw) {
      showExceedToast();
      return;
    }
    if (numAmount > balance) {
      alert("Insufficient balance");
      return;
    }

    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: numAmount }),
      });

      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
      } else {
        alert(data.message || "Withdraw failed");
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      alert("Withdraw failed");
    }

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
