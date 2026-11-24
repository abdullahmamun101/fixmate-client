"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Wrench,
  MapPin,
  ArrowDownRight,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  basePrice: number;
  serviceArea?: string;
  serviceMode?: string;
  approvalStatus: string;
  isAvailable: boolean;
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

        if (!response.ok) {
          throw new Error("Failed to load services");
        }

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
    ...Array.from(
      new Set(services.map((service) => service.category))
    ),
  ];

  const filteredServices = services
    .filter(
      (service) =>
        service.approvalStatus === "approved" &&
        service.isAvailable === true
    )
    .filter((service) => {
      const searchTerm = search.toLowerCase();

      const matchesCategory =
        category === "All" || service.category === category;

      const matchesSearch =
        service.title?.toLowerCase().includes(searchTerm) ||
        service.category?.toLowerCase().includes(searchTerm) ||
        service.description?.toLowerCase().includes(searchTerm) ||
        service.serviceArea?.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "low") return a.basePrice - b.basePrice;
      if (sort === "high") return b.basePrice - a.basePrice;
      return 0;
    });

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Reference-inspired Header Banner with Glow-Revealed Tiny Grid */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background px-6 py-16 sm:py-20">
        {/* Soft Ambient Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/2 -z-20 h-80 w-80 -translate-y-1/2 rounded-full bg-brand/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-2 -z-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        />

        {/* Ultra-Subtle Tiny Grid Visible Primarily Around Glow Regions */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 text-foreground opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            WebkitMaskImage:
              "radial-gradient(circle 230px at 14% 52%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0) 100%), radial-gradient(circle 220px at 84% 28%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0) 100%)",
            maskImage:
              "radial-gradient(circle 230px at 14% 52%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0) 100%), radial-gradient(circle 220px at 84% 28%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskComposite: "source-over",
          }}
        />

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end">
          {/* Left Display Title + Outlined Sub-Display */}
          <div className="select-none">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Explore Our
              </h1>

              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl"
              >
                <ArrowDownRight size={28} strokeWidth={2.6} />
              </span>
            </div>

            <p
              aria-hidden="true"
              className="mt-1 text-4xl font-black uppercase leading-none tracking-wider text-transparent sm:text-6xl lg:text-7xl"
              style={{
                WebkitTextStroke: "1.5px currentColor",
              }}
            >
              <span className="text-brand/75">Services</span>
            </p>
          </div>

          {/* Right Description & Service Badge */}
          <div className="max-w-md lg:text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand shadow-2xs">
              <Wrench size={14} />
              Verified Technicians
            </div>

            <p className="mt-3.5 text-sm leading-7 text-muted-foreground sm:text-base">
              Find reliable technicians for your home appliances. Browse
              services and book the right professional.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Cards Section */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Search, Category & Sort Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-muted-foreground" />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition focus:border-brand sm:w-auto"
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
              className="rounded-xl border border-border bg-card px-4 py-3 text-foreground outline-none transition focus:border-brand"
            >
              <option value="default">Sort: Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Meta */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Available Services
          </h2>

          {!loading && (
            <p className="text-sm text-muted-foreground">
              {filteredServices.length} services found
            </p>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-[28px] border border-border bg-card p-6 shadow-xs"
              >
                <div className="h-5 w-24 rounded-full bg-muted" />
                <div className="mt-4 grid grid-cols-12 items-center gap-4">
                  <div className="col-span-7 space-y-2.5">
                    <div className="h-6 w-4/5 rounded bg-muted" />
                    <div className="h-6 w-3/5 rounded bg-muted" />
                    <div className="mt-4 h-4 w-full rounded bg-muted/70" />
                  </div>
                  <div className="col-span-5 h-32 rounded-2xl bg-muted" />
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                  <div className="h-8 w-24 rounded bg-muted" />
                  <div className="h-10 w-28 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Grid */}
        {!loading && filteredServices.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service, index) => {
              const stepNumber = String(index + 1).padStart(2, "0");

              return (
                <div
                  key={service._id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                >
                  {/* Reference-inspired Floating Orbs & Soft Glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/10 blur-2xl transition duration-500 group-hover:bg-brand/20"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-36 top-16 h-3 w-3 rounded-full border border-border bg-background shadow-2xs transition duration-500 group-hover:-translate-y-0.5"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-24 top-28 h-2 w-2 rounded-full bg-brand/50"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-24 right-4 h-2.5 w-2.5 rounded-full bg-foreground/20"
                  />

                  <div>
                    {/* Top Pill Badge & Mode/Price */}
                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-2xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        {service.category}
                      </span>

                      {service.serviceMode && (
                        <span className="text-xs font-medium text-muted-foreground">
                          {service.serviceMode}
                        </span>
                      )}
                    </div>

                    {/* Split Content: Left Title + Index Pointer, Right Visual */}
                    <div className="relative z-10 mt-5 grid grid-cols-12 items-center gap-4">
                      <div className="col-span-7">
                        <h3 className="line-clamp-2 text-xl font-extrabold leading-snug tracking-tight text-foreground transition group-hover:text-brand sm:text-2xl">
                          {service.title}
                        </h3>

                        {/* Number + Horizontal Rule (Reference Motif) */}
                        <div className="mt-4 flex items-center gap-2.5">
                          <span className="text-sm font-extrabold tracking-tight text-muted-foreground/70">
                            {stepNumber}
                          </span>
                          <span className="h-px flex-1 bg-border transition group-hover:bg-brand/50" />
                        </div>

                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {service.description}
                        </p>
                      </div>

                      {/* Right Visual Stage with Curved Baseline Graphics */}
                      <div className="relative col-span-5 flex h-32 items-center justify-center rounded-2xl border border-border/70 bg-background/80 p-2">
                        <svg
                          aria-hidden
                          viewBox="0 0 120 120"
                          className="pointer-events-none absolute inset-0 h-full w-full text-foreground/[0.08]"
                        >
                          <circle
                            cx="60"
                            cy="60"
                            r="44"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeDasharray="3 4"
                          />
                          <path
                            d="M14 104 Q 60 88 106 104"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>

                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="relative z-10 h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card text-brand shadow-2xs transition duration-300 group-hover:scale-105">
                            <Wrench size={28} strokeWidth={1.9} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="relative z-10 mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin size={15} className="shrink-0 text-brand" />
                      <span className="truncate">
                        {service.serviceArea || "Location not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Price & Action Button (No Arrow) */}
                  <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-border/80 pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Starting from
                      </p>
                      <p className="text-lg font-extrabold text-brand">
                        ৳{service.basePrice.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-brand-foreground shadow-2xs transition hover:bg-brand/90"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div className="mt-10 rounded-[28px] border border-border bg-card px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
              <Search size={28} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-foreground">
              No services found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or category filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSort("default");
              }}
              className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground transition hover:bg-brand/90"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

