import React, { useState } from "react";
import Modal from "./modal";
import Toast from "./toast";
import { ToastState } from "./balance";
import DimmedLoad from "./dimmedLoad";

interface TopUpModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setToast: React.Dispatch<React.SetStateAction<ToastState>>;
}

const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  toggleModal,
  setBalance,
  setToast,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalToast, setModalToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "error",
  });

  const handleTopUp = async () => {
    const numAmount = parseInt(amount);
    if (numAmount <= 0) {
      setModalToast({
        isOpen: true,
        message: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: numAmount }),
      });

      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
        setAmount("");
        setToast({ isOpen: true, message: "Top-up success", type: "success" });
        toggleModal();
      } else {
        setModalToast({ isOpen: true, message: data.message, type: "error" });
      }
    } catch (error) {
      console.error("Top-up error:", error);
      setModalToast({ isOpen: true, message: "Top-up failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DimmedLoad />;
  }

  if (!isOpen) return null;

  return (
    <div>
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
      <Toast
        isOpen={modalToast.isOpen}
        message={modalToast.message}
        type={modalToast.type}
        closeToast={() => setModalToast({ ...modalToast, isOpen: false })}
      />
    </div>
  );
};

export default TopUpModal;
