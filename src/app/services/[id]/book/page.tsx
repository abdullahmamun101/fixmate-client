"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const inputClass =
  "w-full rounded-2xl border border-border/80 bg-background/65 px-4 py-3 text-sm text-foreground shadow-2xs backdrop-blur-md outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/25";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<{
    title: string;
    basePrice: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/services/${serviceId}`
        );

        if (!response.ok) {
          throw new Error("Service not found");
        }

        const data = await response.json();
        setService(data);
      } catch {
        toast.error("Could not load service");
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          serviceId,
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      toast.success("Booking request submitted successfully!");
      router.push("/dashboard/customer/bookings");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8 text-sm text-muted-foreground">
        Loading service...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground">
      {/* Subtle Slatted / Ribbed Background Texture Inspired by Reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 scale-105 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_22px,color-mix(in_oklab,var(--color-foreground)_8%,transparent)_22px,color-mix(in_oklab,var(--color-foreground)_2%,transparent)_36px)] opacity-45 blur-[2px]"
      />

      {/* Soft Glow Orbs for Glassy Glow Effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-24 left-1/2 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-10 right-10 z-0 h-72 w-72 rounded-full bg-brand/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-2xl rounded-[28px] border border-border/75 bg-card/75 p-6 shadow-2xl ring-1 ring-brand/15 backdrop-blur-xl md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            Service Booking
          </span>
          <span className="rounded-full border border-brand/25 bg-brand/15 px-3 py-1 text-xs font-bold text-brand">
            Base Price: ৳{service.basePrice}
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/80">
          <div className="h-full w-2/3 rounded-full bg-brand shadow-[0_0_12px_var(--color-brand)]" />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Book This Service
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          {service.title} — share your schedule and issue details so our
          technician can assist you smoothly.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
              Phone Number
            </label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={inputClass}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
              Address
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Enter your full address"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
              Preferred Date
            </label>
            <input
              required
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.preferredDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferredDate: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
              Problem Description
            </label>
            <textarea
              required
              value={formData.problemDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  problemDescription: e.target.value,
                })
              }
              className={`${inputClass} resize-none`}
              rows={4}
              placeholder="Describe the problem..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-2xl border border-border/80 bg-background/60 px-5 py-3 text-sm font-semibold text-muted-foreground backdrop-blur-md transition hover:bg-muted/70 hover:text-foreground"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-brand px-7 py-3 text-sm font-bold text-brand-foreground shadow-[0_0_20px_color-mix(in_oklab,var(--color-brand)_40%,transparent)] transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Book This Service"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}