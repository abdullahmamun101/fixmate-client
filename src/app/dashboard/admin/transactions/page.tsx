
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface Transaction {
  _id: string;
  bookingId: string;
  customerEmail: string;
  technicianEmail: string;
  amount: number;
  currency?: string;
  status: string;
  createdAt?: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const token = await authClient.token();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token.data?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load transactions");
      }

      const data = await response.json();
      setTransactions(
        Array.isArray(data) ? data : data.transactions || []
      );
    } catch {
      toast.error("Could not load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadTransactions = async () => {
      await fetchTransactions();
    };

    loadTransactions();
  }, [fetchTransactions]);

  const totalRevenue = transactions
    .filter((transaction) => transaction.status === "paid")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  if (loading) {
    return <div className="p-8">Loading transactions...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Transactions
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Monitor payments and platform transactions.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <h2 className="mt-2 text-2xl font-bold">
              {transactions.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Paid Revenue</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              ৳{totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-800px text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Technician</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Currency</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t">
                  <td className="p-4 font-mono text-xs">
                    {transaction.bookingId}
                  </td>
                  <td className="p-4">{transaction.customerEmail}</td>
                  <td className="p-4">{transaction.technicianEmail}</td>
                  <td className="p-4 font-medium">
                    ৳{Number(transaction.amount || 0).toLocaleString()}
                  </td>
                  <td className="p-4 uppercase">
                    {transaction.currency || "BDT"}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {transaction.createdAt
                      ? new Date(transaction.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              No transactions found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
