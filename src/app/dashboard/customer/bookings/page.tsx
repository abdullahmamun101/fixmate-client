
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Booking = {
  _id: string;
  serviceTitle?: string;
  technicianName?: string;
  technicianEmail?: string;
  technicianPhone?: string;
  status: string;
  preferredDate?: string;
  address?: string;
  problemDescription?: string;
  finalAmount?: number;
  paymentStatus?: string;
};

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");

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

  const cancelBooking = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(id);

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to cancel booking"
        );
      }

      toast.success(responseData.message || "Booking cancelled");
      await fetchBookings();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setCancellingId("");
    }
  };

  if (loading) {
    return <div className="p-6">Loading bookings...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-2 text-3xl font-bold">My Bookings</h1>
      <p className="mb-8 text-gray-500">
        View and manage your repair service bookings.
      </p>

      {bookings.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            No Bookings Found
          </h2>
          <p className="text-gray-500">
            You have not booked any repair services yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  {booking.serviceTitle || "Repair Service"}
                </h2>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                  {booking.status}
                </span>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <strong>Technician:</strong>{" "}
                  {booking.technicianName || "N/A"}
                </p>

                <p>
                  <strong>Technician Email:</strong>{" "}
                  {booking.technicianEmail || "N/A"}
                </p>

                <p>
                  <strong>Technician Phone:</strong>{" "}
                  {booking.technicianPhone || "N/A"}
                </p>

                <p>
                  <strong>Preferred Date:</strong>{" "}
                  {booking.preferredDate
                    ? new Date(booking.preferredDate).toLocaleString()
                    : "N/A"}
                </p>

                <p className="sm:col-span-2">
                  <strong>Address:</strong>{" "}
                  {booking.address || "N/A"}
                </p>

                <p className="sm:col-span-2">
                  <strong>Problem:</strong>{" "}
                  {booking.problemDescription || "N/A"}
                </p>

                {booking.finalAmount !== undefined && (
                  <p>
                    <strong>Final Amount:</strong> ৳{booking.finalAmount}
                  </p>
                )}

                <p>
                  <strong>Payment:</strong>{" "}
                  {booking.paymentStatus || "unpaid"}
                </p>
              </div>

              {booking.status === "requested" && (
                <button
                  disabled={cancellingId === booking._id}
                  onClick={() => cancelBooking(booking._id)}
                  className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  {cancellingId === booking._id
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
