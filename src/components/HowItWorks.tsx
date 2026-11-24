"use client";

import { motion, useReducedMotion } from "framer-motion";
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
    insetBg: "bg-[#dff7df] dark:bg-green-950/50",
    numberColor: "text-[#388e3c] dark:text-green-400",
    iconTile: "bg-[#43a047] text-white",
    pinBase: "bg-[#388e3c]",
    pinHead: "bg-[#64dd17]",
    tilt: "rotate-[1.5deg]",
  },
  {
    number: "02",
    title: "Request a Booking",
    description:
      "Submit your repair request with your address, phone number and problem details.",
    icon: ClipboardList,
    insetBg: "bg-[#fce4e4] dark:bg-rose-950/50",
    numberColor: "text-[#e5534b] dark:text-rose-400",
    iconTile: "bg-[#171717] text-white",
    pinBase: "bg-[#ad1457]",
    pinHead: "bg-[#f50057]",
    tilt: "-rotate-[0.5deg]",
  },
  {
    number: "03",
    title: "Get It Repaired",
    description:
      "Your technician accepts the request and works on getting your device fixed.",
    icon: Wrench,
    insetBg: "bg-[#e3f9df] dark:bg-emerald-950/50",
    numberColor: "text-[#16a34a] dark:text-emerald-400",
    iconTile: "bg-[#2563eb] text-white",
    pinBase: "bg-[#00796b]",
    pinHead: "bg-[#00c853]",
    tilt: "-rotate-[1.5deg]",
  },
  {
    number: "04",
    title: "Pay Securely",
    description:
      "Once the repair is completed, pay securely online through Stripe Checkout.",
    icon: CreditCard,
    insetBg: "bg-[#dff4fa] dark:bg-sky-950/50",
    numberColor: "text-[#0ea5e9] dark:text-sky-400",
    iconTile: "bg-[#0f8a5f] text-white",
    pinBase: "bg-[#00838f]",
    pinHead: "bg-[#00bcd4]",
    tilt: "rotate-[1deg]",
  },
];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[#f7f7f7] px-4 py-16 dark:bg-background sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Subtle Clean Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#f3f4f6_100%)] dark:bg-none"
      />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-brand">
            Simple Process
          </span>

          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            How FixMate Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Getting your device repaired has never been easier. Follow four
            simple steps to get started.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Curved Dashed Connector Line (behind cards like reference) */}
          <svg
            aria-hidden
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 top-1/2 hidden h-48 w-full -translate-y-1/2 text-neutral-400/70 dark:text-neutral-600 lg:block"
          >
            <path
              d="M-20 120 C 180 20, 320 200, 520 110 C 720 20, 900 190, 1220 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative z-10 pt-3"
                >
                  {/* 3D Pushpin */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 -top-1 z-30 -translate-x-1/2"
                  >
                    {/* Pin shadow on card */}
                    <span className="absolute -left-2.5 top-4 h-3.5 w-6 -rotate-12 rounded-full bg-black/20 blur-[2px]" />
                    {/* Pin base */}
                    <span
                      className={`relative block h-6 w-6 rounded-full shadow-md ${step.pinBase}`}
                    >
                      {/* Pin neck & top cap */}
                      <span
                        className={`absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full shadow-sm ring-1 ring-black/10 ${step.pinHead}`}
                      >
                        <span className="absolute left-1 top-1 h-1.5 w-2 rounded-full bg-white/55" />
                      </span>
                    </span>
                  </div>

                  {/* Outer White Frame Card */}
                  <div
                    className={`relative flex h-full flex-col rounded-[1.75rem] border border-black/[0.04] bg-white p-3.5 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-2 hover:rotate-0 hover:shadow-[0_22px_40px_-10px_rgba(0,0,0,0.16)] dark:border-border dark:bg-card ${step.tilt}`}
                  >
                    {/* Top-right floating icon badge (sits on white card corner) */}
                    <div
                      className={`absolute right-4 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${step.iconTile}`}
                    >
                      <Icon size={26} strokeWidth={2.2} />
                    </div>

                    {/* Inner Pastel Box */}
                    <div
                      className={`mt-7 flex h-full flex-col rounded-2xl px-4 pb-5 pt-4 ${step.insetBg}`}
                    >
                      {/* Step Number */}
                      <span
                        className={`text-3xl font-black tracking-tight ${step.numberColor}`}
                      >
                        {step.number}
                      </span>

                      {/* Title */}
                      <h3 className="mt-3.5 pr-12 text-lg font-extrabold leading-snug text-neutral-900 dark:text-foreground">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-700 dark:text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
