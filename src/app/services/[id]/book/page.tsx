
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Service = {
  _id: string;
  title: string;
  category: string;
  basePrice: number;
  serviceMode: string;
};

export default function BookServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().slice(0, 16);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/services/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Service not found");
        }

        const data = await response.json();
        setService(data);
      } catch {
        toast.error("Could not load service information");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in first");
      router.push("/sign-in");
      return;
    }

    setSubmitting(true);

    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse.data?.token;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: params.id,
          phone,
          address,
          preferredDate,
          problemDescription,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking request failed");
      }

      toast.success("Booking request submitted successfully!");
      router.push("/dashboard/customer/bookings");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Service not found.
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          FixMate Booking
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Request a Repair Service
        </h1>

        <p className="mt-2 text-gray-500">
          Fill in the information below to request this service.
        </p>
      </div>

      <div className="mb-8 rounded-xl border p-5">
        <h2 className="text-xl font-semibold">{service.title}</h2>

        <p className="mt-1 text-sm text-gray-500">
          {service.category} · {service.serviceMode}
        </p>

        <p className="mt-3 text-lg font-bold">
          Starting from ৳{service.basePrice}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block font-medium">
            Phone Number
          </label>

          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Full Address
          </label>

          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Preferred Date & Time
          </label>

          <input
            type="datetime-local"
            required
            min={minDate}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Describe Your Problem
          </label>

          <textarea
            required
            rows={5}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Explain the device problem..."
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Booking Request"}
        </button>
      </form>
    </main>
  );
}
