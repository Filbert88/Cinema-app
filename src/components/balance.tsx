"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import TransactionModal from "@/src/components/transactionModal";
import WithdrawModal from "@/src/components/withdrawModal";
import TopUpModal from "@/src/components/topupModal";
import Toast from "@/src/components/toast";

type ToastType = "info" | "error" | "success";

export interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
}

interface BalanceProps {
  initialBalance: number;
  userId: string;
  name?: string | null;
}

const Balance: React.FC<BalanceProps> = ({ initialBalance, userId, name }) => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [balance, setBalance] = useState<number>(initialBalance);
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "info",
  });

  const toggleTransactionModal = () =>
    setIsTransactionModalOpen(!isTransactionModalOpen);
  const toggleWithdrawModal = () =>
    setIsWithdrawModalOpen(!isWithdrawModalOpen);
  const toggleTopUpModal = () => setIsTopUpModalOpen(!isTopUpModalOpen);
  const closeToast = () => setToast({ ...toast, isOpen: false });

  const showExceedToast = () =>
    setToast({
      isOpen: true,
      message: "Please fill the amount correctly, cannot exceed Rp 500,000",
      type: "error",
    });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="relative bottom-20 flex flex-col min-h-screen items-center justify-center pb-5 px-5 sm:px-10 bg-black">
      <div>
        <div className="text-center text-4xl sm:text-5xl font-bold">
          Hello
          <span className="capitalize text-[#64ffda]"> {name} </span>
        </div>
        <div className=" text-2xl sm:text-3xl text-center">Current Balance: {formatRupiah(balance)}</div>
        <div className="space-x-6 justify-center flex flex-row mt-8">
          <button
            onClick={toggleWithdrawModal}
            className="border rounded-lg border-[#64ffda] text-[#64ffda] py-3 px-5"
          >
            Withdraw
          </button>
          <button
            onClick={toggleTopUpModal}
            className="bg-[#64ffda] text-black rounded-lg py-3 px-5"
          >
            Top Up
          </button>
          <button onClick={toggleTransactionModal}>
            <Image
              src="/transaction-history.svg"
              alt="transaction-history"
              width={35}
              height={35}
            />
          </button>
        </div>
        <TransactionModal
          isOpen={isTransactionModalOpen}
          toggleModal={toggleTransactionModal}
        />
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          toggleModal={toggleWithdrawModal}
          showExceedToast={showExceedToast}
          balance={balance}
          setBalance={setBalance}
        />
        <TopUpModal
          isOpen={isTopUpModalOpen}
          toggleModal={toggleTopUpModal}
          setBalance={setBalance}
        />
        <Toast
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          closeToast={closeToast}
        />
      </div>
    </div>
  );
};

export default Balance;
