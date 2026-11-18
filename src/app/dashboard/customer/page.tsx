
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Booking = {
  _id: string;
  serviceTitle?: string;
  status: string;
  preferredDate?: string;
  finalAmount?: number;
  paymentStatus?: string;
};

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to load bookings"
        );
      }

      setBookings(responseData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      await fetchBookings();
    };

    loadBookings();
  }, [fetchBookings]);

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "requested" ||
      booking.status === "accepted" ||
      booking.status === "in-progress"
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Customer Dashboard</h1>
      <p className="mb-8 text-gray-500">
        Manage your repair bookings and services.
      </p>

      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-bold">{totalBookings}</h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Active Bookings</p>
          <h2 className="mt-2 text-3xl font-bold">{activeBookings}</h2>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Completed Bookings</p>
          <h2 className="mt-2 text-3xl font-bold">{completedBookings}</h2>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/services"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          Browse Services
        </Link>

        <Link
          href="/dashboard/customer/bookings"
          className="rounded-lg border px-5 py-3"
        >
          My Bookings
        </Link>

        <Link
          href="/dashboard/customer/payments"
          className="rounded-lg border px-5 py-3"
        >
          My Payments
        </Link>
      </div>

      <h2 className="mb-4 text-xl font-bold">Recent Bookings</h2>

      {bookings.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-gray-500">You have no bookings yet.</p>
          <Link
            href="/services"
            className="mt-4 inline-block text-blue-600 underline"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 5).map((booking) => (
            <div
              key={booking._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {booking.serviceTitle || "Repair Service"}
                </h3>
                <p className="text-sm text-gray-500">
                  {booking.preferredDate
                    ? new Date(booking.preferredDate).toLocaleDateString()
                    : "Date not available"}
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
