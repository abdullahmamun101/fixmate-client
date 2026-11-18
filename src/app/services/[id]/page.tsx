
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
      <main className="min-h-screen bg-white p-10 text-center text-gray-600">
        Loading service details...
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-white px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Service Not Found
        </h1>
        <p className="mt-3 text-gray-500">{error}</p>
        <Link
          href="/services"
          className="mt-6 inline-block text-blue-600"
        >
          Back to Services
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {service.image && (
            <img
              src={service.image}
              alt={service.title}
              className="h-72 w-full object-cover"
            />
          )}

          <div className="p-6 sm:p-10">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              {service.category}
            </span>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              {service.title}
            </h1>

            <p className="mt-5 leading-7 text-gray-600">
              {service.description}
            </p>

            <div className="mt-8 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Wrench className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Service Mode</p>
                  <p className="font-medium text-gray-900">
                    {service.serviceMode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Service Area</p>
                  <p className="font-medium text-gray-900">
                    {service.serviceArea || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Duration</p>
                  <p className="font-medium text-gray-900">
                    {service.estimatedDuration || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Starting Price</p>
                <p className="text-3xl font-bold text-blue-600">
                  ৳{service.basePrice.toLocaleString()}
                </p>
              </div>

              <Link
                href={`/services/${service._id}/book`}
                className="rounded-xl bg-blue-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Book This Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
