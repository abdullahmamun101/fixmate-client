
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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

  const cards = [
    { title: "Total Users", value: stats.users, href: "/dashboard/admin/users" },
    { title: "Total Services", value: stats.services, href: "/dashboard/admin/services" },
    { title: "Total Bookings", value: stats.bookings, href: "/dashboard/admin/bookings" },
    { title: "Transactions", value: stats.transactions, href: "/dashboard/admin/transactions" },
    { title: "Pending Services", value: stats.pendingServices, href: "/dashboard/admin/services" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            FIXMATE ADMIN PANEL
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-500">
            Manage users, services, bookings and payments.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading dashboard...</p>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h2 className="mt-3 text-3xl font-bold text-gray-900">
                    {card.value}
                  </h2>
                  <p className="mt-3 text-sm font-medium text-blue-600">
                    Manage →
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Admin Management
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link className="rounded-lg bg-gray-100 p-4 font-medium hover:bg-gray-200" href="/dashboard/admin/users">
                  Manage Users
                </Link>
                <Link className="rounded-lg bg-gray-100 p-4 font-medium hover:bg-gray-200" href="/dashboard/admin/services">
                  Manage Services
                </Link>
                <Link className="rounded-lg bg-gray-100 p-4 font-medium hover:bg-gray-200" href="/dashboard/admin/bookings">
                  Manage Bookings
                </Link>
                <Link className="rounded-lg bg-gray-100 p-4 font-medium hover:bg-gray-200" href="/dashboard/admin/transactions">
                  View Transactions
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
