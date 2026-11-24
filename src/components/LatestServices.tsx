"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Wrench } from "lucide-react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description?: string;
  image?: string;
  basePrice: number;
  serviceArea?: string;
  estimatedDuration?: string;
  approvalStatus: string;
  isAvailable: boolean;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LatestServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`);

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();

        const serviceList = Array.isArray(data)
          ? data
          : Array.isArray(data.services)
            ? data.services
            : [];

        const approvedServices = serviceList.filter(
          (service: Service) =>
            service.approvalStatus === "approved" &&
            service.isAvailable === true
        );

        setServices(approvedServices.slice(0, 6));
      } catch (error) {
        console.error("Latest services error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <section className="bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-brand shadow-2xs">
              Popular Services
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Latest Repair Services
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
              Discover trusted repair services available through FixMate.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex w-fit items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-2xs transition hover:border-brand/40 hover:text-brand"
          >
            View All Services
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[28px] border border-border bg-card p-6 shadow-xs"
              >
                <div className="h-5 w-24 rounded-full bg-muted" />
                <div className="mt-4 grid grid-cols-12 items-center gap-4">
                  <div className="col-span-7 space-y-2.5">
                    <div className="h-6 w-4/5 rounded bg-muted" />
                    <div className="h-6 w-3/5 rounded bg-muted" />
                    <div className="mt-4 h-4 w-full rounded bg-muted/70" />
                  </div>
                  <div className="col-span-5 h-32 rounded-2xl bg-muted" />
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                  <div className="h-9 w-28 rounded-full bg-muted" />
                  <div className="h-6 w-24 rounded bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Cards Grid */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const stepNumber = String(index + 1).padStart(2, "0");

              return (
                <Link
                  key={service._id}
                  href={`/services/${service._id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                >
                  {/* Reference-inspired Floating Orbs & Soft Glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/10 blur-2xl transition duration-500 group-hover:bg-brand/20"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-36 top-16 h-3 w-3 rounded-full border border-border bg-background shadow-2xs transition duration-500 group-hover:-translate-y-0.5"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-24 top-28 h-2 w-2 rounded-full bg-brand/50"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-24 right-4 h-2.5 w-2.5 rounded-full bg-foreground/20"
                  />

                  <div>
                    {/* Top Pill Badge */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-2xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        {service.category}
                      </span>

                      <span className="text-xs font-semibold text-muted-foreground">
                        ৳{service.basePrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Main Split Area: Left Title + Index Pointer, Right Visual */}
                    <div className="relative z-10 mt-5 grid grid-cols-12 items-center gap-4">
                      <div className="col-span-7">
                        <h3 className="line-clamp-2 text-xl font-extrabold leading-snug tracking-tight text-foreground transition group-hover:text-brand sm:text-2xl">
                          {service.title}
                        </h3>

                        {/* Number + Horizontal Rule (Reference Motif) */}
                        <div className="mt-4 flex items-center gap-2.5">
                          <span className="text-sm font-extrabold tracking-tight text-muted-foreground/70">
                            {stepNumber}
                          </span>
                          <span className="h-px flex-1 bg-border transition group-hover:bg-brand/50" />
                        </div>

                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {service.description || "Professional repair service."}
                        </p>
                      </div>

                      {/* Right Visual Stage with Curved Baseline Graphics */}
                      <div className="relative col-span-5 flex h-32 items-center justify-center rounded-2xl border border-border/70 bg-background/80 p-2">
                        <svg
                          aria-hidden
                          viewBox="0 0 120 120"
                          className="pointer-events-none absolute inset-0 h-full w-full text-foreground/[0.08]"
                        >
                          <circle
                            cx="60"
                            cy="60"
                            r="44"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeDasharray="3 4"
                          />
                          <path
                            d="M14 104 Q 60 88 106 104"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>

                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="relative z-10 h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-brand shadow-2xs transition duration-300 group-hover:scale-105">
                            <Wrench size={28} strokeWidth={1.9} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Pill + Meta Info */}
                  <div className="relative z-10 mt-6 border-t border-border/80 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-xs font-bold text-primary-foreground shadow-2xs transition group-hover:opacity-95">
                        Starting ৳{service.basePrice.toLocaleString()}
                      </span>

                      {service.estimatedDuration && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={13} className="shrink-0 text-brand" />
                          <span className="truncate">
                            {service.estimatedDuration}
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin size={13} className="shrink-0 text-brand" />
                        <span className="truncate">
                          {service.serviceArea || "Location not specified"}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <div className="rounded-[28px] border border-border bg-card px-6 py-16 text-center">
            <Wrench className="mx-auto text-brand" size={40} />
            <h3 className="mt-4 text-lg font-bold text-foreground">
              No Services Available
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Approved services will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

