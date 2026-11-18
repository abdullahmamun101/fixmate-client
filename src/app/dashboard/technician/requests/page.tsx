
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Booking = {
  _id: string;
  serviceTitle?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  preferredDate?: string;
  problemDescription?: string;
  status: string;
  finalAmount?: number;
  createdAt?: string;
};

export default function TechnicianRequestsPage() {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        "http://localhost:5000/api/technician/requests",
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to fetch requests"
        );
      }

      setRequests(responseData);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  const loadRequests = async () => {
    await fetchRequests();
  };

  loadRequests();
}, [fetchRequests]);

  const updateStatus = async (
    id: string,
    status: string,
    finalAmount?: number
  ) => {
    try {
      setUpdatingId(id);

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `http://localhost:5000/api/technician/requests/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ status, finalAmount }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to update booking"
        );
      }

      toast.success(responseData.message);
      await fetchRequests();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleComplete = (id: string) => {
    const amount = window.prompt("Enter final service amount:");

    if (amount === null) return;

    const finalAmount = Number(amount);

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    updateStatus(id, "completed", finalAmount);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-2 text-3xl font-bold">
        Booking Requests
      </h1>

      <p className="mb-8 text-gray-500">
        Manage your customer repair requests.
      </p>

      {requests.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            No Booking Requests
          </h2>
          <p className="text-gray-500">
            You do not have any booking requests yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  {booking.serviceTitle || "Repair Service"}
                </h2>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {booking.status}
                </span>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <strong>Customer:</strong>{" "}
                  {booking.customerName || "N/A"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {booking.customerEmail || "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {booking.customerPhone || "N/A"}
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
                    <strong>Final Amount:</strong>{" "}
                    ৳{booking.finalAmount}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {booking.status === "requested" && (
                  <>
                    <button
                      disabled={updatingId === booking._id}
                      onClick={() =>
                        updateStatus(booking._id, "accepted")
                      }
                      className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                      Accept
                    </button>

                    <button
                      disabled={updatingId === booking._id}
                      onClick={() =>
                        updateStatus(booking._id, "rejected")
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                {booking.status === "accepted" && (
                  <button
                    disabled={updatingId === booking._id}
                    onClick={() =>
                      updateStatus(booking._id, "in-progress")
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    Start Work
                  </button>
                )}

                {booking.status === "in-progress" && (
                  <button
                    disabled={updatingId === booking._id}
                    onClick={() => handleComplete(booking._id)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    Complete Job
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
