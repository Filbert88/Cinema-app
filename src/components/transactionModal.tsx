import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns"; // Import necessary functions

interface Transaction {
  id: number;
  type: "withdraw" | "topup";
  amount: number;
  time: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  toggleModal,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transaction");
        const data = await response.json();

        if (response.ok) {
          setTransactions(data);
        } else {
          setError(data.message || "Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg border-2 border-[#64ffda] max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="text-3xl font-bold mb-4 text-black bg-[#64ffda] p-2 text-center">
          Transaction History
        </div>
        <div className="px-5 pb-5">
          <div className="text-center">
            {loading ? (
              <div className="text-white">Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : transactions.length === 0 ? (
              <div className="text-white">No transactions found.</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="mb-2">
                  <span className="text-white">
                    {format(
                      parseISO(transaction.time),
                      "MMMM dd, yyyy 'at' h:mm a"
                    )}
                  </span>
                  {" - "}
                  <span
                    style={{
                      color: transaction.type === "topup" ? "#3fb160" : "red"
                    }}
                  >
                    {transaction.type === "topup" ? "+" : "-"}
                    {formatRupiah(transaction.amount)}
                  </span>
                </div>
              ))
            )}
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
    </div>
  );
};

export default TransactionModal;