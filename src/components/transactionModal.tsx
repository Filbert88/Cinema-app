import React from "react";
import { format, parseISO } from "date-fns";  // Import necessary functions

interface Transaction {
  id: number;
  type: "withdraw" | "topup";
  amount: number;
  timestamp: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  toggleModal,
}) => {
  if (!isOpen) return null;

  const transactions: Transaction[] = [
    { id: 1, type: "withdraw", amount: 5000, timestamp: "2023-06-24T10:00:00Z" },
    { id: 2, type: "topup", amount: 20000, timestamp: "2023-06-23T15:00:00Z" },
    { id: 3, type: "topup", amount: 15000, timestamp: "2023-06-23T12:30:00Z" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-black p-5 rounded-lg border-2 border-[#64ffda] max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="text-3xl font-bold mb-4 text-white">
          Transaction History
        </div>
        <div className="text-center">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="mb-2">
              <span className="text-white">{format(parseISO(transaction.timestamp), 'MMMM dd, yyyy \'at\' h:mm a')}</span>
              {' - '}
              <span className={`text-${transaction.type === "topup" ? "customGreen" : "red"}`}>
                {transaction.type === "topup" ? "+" : "-"}Rp {transaction.amount}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-center">
          <button
            onClick={toggleModal}
            className="mt-4 px-4 py-2 text-[#64ffda] border-2 border-[#64ffda] rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
