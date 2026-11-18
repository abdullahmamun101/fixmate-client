
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Wrench } from "lucide-react";

type Service = {
  _id: string;
  title: string;
  category: string;
  description?: string;
  image?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  serviceArea?: string;
  estimatedDuration?: string;
  rating?: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LatestServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`);

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();

        const serviceList = Array.isArray(data)
          ? data
          : Array.isArray(data.services)
            ? data.services
            : [];

        const approvedServices = serviceList.filter(
          (service: Service & { status?: string; availability?: string }) =>
            service.status === "approved" &&
            service.availability !== "unavailable",
        );

        setServices(approvedServices.slice(0, 6));
      } catch (error) {
        console.error("Latest services error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Popular Services
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Latest Repair Services
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Discover trusted repair services available through FixMate.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-52 bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-5 w-3/4 rounded bg-slate-100" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service._id}
                href={`/services/${service._id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
                  ) : (
                    <div className="flex h-full items-center justify-center text-blue-300">
                      <Wrench size={48} />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600 shadow-sm">
                    {service.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition group-hover:text-blue-600">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                    {service.description || "Professional repair service."}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    {service.serviceArea && (
                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="shrink-0 text-blue-600" />
                        <span className="truncate">{service.serviceArea}</span>
                      </p>
                    )}

                    {service.estimatedDuration && (
                      <p className="flex items-center gap-2">
                        <Clock size={16} className="shrink-0 text-blue-600" />
                        {service.estimatedDuration}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Starting from</p>
                      <p className="mt-1 text-lg font-extrabold text-blue-600">
                        ৳
                        {service.minPrice ??
                          service.price ??
                          service.maxPrice ??
                          "—"}
                      </p>
                    </div>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <Wrench className="mx-auto text-blue-500" size={40} />
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No Services Available
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Approved services will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
