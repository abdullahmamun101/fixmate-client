
"use client";

import { useEffect, useState } from "react";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: number;
  serviceMode: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);

        const response = await fetch(
          `http://localhost:5000/api/services?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Failed to fetch services");

        const data = await response.json();
        setServices(data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchServices();

    return () => controller.abort();
  }, [search, category, sort]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Explore Repair Services</h1>
        <p className="mt-3 text-zinc-400">
          Find trusted professionals for your repair needs.
        </p>

        <div className="my-10 grid gap-4 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3"
          >
            <option value="">All Categories</option>
            <option value="Mobile Repair">Mobile Repair</option>
            <option value="Laptop Repair">Laptop Repair</option>
            <option value="AC Repair">AC Repair</option>
            <option value="Refrigerator Repair">Refrigerator Repair</option>
            <option value="Washing Machine Repair">Washing Machine Repair</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-3"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <p className="text-zinc-400">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-zinc-400">No services found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <p className="text-sm text-blue-400">{service.category}</p>
                <h2 className="mt-3 text-xl font-bold">{service.title}</h2>
                <p className="mt-3 text-sm text-zinc-400">
                  {service.description}
                </p>
                <p className="mt-5 font-semibold">
                  Starting at ৳{service.basePrice}
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  {service.serviceMode}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
