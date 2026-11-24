"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Clock, Wrench, ArrowLeft } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  serviceMode: string;
  serviceArea?: string;
  estimatedDuration?: string;
  image?: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Service not found");
        }

        setService(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-10 text-sm font-medium text-muted-foreground">
        Loading service details...
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-20 text-center text-foreground">
        <div className="w-full max-w-md rounded-[28px] border border-border/70 bg-card/75 p-8 shadow-lg backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-foreground">
            Service Not Found
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90"
          >
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 sm:py-12">
      {/* Subtle Ambient Glows for Glass Card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        <Link
          href="/services"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-md transition hover:border-brand/40 hover:text-foreground"
        >
          <ArrowLeft size={15} />
          Back to Services
        </Link>

        {/* Glass Card Matching Reference Structure */}
        <article className="overflow-hidden rounded-[28px] border border-border/70 bg-card/75 text-card-foreground shadow-xl backdrop-blur-xl">
          {/* Top Image */}
          <div className="p-3 pb-0">
            {service.image ? (
              <img
                src={service.image}
                alt={service.title}
                className="h-64 w-full rounded-[22px] object-cover sm:h-72"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center rounded-[22px] bg-muted/60 text-sm font-medium text-muted-foreground sm:h-72">
                No Image Available
              </div>
            )}
          </div>

          {/* Main Body */}
          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {service.title}
                </h1>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>

              {/* Right Badge (Reference Hexagon / Pill Slot) */}
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-brand/30 bg-brand/15 px-2 text-center backdrop-blur-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                  {service.serviceMode}
                </span>
              </div>
            </div>

            {/* Meta Rows (Location & Duration like Reference) */}
            <div className="mt-5 space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-foreground/90">
                <MapPin size={16} className="shrink-0 text-brand" />
                <span className="truncate">
                  {service.serviceArea || "Not specified"}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-foreground/90">
                <Clock size={16} className="shrink-0 text-brand" />
                <span>{service.estimatedDuration || "Not specified"}</span>
              </div>
            </div>

            {/* Dashed Divider */}
            <div className="my-6 border-t border-dashed border-border/80" />

            {/* Price & Primary CTA Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  ৳{service.basePrice.toLocaleString()}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  starting price
                </p>
              </div>

              <Link
                href={`/services/${service._id}/book`}
                className="inline-flex items-center justify-center rounded-2xl bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90"
              >
                Book This Service
              </Link>
            </div>
          </div>

          {/* Bottom Glass Strip (Reference Footer Strip) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-background/40 px-6 py-3.5 backdrop-blur-md sm:px-7">
            <span className="inline-flex items-center gap-2 rounded-xl border border-brand/25 bg-brand/15 px-3.5 py-1.5 text-xs font-semibold text-brand">
              <Wrench size={14} />
              {service.category}
            </span>

            <span className="text-xs font-medium text-muted-foreground">
              Verified Repair Service
            </span>
          </div>
        </article>
      </div>
    </main>
  );
}
