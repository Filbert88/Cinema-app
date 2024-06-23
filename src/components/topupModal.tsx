import React, { useState } from "react";
import Modal from "./modal";

interface TopUpModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, toggleModal }) => {
  const [amount, setAmount] = useState("");

  const handleTopUp = () => {
    console.log("Process Top Up:", amount);
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
