import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Transaction } from "../api/transactions";

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider: React.FC<{ token: string }> = ({
  token,
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = useCallback(async (callback: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await callback();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const reload = useCallback(async () => {
    if (!token) return;
    await handleRequest(async () => {
      const res = await fetch("http://localhost:3000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data: Transaction[] = await res.json();
      setTransactions(data);
    });
  }, [token, handleRequest]);

  const updateTransaction = useCallback(
    async (id: string, data: Partial<Transaction>) => {
      if (!token) return;
      await handleRequest(async () => {
        const res = await fetch(
          `http://localhost:3000/api/transactions/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }
        );
        if (!res.ok) throw new Error("Failed to update transaction");
        const updated: Transaction = await res.json();
        setTransactions((prev) =>
          prev.map((t) => (t._id === id ? updated : t))
        );
      });
    },
    [token, handleRequest]
  );

  const removeTransaction = useCallback(
    async (id: string) => {
      if (!token) return;
      await handleRequest(async () => {
        const res = await fetch(
          `http://localhost:3000/api/transactions/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to delete transaction");
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      });
    },
    [token, handleRequest]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        reload,
        updateTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (!context)
    throw new Error(
      "useTransactionsContext must be used within TransactionsProvider"
    );
  return context;
};
