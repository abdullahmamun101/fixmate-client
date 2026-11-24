"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Wrench, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type User = {
  _id: string;
  name?: string;
  email: string;
  role: "customer" | "technician" | "admin";
};

const API = "http://localhost:5000";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(`${API}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, [fetchUsers]);

  const updateRole = async (id: string, role: User["role"]) => {
    try {
      setUpdatingId(id);

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(`${API}/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user role");
      }

      toast.success(data.message || "User role updated");
      await fetchUsers();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-28 animate-pulse rounded-[24px] border border-border bg-card" />
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

  const customerCount = users.filter((u) => u.role === "customer").length;
  const technicianCount = users.filter((u) => u.role === "technician").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Featured Role Overview */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-center rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
              User Directory
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Manage Users
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              View users and manage their platform roles.
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
                  Account Breakdown
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {users.length} Active Accounts
                </h2>
              </div>
              <span className="rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold">
                Role Access Control
              </span>
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-brand-foreground/20 bg-brand-foreground/10 p-3.5 backdrop-blur-xs">
              <div>
                <p className="text-[11px] text-brand-foreground/75">Customers</p>
                <p className="mt-0.5 text-lg font-extrabold">{customerCount}</p>
              </div>
              <div>
                <p className="text-[11px] text-brand-foreground/75">Technicians</p>
                <p className="mt-0.5 text-lg font-extrabold">{technicianCount}</p>
              </div>
              <div>
                <p className="text-[11px] text-brand-foreground/75">Admins</p>
                <p className="mt-0.5 text-lg font-extrabold">{adminCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customers
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Users size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {customerCount}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Technicians
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Wrench size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-brand">
              {technicianCount}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admins
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <ShieldCheck size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {adminCount}
            </h2>
          </div>
        </div>

        {/* Users Table or Empty State */}
        {users.length === 0 ? (
          <div className="rounded-[26px] border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-xs">
            No users found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Current Role</th>
                    <th className="px-5 py-4">Change Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/80">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-muted/40"
                    >
                      <td className="px-5 py-4 font-bold text-foreground">
                        {user.name || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {user.email}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-bold capitalize text-brand">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={user.role}
                          disabled={updatingId === user._id}
                          onChange={(event) =>
                            updateRole(
                              user._id,
                              event.target.value as User["role"]
                            )
                          }
                          className="rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-semibold text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25 disabled:opacity-50"
                        >
                          <option value="customer">Customer</option>
                          <option value="technician">Technician</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
