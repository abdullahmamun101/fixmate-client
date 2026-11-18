"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    return <div className="p-8">Loading service...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Book This Service
        </h1>

        <p className="mt-2 text-gray-500">{service.title}</p>

        <p className="mb-8 mt-2 font-semibold text-blue-600">
          Base Price: ৳{service.basePrice}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Phone Number</label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-lg border p-3"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Address</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full rounded-lg border p-3"
              rows={3}
              placeholder="Enter your full address"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
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
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
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
              className="w-full rounded-lg border p-3"
              rows={4}
              placeholder="Describe the problem..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Book This Service"}
          </button>
        </form>
      </div>
    </main>
  );
}