"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-5 h-20 w-20 text-green-500" />

        <h1 className="text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mt-3 text-gray-500">
          Your payment has been completed successfully.
          Thank you for using FixMate!
        </p>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-8 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          View My Bookings
        </Link>

        <Link
          href="/"
          className="mt-4 inline-block text-sm text-gray-500 hover:text-blue-600"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}