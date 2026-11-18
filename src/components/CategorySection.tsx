
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Refrigerator,
  AirVent,
  Tv,
  WashingMachine,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Mobile & Tablet",
    description: "Screen, battery and software repairs",
    icon: Smartphone,
  },
  {
    name: "Laptop & Computer",
    description: "Hardware and performance solutions",
    icon: Laptop,
  },
  {
    name: "AC Repair",
    description: "Installation and cooling services",
    icon: AirVent,
  },
  {
    name: "Refrigerator",
    description: "Cooling and appliance maintenance",
    icon: Refrigerator,
  },
  {
    name: "TV & Display",
    description: "Screen and display repair services",
    icon: Tv,
  },
  {
    name: "Washing Machine",
    description: "Professional appliance repair",
    icon: WashingMachine,
  },
];

export default function CategorySection() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Our Services
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Explore Services by Category
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            From everyday electronics to essential home appliances,
            find the right repair service for your needs.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href="/services"
                className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900 transition group-hover:text-blue-600 sm:text-lg">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>
                </div>

                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            View All Services
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
