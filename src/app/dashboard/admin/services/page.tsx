"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Wrench, Clock, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface Service {
  _id: string;
  title: string;
  category: string;
  technicianEmail: string;
  basePrice: number;
  approvalStatus: string;
  isAvailable: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const token = await authClient.token();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL}/api/admin/services`}`,
        {
          headers: {
            Authorization: `Bearer ${token.data?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load services");
      }

      const data = await response.json();
      setServices(Array.isArray(data) ? data : data.services || []);
    } catch {
      toast.error("Could not load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadServices = async () => {
      await fetchServices();
    };

    loadServices();
  }, [fetchServices]);

  const updateStatus = async (
    id: string,
    approvalStatus: "approved" | "rejected"
  ) => {
    setUpdatingId(id);

    try {
      const token = await authClient.token();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL}/api/admin/services/${id}/status`}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.data?.token}`,
          },
          body: JSON.stringify({ approvalStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      toast.success(`Service ${approvalStatus} successfully`);
      await fetchServices();
    } catch {
      toast.error("Could not update service status");
    } finally {
      setUpdatingId(null);
    }
  };

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

  const pendingCount = services.filter(
    (s) => s.approvalStatus === "pending"
  ).length;
  const approvedCount = services.filter(
    (s) => s.approvalStatus === "approved"
  ).length;
  const approvalRate =
    services.length > 0
      ? Math.round((approvedCount / services.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Featured Review Banner */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-center rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
              Service Moderation
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Manage Services
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Review and manage technician service submissions.
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
                  Approval Rate
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {approvedCount} of {services.length} Approved
                </h2>
              </div>
              <span className="rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold">
                {pendingCount} Pending
              </span>
            </div>

            <div className="relative z-10 mt-4 h-2.5 w-full overflow-hidden rounded-full bg-brand-foreground/20">
              <div
                className="h-full rounded-full bg-brand-foreground transition-all duration-500"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Services
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Wrench size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {services.length}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Approval
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Clock size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-brand">
              {pendingCount}
            </h2>
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-brand/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Approved
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <CheckCircle2 size={18} />
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-foreground">
              {approvedCount}
            </h2>
          </div>
        </div>

        {/* Services Table Card */}
        <div className="overflow-hidden rounded-[26px] border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4">Service</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/80">
                {services.map((service) => (
                  <tr
                    key={service._id}
                    className="transition hover:bg-muted/40"
                  >
                    <td className="p-4 font-bold text-foreground">
                      {service.title}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                        {service.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {service.technicianEmail}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      ৳{service.basePrice}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          service.approvalStatus === "approved"
                            ? "bg-brand/15 text-brand"
                            : service.approvalStatus === "pending"
                              ? "bg-brand text-brand-foreground"
                              : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {service.approvalStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      {service.approvalStatus === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            disabled={updatingId === service._id}
                            onClick={() =>
                              updateStatus(service._id, "approved")
                            }
                            className="rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold text-brand-foreground shadow-2xs transition hover:bg-brand/90 disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            disabled={updatingId === service._id}
                            onClick={() =>
                              updateStatus(service._id, "rejected")
                            }
                            className="rounded-full border border-destructive/40 bg-destructive/10 px-3.5 py-1.5 text-xs font-bold text-destructive transition hover:bg-destructive/20 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No action
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {services.length === 0 && (
            <p className="p-10 text-center text-sm text-muted-foreground">
              No services found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
