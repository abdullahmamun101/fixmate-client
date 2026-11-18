
"use client";

import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AddServicePage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    basePrice: "",
    serviceMode: "onsite",
    serviceArea: "",
    estimatedDuration: "",
    image: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get authentication token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const token = tokenData.token;

      // Send service data to server
      const response = await fetch(
        "http://localhost:5000/api/technician/services",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            basePrice: Number(formData.basePrice),
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to add service"
        );
      }

      toast.success("Service submitted for admin approval!");

      setFormData({
        title: "",
        category: "",
        description: "",
        basePrice: "",
        serviceMode: "onsite",
        serviceArea: "",
        estimatedDuration: "",
        image: "",
      });
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

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-3xl font-bold">
        Add New Service
      </h1>

      <p className="mb-8 text-gray-500">
        Submit your repair service for admin approval.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block font-medium">
            Service Title
          </label>
          <input
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full rounded-lg border p-3"
            placeholder="e.g. AC Repair Service"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Category
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select Category</option>
            <option value="AC Repair">AC Repair</option>
            <option value="Refrigerator Repair">
              Refrigerator Repair
            </option>
            <option value="Washing Machine Repair">
              Washing Machine Repair
            </option>
            <option value="TV Repair">TV Repair</option>
            <option value="Electrical Repair">
              Electrical Repair
            </option>
            <option value="Plumbing">Plumbing</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
            rows={4}
            placeholder="Describe your service..."
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Base Price (৳)
          </label>
          <input
            required
            type="number"
            min="1"
            value={formData.basePrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                basePrice: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
            placeholder="Enter price"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Service Mode
          </label>
          <select
            required
            value={formData.serviceMode}
            onChange={(e) =>
              setFormData({
                ...formData,
                serviceMode: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Service Area
          </label>
          <input
            required
            value={formData.serviceArea}
            onChange={(e) =>
              setFormData({
                ...formData,
                serviceArea: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
            placeholder="e.g. Dhaka"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Estimated Duration
          </label>
          <input
            required
            value={formData.estimatedDuration}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedDuration: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
            placeholder="e.g. 2 hours"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) =>
              setFormData({
                ...formData,
                image: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
            placeholder="Enter image URL"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Service"}
        </button>
      </form>
    </div>
  );
}

