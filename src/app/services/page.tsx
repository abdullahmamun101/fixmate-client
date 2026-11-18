"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Wrench, MapPin } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  imageUrl?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  area?: string;
  location?: string;
  availability?: string;
  status?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services`);
        const data = await response.json();

        const serviceList = Array.isArray(data)
          ? data
          : data.services || [];

        setServices(serviceList);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(services.map((service) => service.category))),
  ];

  const filteredServices = services
    .filter(
      (service) =>
        service.status === "approved" &&
        service.availability !== "unavailable"
    )
    .filter((service) => {
      const matchesCategory =
        category === "All" || service.category === category;

      const matchesSearch =
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.category.toLowerCase().includes(search.toLowerCase()) ||
        service.description?.toLowerCase().includes(search.toLowerCase()) ||
        service.area?.toLowerCase().includes(search.toLowerCase()) ||
        service.location?.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.minPrice ?? a.price ?? 0;
      const priceB = b.minPrice ?? b.price ?? 0;

      if (sort === "low") return priceA - priceB;
      if (sort === "high") return priceB - priceA;

      return 0;
    });

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-50 px-6 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Wrench size={28} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Our Services
          </h1>

          <p className="mt-4 text-gray-600">
            Find reliable technicians for your home appliances.
            Browse services and book the right professional.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gray-500" />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none sm:w-auto"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Services
          </h2>

          {!loading && (
            <p className="text-sm text-gray-500">
              {filteredServices.length} services found
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-200"
              >
                <div className="h-52 bg-gray-200" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-10 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Cards */}
        {!loading && filteredServices.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  {(service.image || service.imageUrl) ? (
                    <img
                      src={service.image || service.imageUrl}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <Wrench size={48} />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-600 shadow-sm">
                    {service.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    {service.area || service.location || "Location not specified"}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-lg font-bold text-blue-600">
                        ৳
                        {(
                          service.minPrice ??
                          service.price ??
                          service.maxPrice ??
                          0
                        ).toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Search size={28} />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              No services found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or category filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSort("default");
              }}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
