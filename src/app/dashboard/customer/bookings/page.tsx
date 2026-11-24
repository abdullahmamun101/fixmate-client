"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  CreditCard,
  XCircle,
  Wrench,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  const [payingId, setPayingId] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/my-bookings`,
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
        `${API_URL}/api/bookings/${id}/cancel`,
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

  const payNow = async (id: string) => {
    try {
      setPayingId(id);

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ bookingId: id }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to start payment"
        );
      }

      if (!responseData.url) {
        throw new Error("Payment URL not received");
      }

      window.location.href = responseData.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Payment failed"
      );
      setPayingId("");
    }
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

  const activeCount = bookings.filter(
    (b) =>
      b.status === "requested" ||
      b.status === "accepted" ||
      b.status === "in-progress"
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const completionRate =
    bookings.length > 0
      ? Math.round((completedCount / bookings.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header & Overview Banner */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <div>
              <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
                Booking History
              </span>
              <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                My Bookings
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                View and manage your repair service bookings.
              </p>
            </div>

            <Link
              href="/services"
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground shadow-2xs transition hover:bg-brand/90"
            >
              <Wrench size={14} />
              Book New Service
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-brand/30 bg-brand p-6 text-brand-foreground shadow-md lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-foreground/15 blur-2xl"
            />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-foreground/80">
                  Service Progress
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {completedCount} of {bookings.length} Completed
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
                  <p className="text-sm font-extrabold">{bookings.length}</p>
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

        {/* Empty State or Bookings List */}
        {bookings.length === 0 ? (
          <div className="rounded-[26px] border border-border bg-card p-12 text-center shadow-xs">
            <h2 className="text-xl font-extrabold text-foreground">
              No Bookings Found
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You have not booked any repair services yet.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-brand-foreground transition hover:bg-brand/90"
            >
              Explore Services
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
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
                        : booking.status === "cancelled" ||
                            booking.status === "rejected"
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
                      Technician:
                    </strong>{" "}
                    {booking.technicianName || "N/A"}
                  </p>

                  <p className="text-muted-foreground">
                    <strong className="font-bold text-foreground">
                      Technician Email:
                    </strong>{" "}
                    {booking.technicianEmail || "N/A"}
                  </p>

                  <p className="text-muted-foreground">
                    <strong className="font-bold text-foreground">
                      Technician Phone:
                    </strong>{" "}
                    {booking.technicianPhone || "N/A"}
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

                  {booking.finalAmount !== undefined &&
                    booking.finalAmount !== null && (
                      <p className="text-foreground">
                        <strong className="font-bold">Final Amount:</strong>{" "}
                        <span className="font-extrabold text-brand">
                          ৳{booking.finalAmount}
                        </span>
                      </p>
                    )}

                  <p className="text-muted-foreground">
                    <strong className="font-bold text-foreground">
                      Payment:
                    </strong>{" "}
                    <span className="inline-flex rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-semibold capitalize text-foreground">
                      {booking.paymentStatus || "unpaid"}
                    </span>
                  </p>
                </div>

                {(booking.status === "requested" ||
                  (booking.status === "completed" &&
                    (booking.paymentStatus || "unpaid") === "unpaid")) && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {booking.status === "requested" && (
                      <button
                        disabled={cancellingId === booking._id}
                        onClick={() => cancelBooking(booking._id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-5 py-2.5 text-xs font-bold text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                      >
                        <XCircle size={15} />
                        {cancellingId === booking._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}

                    {booking.status === "completed" &&
                      (booking.paymentStatus || "unpaid") === "unpaid" && (
                        <button
                          disabled={payingId === booking._id}
                          onClick={() => payNow(booking._id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:opacity-50"
                        >
                          <CreditCard size={15} />
                          {payingId === booking._id
                            ? "Redirecting..."
                            : "Pay Now"}
                        </button>
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

