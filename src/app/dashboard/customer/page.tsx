"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Wrench,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

  const completionRate =
    totalBookings > 0
      ? Math.round((completedBookings / totalBookings) * 100)
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
          <div className="h-64 animate-pulse rounded-[24px] border border-border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header & Featured Overview Banner */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-center rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
              Customer Portal
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Customer Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage your repair bookings and services.
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
                  Booking Progress
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {completedBookings} of {totalBookings} Completed
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
              <div>
                <p className="text-[11px] text-brand-foreground/75">Total</p>
                <p className="mt-0.5 text-sm font-extrabold">{totalBookings}</p>
              </div>
              <div>
                <p className="text-[11px] text-brand-foreground/75">Active</p>
                <p className="mt-0.5 text-sm font-extrabold">{activeBookings}</p>
              </div>
              <div>
                <p className="text-[11px] text-brand-foreground/75">
                  Completed
                </p>
                <p className="mt-0.5 text-sm font-extrabold">
                  {completedBookings}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Bookings
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <ClipboardList size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {totalBookings}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Bookings
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Clock size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-brand">
              {activeBookings}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed Bookings
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {completedBookings}
            </h2>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-xs font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90"
          >
            <Wrench size={15} />
            Browse Services
          </Link>

          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs font-bold text-foreground shadow-2xs transition hover:border-brand/40 hover:text-brand"
          >
            <ClipboardList size={15} />
            My Bookings
          </Link>

          <Link
            href="/dashboard/customer/payments"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs font-bold text-foreground shadow-2xs transition hover:border-brand/40 hover:text-brand"
          >
            <CreditCard size={15} />
            My Payments
          </Link>
        </div>

        {/* Recent Bookings Section */}
        <div className="rounded-[26px] border border-border bg-card p-6 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">
              Recent Bookings
            </h2>
            {bookings.length > 0 && (
              <Link
                href="/dashboard/customer/bookings"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
              >
                View All
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-background/60 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                You have no bookings yet.
              </p>
              <Link
                href="/services"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground transition hover:bg-brand/90"
              >
                Explore Services
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-background/70 p-4 transition hover:border-brand/35"
                >
                  <div>
                    <h3 className="font-bold text-foreground">
                      {booking.serviceTitle || "Repair Service"}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {booking.preferredDate
                        ? new Date(booking.preferredDate).toLocaleDateString()
                        : "Date not available"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3.5 py-1 text-xs font-semibold capitalize ${
                      booking.status === "completed"
                        ? "bg-brand/15 text-brand"
                        : "bg-brand text-brand-foreground"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
