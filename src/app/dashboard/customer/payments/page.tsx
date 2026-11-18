
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/payments/my-payments`,
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

  const totalPaid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + payment.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p className="text-gray-600">Loading payment history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Payments
          </h1>
          <p className="mt-2 text-gray-600">
            View your payment history and transaction details.
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Paid</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            ৳{totalPaid.toLocaleString("en-BD")}
          </h2>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {payments.length === 0 && !error ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No Payments Yet
            </h2>
            <p className="mt-2 text-gray-500">
              Your completed payments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-4">Booking ID</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Technician</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-t">
                    <td className="px-5 py-4 text-sm text-gray-700">
                      {payment.bookingId}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ৳{Number(payment.amount).toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {payment.technicianEmail}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
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
        )}
      </div>
    </div>
  );
}
