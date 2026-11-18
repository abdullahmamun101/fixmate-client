
import {
  ShieldCheck,
  BadgeCheck,
  Clock,
  Headset,
  Wallet,
  Users,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "Find technicians who offer reliable and professional repair services.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Service",
    description:
      "Discover approved repair services designed to meet your needs.",
  },
  {
    icon: Clock,
    title: "Convenient Booking",
    description:
      "Request your repair service easily through a simple booking process.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description:
      "Explore service pricing before submitting your repair request.",
  },
  {
    icon: Headset,
    title: "Easy Communication",
    description:
      "Share your repair details and service requirements when booking.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "Designed to make finding and requesting repair services easier.",
  },
];

export default function WhyChooseFixMate() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Why FixMate
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Why Choose FixMate?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            We make finding and requesting repair services simple,
            convenient and reliable.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
