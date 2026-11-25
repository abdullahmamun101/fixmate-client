"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Payment = {
  _id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  technicianEmail: string;
};

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please sign in to view your payments.");
      }

      const response = await fetch(
        `${API_URL}/api/payments/my-payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load payment history.");
      }

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadPayments = async () => {
      await fetchPayments();
    };

    loadPayments();
  }, [fetchPayments]);

  const paidPayments = payments.filter(
    (payment) => payment.status === "paid"
  );

  const totalPaid = paidPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const paidRatio =
    payments.length > 0
      ? Math.round((paidPayments.length / payments.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-28 animate-pulse rounded-[24px] border border-border bg-card" />
          <div className="grid gap-5 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-[24px] border border-border bg-card"
              />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-[24px] border border-border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header & Featured Total Paid Banner */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-center rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
              Billing & Receipts
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              My Payments
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              View your payment history and transaction details.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-brand/30 bg-brand p-6 text-brand-foreground shadow-md lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-foreground/15 blur-2xl"
            />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-foreground/80">
                  Total Paid
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  ৳{totalPaid.toLocaleString("en-BD")}
                </h2>
              </div>

              <span className="rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold">
                {paidRatio}% Settled
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
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Paid
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Banknote size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-brand">
              ৳{totalPaid.toLocaleString("en-BD")}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Transactions
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CreditCard size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {payments.length}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed Payments
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {paidPayments.length}
            </h2>
          </div>
        </div>

        {error && (
          <div className="rounded-[24px] border border-destructive/30 bg-destructive/10 p-5 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        {payments.length === 0 && !error ? (
          <div className="rounded-[26px] border border-border bg-card p-12 text-center shadow-xs">
            <h2 className="text-xl font-extrabold text-foreground">
              No Payments Yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your completed payments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4">Booking ID</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Technician</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/80">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="transition hover:bg-muted/40"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                        {payment.bookingId}
                      </td>

                      <td className="px-5 py-4 font-extrabold text-foreground">
                        ৳{Number(payment.amount).toLocaleString("en-BD")}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {payment.technicianEmail}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            payment.status === "paid"
                              ? "bg-brand/15 text-brand"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
