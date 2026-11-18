
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/services`,
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/services/${id}/status`
        ,
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
    return <div className="p-8">Loading services...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Services
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Review and manage technician service submissions.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Services</p>
            <h2 className="mt-2 text-2xl font-bold">{services.length}</h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Approval</p>
            <h2 className="mt-2 text-2xl font-bold text-orange-500">
              {services.filter((s) => s.approvalStatus === "pending").length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Approved</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {services.filter((s) => s.approvalStatus === "approved").length}
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-750px text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Category</th>
                <th className="p-4">Technician</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border-t">
                  <td className="p-4 font-medium text-gray-900">
                    {service.title}
                  </td>
                  <td className="p-4">{service.category}</td>
                  <td className="p-4">{service.technicianEmail}</td>
                  <td className="p-4">৳{service.basePrice}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
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
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          disabled={updatingId === service._id}
                          onClick={() =>
                            updateStatus(service._id, "rejected")
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {services.length === 0 && (
            <p className="p-8 text-center text-gray-500">
              No services found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
