import React, { useState } from "react";
import Modal from "./modal";
import Toast from "./toast";
import { ToastState } from "./balance";
import DimmedLoad from "./dimmedLoad";

interface WithdrawModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  showExceedToast: () => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setToast: React.Dispatch<React.SetStateAction<ToastState>>;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  toggleModal,
  showExceedToast,
  balance,
  setBalance,
  setToast,
}) => {
  const [amount, setAmount] = useState("");
  const maxWithdraw = 500000;
  const [modalToast, setModalToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "error",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleWithdraw = async () => {
    const numAmount = parseInt(amount);
    if (numAmount <= 0 || numAmount > maxWithdraw) {
      showExceedToast();
      return;
    }
    if (numAmount > balance) {
      setModalToast({
        isOpen: true,
        message: "Insufficient balance",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/withdraw", {
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
        setToast({
          isOpen: true,
          message: "Withdrawal success",
          type: "success",
        });
        toggleModal();
      } else {
        setModalToast({
          isOpen: true,
          message: data.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      setModalToast({
        isOpen: true,
        message: "withdraw failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <DimmedLoad />;
  }

  return (
    <div>
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
      <Toast
        isOpen={modalToast.isOpen}
        message={modalToast.message}
        type={modalToast.type}
        closeToast={() => setToast({ ...modalToast, isOpen: false })}
      />
    </div>
  );
};

export default WithdrawModal;
