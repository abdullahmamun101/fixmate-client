"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Banknote, CheckCircle2 } from "lucide-react";
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

  const paidTransactions = transactions.filter(
    (transaction) => transaction.status === "paid"
  );

  const totalRevenue = paidTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  );

  const paidRatio =
    transactions.length > 0
      ? Math.round((paidTransactions.length / transactions.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-28 animate-pulse rounded-[24px] border border-border bg-card" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-[24px] border border-border bg-card"
              />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-[24px] border border-border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Featured Revenue Overview Banner */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-center rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
              Financial Ledger
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Manage Transactions
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Monitor payments and platform transactions.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-brand/30 bg-brand p-6 text-brand-foreground shadow-md lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-foreground/15 blur-2xl"
            />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-foreground/80">
                  Total Paid Revenue
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  ৳{totalRevenue.toLocaleString()}
                </h2>
              </div>
              <span className="rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold">
                {paidRatio}% Paid
              </span>
            </div>

            <div className="relative z-10 mt-4 h-2.5 w-full overflow-hidden rounded-full bg-brand-foreground/20">
              <div
                className="h-full rounded-full bg-brand-foreground transition-all duration-500"
                style={{ width: `${paidRatio}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Transactions
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <FileText size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {transactions.length}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Paid Revenue
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Banknote size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-brand">
              ৳{totalRevenue.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Settled Payments
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {paidTransactions.length}
            </h2>
          </div>
        </div>

        {/* Transactions Table Card */}
        <div className="overflow-hidden rounded-[26px] border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
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

              <tbody className="divide-y divide-border/80">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="transition hover:bg-muted/40"
                  >
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {transaction.bookingId}
                    </td>
                    <td className="p-4 text-foreground">
                      {transaction.customerEmail}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {transaction.technicianEmail}
                    </td>
                    <td className="p-4 font-extrabold text-foreground">
                      ৳{Number(transaction.amount || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-xs font-semibold uppercase text-muted-foreground">
                      {transaction.currency || "BDT"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          transaction.status === "paid"
                            ? "bg-brand/15 text-brand"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {transactions.length === 0 && (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No transactions found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
