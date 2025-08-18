// frontend/src/hooks/useTransactions.ts
import { useState, useEffect } from "react";
import type { Transaction } from "../api/transactions";

export function useTransactions(token: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTransactions() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  async function update(id: string, updateData: Partial<Transaction>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Failed to update transaction");
      const updated = await res.json();
      setTransactions((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete transaction");
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return {
    transactions,
    loading,
    error,
    reload: fetchTransactions,
    update,
    remove,
  };
}
