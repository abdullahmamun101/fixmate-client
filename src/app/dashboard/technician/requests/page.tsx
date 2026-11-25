"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
        `${API_URL}/api/technician/requests`,
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
        `${API_URL}/api/technician/requests/${id}/status`,
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
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-28 animate-pulse rounded-[24px] border border-border bg-card" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-[24px] border border-border bg-card"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeCount = requests.filter(
    (r) => r.status === "requested" || r.status === "accepted" || r.status === "in-progress"
  ).length;
  const completedCount = requests.filter(
    (r) => r.status === "completed"
  ).length;
  const completionRate =
    requests.length > 0
      ? Math.round((completedCount / requests.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header & Overview Banner */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-center rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
              Customer Jobs
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Booking Requests
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage your customer repair requests.
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
                  Job Queue Summary
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {completedCount} of {requests.length} Completed
                </h2>
              </div>
              <span className="rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold">
                {completionRate}% Completed
              </span>
            </div>

            <div className="relative z-10 mt-4 h-2.5 w-full overflow-hidden rounded-full bg-brand-foreground/20">
              <div
                className="h-full rounded-full bg-brand-foreground transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-brand-foreground/20 bg-brand-foreground/10 p-3 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <ClipboardList size={15} />
                <div>
                  <p className="text-[11px] text-brand-foreground/75">Total</p>
                  <p className="text-sm font-extrabold">{requests.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} />
                <div>
                  <p className="text-[11px] text-brand-foreground/75">Active</p>
                  <p className="text-sm font-extrabold">{activeCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <div>
                  <p className="text-[11px] text-brand-foreground/75">
                    Completed
                  </p>
                  <p className="text-sm font-extrabold">{completedCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State or Requests List */}
        {requests.length === 0 ? (
          <div className="rounded-[26px] border border-border bg-card p-12 text-center shadow-xs">
            <h2 className="text-xl font-extrabold text-foreground">
              No Booking Requests
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You do not have any booking requests yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((booking) => (
              <div
                key={booking._id}
                className="rounded-[24px] border border-border bg-card p-6 text-card-foreground shadow-xs transition hover:border-brand/40 hover:shadow-md"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                  <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                    {booking.serviceTitle || "Repair Service"}
                  </h2>

                  <span
                    className={`rounded-full px-3.5 py-1 text-xs font-bold capitalize ${
                      booking.status === "completed"
                        ? "bg-brand/15 text-brand"
                        : booking.status === "rejected"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-brand text-brand-foreground"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm sm:grid-cols-2">
                  <p className="text-muted-foreground">
                    <strong className="font-bold text-foreground">
                      Customer:
                    </strong>{" "}
                    {booking.customerName || "N/A"}
                  </p>

                  <p className="text-muted-foreground">
                    <strong className="font-bold text-foreground">
                      Email:
                    </strong>{" "}
                    {booking.customerEmail || "N/A"}
                  </p>

                  <p className="text-muted-foreground">
                    <strong className="font-bold text-foreground">
                      Phone:
                    </strong>{" "}
                    {booking.customerPhone || "N/A"}
                  </p>

                  <p className="text-muted-foreground">
                    <strong className="font-bold text-foreground">
                      Preferred Date:
                    </strong>{" "}
                    {booking.preferredDate
                      ? new Date(booking.preferredDate).toLocaleString()
                      : "N/A"}
                  </p>

                  <p className="text-muted-foreground sm:col-span-2">
                    <strong className="font-bold text-foreground">
                      Address:
                    </strong>{" "}
                    {booking.address || "N/A"}
                  </p>

                  <p className="text-muted-foreground sm:col-span-2">
                    <strong className="font-bold text-foreground">
                      Problem:
                    </strong>{" "}
                    {booking.problemDescription || "N/A"}
                  </p>

                  {booking.finalAmount !== undefined && (
                    <p className="text-foreground">
                      <strong className="font-bold">Final Amount:</strong>{" "}
                      <span className="font-extrabold text-brand">
                        ৳{booking.finalAmount}
                      </span>
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
                        className="rounded-full bg-brand px-5 py-2 text-xs font-bold text-brand-foreground shadow-2xs transition hover:bg-brand/90 disabled:opacity-50"
                      >
                        Accept
                      </button>

                      <button
                        disabled={updatingId === booking._id}
                        onClick={() =>
                          updateStatus(booking._id, "rejected")
                        }
                        className="rounded-full border border-destructive/40 bg-destructive/10 px-5 py-2 text-xs font-bold text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
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
                      className="rounded-full bg-brand px-5 py-2 text-xs font-bold text-brand-foreground shadow-2xs transition hover:bg-brand/90 disabled:opacity-50"
                    >
                      Start Work
                    </button>
                  )}

                  {booking.status === "in-progress" && (
                    <button
                      disabled={updatingId === booking._id}
                      onClick={() => handleComplete(booking._id)}
                      className="rounded-full bg-brand px-5 py-2 text-xs font-bold text-brand-foreground shadow-2xs transition hover:bg-brand/90 disabled:opacity-50"
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
    </div>
  );
}
