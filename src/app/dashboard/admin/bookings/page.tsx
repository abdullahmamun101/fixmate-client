
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface Booking {
  _id: string;
  serviceTitle?: string;
  customerEmail: string;
  technicianEmail: string;
  bookingDate?: string;
  status: string;
  paymentStatus?: string;
  finalAmount?: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const token = await authClient.token();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token.data?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch {
      toast.error("Could not load bookings");
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

  if (loading) {
    return <div className="p-8">Loading bookings...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Bookings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View and monitor all customer bookings.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <h2 className="mt-2 text-2xl font-bold">{bookings.length}</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">In Progress</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-600">
              {bookings.filter((b) => b.status === "in-progress").length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "completed").length}
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-850px text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Technician</th>
                <th className="p-4">Booking Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Booking Status</th>
                <th className="p-4">Payment</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="p-4 font-medium text-gray-900">
                    {booking.serviceTitle || "Service"}
                  </td>
                  <td className="p-4">{booking.customerEmail}</td>
                  <td className="p-4">{booking.technicianEmail}</td>
                  <td className="p-4">
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-4">
                    {booking.finalAmount
                      ? `৳${booking.finalAmount}`
                      : "—"}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                      {booking.paymentStatus || "unpaid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              No bookings found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
