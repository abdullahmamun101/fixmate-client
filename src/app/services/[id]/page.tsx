
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  serviceMode: string;
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
        const response = await fetch(
          `http://localhost:5000/api/services/${id}`
        );

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
    return <p className="p-10 text-white">Loading service details...</p>;
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-zinc-950 p-10 text-white">
        <h1 className="text-2xl font-bold">Service Not Found</h1>
        <p className="mt-3 text-zinc-400">{error}</p>
        <Link href="/services" className="mt-5 inline-block text-blue-400">
          Back to Services
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900 p-8">
        <p className="text-blue-400">{service.category}</p>

        <h1 className="mt-4 text-3xl font-bold">{service.title}</h1>

        <p className="mt-6 leading-7 text-zinc-300">
          {service.description}
        </p>

        <div className="mt-8 space-y-3 border-t border-zinc-700 pt-6">
          <p>
            <span className="text-zinc-400">Starting Price:</span>{" "}
            ৳{service.basePrice}
          </p>

          <p>
            <span className="text-zinc-400">Service Mode:</span>{" "}
            {service.serviceMode}
          </p>
        </div>

        <button
          disabled
          className="mt-8 cursor-not-allowed rounded-lg bg-blue-600 px-6 py-3 font-semibold opacity-60"
        >
          Booking — Coming Next
        </button>

        <div>
          <Link href="/services" className="mt-6 inline-block text-blue-400">
            ← Back to Services
          </Link>
        </div>
      </div>
    </main>
  );
}
