import React, { useState } from "react";
import Modal from "./modal";

interface TopUpModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, toggleModal , setBalance}) => {
  const [amount, setAmount] = useState("");

  const handleTopUp = async () => {
    const numAmount = parseInt(amount);
    if (numAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await fetch('/api/topup', {
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
        alert(data.message || "Top-up failed");
      }
    } catch (error) {
      console.error('Top-up error:', error);
      alert("Top-up failed");
    }
    
    toggleModal();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Topup Money"
      description="Topup money to your account with no limitations"
      onClose={toggleModal}
      onConfirm={handleTopUp}
      confirmText="Confirm"
      inputValue={amount}
      onInputChange={setAmount}
    />
  );
};

export default TopUpModal;
