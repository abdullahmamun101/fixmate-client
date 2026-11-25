"use client";

import { useState, type FormEvent } from "react";
import { PlusCircle, ImagePlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/25";

export default function AddServicePage() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    basePrice: "",
    serviceMode: "onsite",
    serviceArea: "",
    estimatedDuration: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedImage) {
      toast.error("Please select a service image");
      return;
    }

    setLoading(true);

    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Please login first");
      }

      const token = tokenData.token;

      // Upload image to ImgBB
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImage);

      const uploadResponse = await fetch(
        `${API_URL}/api/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageFormData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message || "Image upload failed"
        );
      }

      // Submit service with uploaded image URL
      const response = await fetch(
        `${API_URL}/api/technician/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            basePrice: Number(formData.basePrice),
            image: uploadData.imageUrl,
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
      });

      setSelectedImage(null);

      const fileInput = document.getElementById(
        "service-image"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-[26px] border border-brand/30 bg-brand p-6 text-brand-foreground shadow-md sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-foreground/15 blur-2xl"
          />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                <PlusCircle size={13} />
                Technician Listing
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Add New Service
              </h1>
              <p className="mt-1.5 text-sm text-brand-foreground/85">
                Submit your repair service for admin approval.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[26px] border border-border bg-card p-6 shadow-xs sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                Service Title
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={fieldClass}
                placeholder="e.g. AC Repair Service"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className={fieldClass}
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
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
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
                className={fieldClass}
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
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
                className={fieldClass}
              >
                <option value="onsite">Onsite</option>
                <option value="remote">Remote</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
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
                className={fieldClass}
                placeholder="e.g. Dhaka"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
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
                className={fieldClass}
                placeholder="e.g. 2 hours"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
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
                className={fieldClass}
                rows={4}
                placeholder="Describe your service..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                <ImagePlus size={15} className="text-brand" />
                Service Image
              </label>
              <input
                id="service-image"
                required
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;

                  if (file && file.size > 5 * 1024 * 1024) {
                    toast.error("Image must be smaller than 5 MB");
                    e.target.value = "";
                    setSelectedImage(null);
                    return;
                  }

                  setSelectedImage(file);
                }}
                className={`${fieldClass} file:mr-4 file:rounded-full file:border-0 file:bg-brand/15 file:px-3.5 file:py-1.5 file:text-xs file:font-bold file:text-brand hover:file:bg-brand/25`}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Select an image. Maximum size: 5 MB.
              </p>
              {selectedImage && (
                <p className="mt-2 inline-flex rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                  Selected: {selectedImage.name}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border/80 pt-5">
            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Uploading & Submitting..." : "Submit Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


