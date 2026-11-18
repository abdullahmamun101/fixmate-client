
import {
  Search,
  ClipboardList,
  Wrench,
  CreditCard,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Find Your Service",
    description:
      "Browse repair services and choose the right technician for your device or appliance.",
    icon: Search,
  },
  {
    number: "02",
    title: "Request a Booking",
    description:
      "Submit your repair request with your address, phone number and problem details.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Get It Repaired",
    description:
      "Your technician accepts the request and works on getting your device fixed.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Pay Securely",
    description:
      "Once the repair is completed, pay securely online through Stripe Checkout.",
    icon: CreditCard,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Simple Process
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            How FixMate Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Getting your device repaired has never been easier.
            Follow four simple steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-blue-100">
                      {step.number}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Icon size={26} />
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>

                {index !== steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-5 top-1/2 z-10 -translate-y-1/2 text-blue-300">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
