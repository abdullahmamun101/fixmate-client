"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Wrench,
  CalendarDays,
  FileText,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type DashboardStats = {
  users: number;
  services: number;
  bookings: number;
  transactions: number;
  pendingServices: number;
};

const API = "http://localhost:5000";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    services: 0,
    bookings: 0,
    transactions: 0,
    pendingServices: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setError("");

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const headers = {
        Authorization: `Bearer ${tokenData.token}`,
      };

      const endpoints = [
        "/api/admin/users",
        "/api/admin/services",
        "/api/admin/bookings",
        "/api/admin/transactions",
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(`${API}${endpoint}`, { headers })
        )
      );

      const results = await Promise.all(
        responses.map(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to load dashboard");
          }

          return data;
        })
      );

      const [users, services, bookings, transactions] = results;

      setStats({
        users: Array.isArray(users) ? users.length : 0,
        services: Array.isArray(services) ? services.length : 0,
        bookings: Array.isArray(bookings) ? bookings.length : 0,
        transactions: Array.isArray(transactions)
          ? transactions.length
          : 0,
        pendingServices: Array.isArray(services)
          ? services.filter(
              (service) => service.approvalStatus === "pending"
            ).length
          : 0,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchStats();
    };

    loadDashboard();
  }, [fetchStats]);

  const totalPlatformRecords =
    stats.users + stats.services + stats.bookings + stats.transactions;

  const approvedRatio =
    stats.services > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((stats.services - stats.pendingServices) / stats.services) * 100
            )
          )
        )
      : 100;

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      href: "/dashboard/admin/users",
      icon: Users,
      meta: "Registered accounts",
    },
    {
      title: "Total Services",
      value: stats.services,
      href: "/dashboard/admin/services",
      icon: Wrench,
      meta: `${approvedRatio}% approved`,
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      href: "/dashboard/admin/bookings",
      icon: CalendarDays,
      meta: "Service requests",
    },
    {
      title: "Transactions",
      value: stats.transactions,
      href: "/dashboard/admin/transactions",
      icon: FileText,
      meta: "Payment records",
    },
    {
      title: "Pending Services",
      value: stats.pendingServices,
      href: "/dashboard/admin/services",
      icon: Clock,
      meta: "Awaiting review",
    },
  ];

  const quickActions = [
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
      count: stats.users,
    },
    {
      label: "Manage Services",
      href: "/dashboard/admin/services",
      icon: Wrench,
      count: stats.services,
    },
    {
      label: "Manage Bookings",
      href: "/dashboard/admin/bookings",
      icon: CalendarDays,
      count: stats.bookings,
    },
    {
      label: "View Transactions",
      href: "/dashboard/admin/transactions",
      icon: FileText,
      count: stats.transactions,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand shadow-2xs">
              FIXMATE ADMIN PANEL
            </span>
            <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage users, services, bookings and payments.
            </p>
          </div>

          <Link
            href="/dashboard/admin/services"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground shadow-xs transition hover:bg-brand/90"
          >
            <span>Review Services</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-44 animate-pulse rounded-[24px] border border-border bg-card p-6"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-destructive/30 bg-destructive/10 p-6 text-sm font-medium text-destructive">
            {error}
          </div>
        ) : (
          <>
            {/* Reference-inspired Bento Top Row: Highlighted Overview + Side Summary */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Featured Brand Overview Card */}
              <div className="relative overflow-hidden rounded-[26px] border border-brand/30 bg-brand p-6 text-brand-foreground shadow-md sm:p-7 lg:col-span-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-foreground/15 blur-2xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-foreground/10 blur-2xl"
                />

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-foreground/80">
                      Platform Overview
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                      System Activity Summary
                    </h2>
                  </div>

                  <span className="rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold backdrop-blur-xs">
                    {totalPlatformRecords} Total Records
                  </span>
                </div>

                <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-brand-foreground/20 bg-brand-foreground/10 p-4 backdrop-blur-xs sm:grid-cols-4">
                  <div>
                    <p className="text-[11px] text-brand-foreground/75">Users</p>
                    <p className="mt-1 text-xl font-extrabold">{stats.users}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-brand-foreground/75">Services</p>
                    <p className="mt-1 text-xl font-extrabold">{stats.services}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-brand-foreground/75">Bookings</p>
                    <p className="mt-1 text-xl font-extrabold">{stats.bookings}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-brand-foreground/75">
                      Transactions
                    </p>
                    <p className="mt-1 text-xl font-extrabold">
                      {stats.transactions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Summary Card: Approval Health & Queue */}
              <div className="flex flex-col justify-between rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Approval Queue
                    </span>
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
                      {approvedRatio}% Ready
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-extrabold text-foreground">
                    {stats.pendingServices} Pending
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Services waiting for admin approval before going live.
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${approvedRatio}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard/admin/services"
                  className="mt-5 inline-flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-xs font-bold text-foreground transition hover:border-brand/40 hover:text-brand"
                >
                  <span>Go to Service Queue</span>
                  <ArrowUpRight size={15} className="text-brand" />
                </Link>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group flex flex-col justify-between rounded-[24px] border border-border bg-card p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {card.title}
                        </p>
                        <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight text-foreground">
                          {card.value}
                        </h2>
                      </div>

                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted text-brand transition group-hover:bg-brand group-hover:text-brand-foreground">
                        <Icon size={20} />
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3.5 text-xs">
                      <span className="text-muted-foreground">{card.meta}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-brand">
                        Manage
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Admin Management Quick Links Panel */}
            <div className="rounded-[26px] border border-border bg-card p-6 shadow-xs">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                  Admin Management
                </h2>
                <span className="text-xs text-muted-foreground">
                  Quick navigation
                </span>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition hover:border-brand/40 hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                          <Icon size={17} />
                        </span>
                        <span className="text-sm font-bold text-foreground group-hover:text-brand">
                          {item.label}
                        </span>
                      </div>

                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                        {item.count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
