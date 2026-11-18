import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Target,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "We connect customers with technicians whose services are reviewed and approved.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Our platform is designed to make finding and booking repair services simple.",
  },
  {
    icon: Target,
    title: "Reliable Solutions",
    description:
      "We help customers find suitable repair solutions for their everyday needs.",
  },
  {
    icon: HeartHandshake,
    title: "Simple Experience",
    description:
      "From booking to payment, we aim to provide a smooth service experience.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            About FixMate
          </span>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Making Home Repairs
            <span className="block text-blue-600">
              Simple and Reliable
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            FixMate is a service booking platform that connects customers
            with skilled technicians for home appliance and electronic
            repair services. We make it easier to discover services,
            request bookings and manage repairs.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              One Platform for Your Repair Needs
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600">
              Finding a reliable repair technician should not be
              complicated. FixMate brings customers and service
              professionals together through one convenient platform.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Customers can browse approved services, submit repair
              requests and track their bookings. Technicians can manage
              their services and handle customer requests, while
              administrators oversee platform activities.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Target size={28} />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              Our Mission
            </h3>

            <p className="mt-4 leading-8 text-slate-600">
              To make repair services more accessible by creating a
              transparent and convenient connection between customers
              and skilled service professionals.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              What Matters to Us
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Our Core Values
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              The principles behind the FixMate service experience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}