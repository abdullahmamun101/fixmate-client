"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";
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
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-24 animate-pulse rounded-[24px] border border-border bg-card" />
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

  const inProgressCount = bookings.filter(
    (b) => b.status === "in-progress"
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const completionRate =
    bookings.length > 0
      ? Math.round((completedCount / bookings.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Featured Summary Banner */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-center rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
              Booking Operations
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Manage Bookings
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              View and monitor all customer bookings.
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
                  Fulfillment Progress
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {completedCount} of {bookings.length} Completed
                </h2>
              </div>
              <span className="rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold">
                {completionRate}% Done
              </span>
            </div>

            <div className="relative z-10 mt-4 h-2.5 w-full overflow-hidden rounded-full bg-brand-foreground/20">
              <div
                className="h-full rounded-full bg-brand-foreground transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Bookings
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CalendarDays size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {bookings.length}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                In Progress
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Clock size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-brand">
              {inProgressCount}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {completedCount}
            </h2>
          </div>
        </div>

        {/* Bookings Table Card */}
        <div className="overflow-hidden rounded-[26px] border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
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

              <tbody className="divide-y divide-border/80">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-muted/40"
                  >
                    <td className="p-4 font-bold text-foreground">
                      {booking.serviceTitle || "Service"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {booking.customerEmail}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {booking.technicianEmail}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {booking.finalAmount
                        ? `৳${booking.finalAmount}`
                        : "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          booking.status === "completed"
                            ? "bg-brand/15 text-brand"
                            : booking.status === "in-progress"
                              ? "bg-brand text-brand-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold capitalize text-foreground">
                        {booking.paymentStatus || "unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No bookings found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}