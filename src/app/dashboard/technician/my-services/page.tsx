"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Wrench, CheckCircle2, Clock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  serviceMode: string;
  serviceArea?: string;
  estimatedDuration?: string;
  image?: string;
  approvalStatus: string;
  isAvailable: boolean;
};

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data: tokenData, error } = await authClient.token();

        if (error || !tokenData?.token) {
          throw new Error("Please login first");
        }

        const response = await fetch(
            `${API_URL}/api/technician/my-services`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || "Failed to fetch services"
          );
        }

        setServices(responseData);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-28 animate-pulse rounded-[24px] border border-border bg-card" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-[24px] border border-border bg-card"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const approvedCount = services.filter(
    (s) => s.approvalStatus === "approved"
  ).length;
  const pendingCount = services.filter(
    (s) => s.approvalStatus === "pending"
  ).length;
  const approvedRate =
    services.length > 0
      ? Math.round((approvedCount / services.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header & Overview Banner */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <div>
              <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
                Service Catalog
              </span>
              <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                My Services
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Manage the repair services you have submitted.
              </p>
            </div>

            <Link
              href="/dashboard/technician/add-service"
              className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground shadow-2xs transition hover:bg-brand/90"
            >
              <PlusCircle size={15} />
              Add New Service
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
                  Listing Performance
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  {approvedCount} of {services.length} Approved
                </h2>
              </div>

              <span className="rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold">
                {approvedRate}% Live
              </span>
            </div>

            <div className="relative z-10 mt-4 h-2.5 w-full overflow-hidden rounded-full bg-brand-foreground/20">
              <div
                className="h-full rounded-full bg-brand-foreground transition-all duration-500"
                style={{ width: `${approvedRate}%` }}
              />
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-brand-foreground/20 bg-brand-foreground/10 p-3 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <Wrench size={15} />
                <div>
                  <p className="text-[11px] text-brand-foreground/75">Total</p>
                  <p className="text-sm font-extrabold">{services.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <div>
                  <p className="text-[11px] text-brand-foreground/75">
                    Approved
                  </p>
                  <p className="text-sm font-extrabold">{approvedCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} />
                <div>
                  <p className="text-[11px] text-brand-foreground/75">Pending</p>
                  <p className="text-sm font-extrabold">{pendingCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State or Services Grid */}
        {services.length === 0 ? (
          <div className="rounded-[26px] border border-border bg-card p-12 text-center shadow-xs">
            <h2 className="text-xl font-extrabold text-foreground">
              No Services Found
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You have not added any services yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-border bg-card text-card-foreground shadow-xs transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
              >
                <div>
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
                      No Image
                    </div>
                  )}

                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                        {service.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          service.approvalStatus === "approved"
                            ? "bg-brand/15 text-brand"
                            : service.approvalStatus === "rejected"
                              ? "bg-destructive/15 text-destructive"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {service.approvalStatus}
                      </span>
                    </div>

                    <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                      {service.title}
                    </h2>

                    <p className="text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="space-y-1.5 rounded-2xl border border-border/70 bg-background/70 p-3.5 text-sm">
                      <p className="font-extrabold text-foreground">
                        Price: ৳{service.basePrice}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Mode:{" "}
                        <span className="font-semibold capitalize text-foreground">
                          {service.serviceMode}
                        </span>
                      </p>

                      {service.serviceArea && (
                        <p className="text-xs text-muted-foreground">
                          Area:{" "}
                          <span className="font-semibold text-foreground">
                            {service.serviceArea}
                          </span>
                        </p>
                      )}

                      {service.estimatedDuration && (
                        <p className="text-xs text-muted-foreground">
                          Duration:{" "}
                          <span className="font-semibold text-foreground">
                            {service.estimatedDuration}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/70 px-5 py-3.5 text-xs">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 font-bold text-foreground">
                    {service.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
