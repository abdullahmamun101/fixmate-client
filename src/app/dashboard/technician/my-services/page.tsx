
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

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
          "http://localhost:5000/api/technician/my-services",
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
      <div className="p-6 text-center">
        Loading your services...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-2 text-3xl font-bold">
        My Services
      </h1>

      <p className="mb-8 text-gray-500">
        Manage the repair services you have submitted.
      </p>

      {services.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            No Services Found
          </h2>
          <p className="text-gray-500">
            You have not added any services yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-xl border shadow-sm"
            >
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-500">
                  No Image
                </div>
              )}

              <div className="space-y-3 p-5">
                <h2 className="text-xl font-semibold">
                  {service.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {service.category}
                </p>

                <p className="text-sm">
                  {service.description}
                </p>

                <p className="font-semibold">
                  Price: ৳{service.basePrice}
                </p>

                <p className="text-sm">
                  Mode: {service.serviceMode}
                </p>

                {service.serviceArea && (
                  <p className="text-sm">
                    Area: {service.serviceArea}
                  </p>
                )}

                {service.estimatedDuration && (
                  <p className="text-sm">
                    Duration: {service.estimatedDuration}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    Approval:
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      service.approvalStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : service.approvalStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {service.approvalStatus}
                  </span>
                </div>

                <p className="text-sm">
                  Availability:{" "}
                  {service.isAvailable ? "Available" : "Unavailable"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
