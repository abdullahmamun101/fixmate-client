import {
  ShieldCheck,
  BadgeCheck,
  Clock,
  Headset,
  Wallet,
  Users,
  CheckCircle2,
  Calendar,
  CreditCard,
  MessageSquare,
  Sparkles,
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
  const [f1, f2, f3, f4, f5, f6] = features;

  return (
    <section className="bg-background px-4 py-20 text-foreground sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            Why FixMate
          </span>

          <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Why Choose FixMate?
          </h2>

          <p className="mt-3.5 text-sm leading-6 text-muted-foreground sm:text-base">
            We make finding and requesting repair services simple,
            convenient and reliable.
          </p>
        </div>

        {/* Bento Grid: Top Row (2 wide cards) + Bottom Row (3 cards) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          {/* Card 1: Top-Left Wide Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-border bg-muted/60 p-6 shadow-xs transition duration-300 hover:border-brand/30 hover:bg-muted sm:p-7 lg:col-span-3">
            {/* Subtle Card Graphic: Shield & Vetting Motif */}
            <svg
              aria-hidden
              viewBox="0 0 180 120"
              className="pointer-events-none absolute -right-3 -top-2 h-28 w-40 text-foreground/[0.05]"
            >
              <path
                d="M128 14L154 25V49C154 66 143 81 128 87C113 81 102 66 102 49V25L128 14Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="42"
                cy="32"
                r="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M120 50L126 56L137 44"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="relative z-10 max-w-[260px]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-2xs">
                <f1.icon size={15} strokeWidth={2} />
              </div>

              <h3 className="mt-4 text-base font-bold text-foreground">
                {f1.title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {f1.description}
              </p>
            </div>

            {/* Subtle UI Preview inside Card 1 */}
            <div className="relative z-10 mt-6 grid grid-cols-2 gap-2.5 sm:mt-4">
              <div className="rounded-xl border border-border/80 bg-card/95 p-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-[10px] font-bold text-brand">
                    TM
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-foreground">
                      Tariqul Islam
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Verified Tech
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-brand">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <CheckCircle2 size={11} /> Background Checked
                  </span>
                  <span className="font-semibold text-foreground">4.9★</span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card/80 p-3 shadow-2xs">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-3 -right-3 h-14 w-14 rounded-full bg-brand/10"
                />
                <div className="h-2 w-16 rounded-full bg-muted" />
                <div className="mt-2 h-2 w-24 rounded-full bg-muted/70" />
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                    Certified
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    On-Time
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Top-Right Wide Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-border bg-muted/60 p-6 shadow-xs transition duration-300 hover:border-brand/30 hover:bg-muted sm:p-7 lg:col-span-3">
            {/* Subtle Card Graphic: Quality Check & Stamp Grid */}
            <svg
              aria-hidden
              viewBox="0 0 220 120"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-foreground/[0.05]"
            >
              <line
                x1="16"
                y1="24"
                x2="204"
                y2="24"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <rect
                x="24"
                y="42"
                width="54"
                height="6"
                rx="3"
                fill="currentColor"
              />
              <rect
                x="24"
                y="56"
                width="38"
                height="5"
                rx="2.5"
                fill="currentColor"
              />
              <circle
                cx="176"
                cy="62"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>

            <div className="relative z-10 max-w-[260px]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-2xs">
                <f2.icon size={15} strokeWidth={2} />
              </div>

              <h3 className="mt-4 text-base font-bold text-foreground">
                {f2.title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {f2.description}
              </p>
            </div>

            {/* Subtle Decorative Panel on Right */}
            <div
              aria-hidden
              className="pointer-events-none relative z-10 mt-6 flex items-center justify-end sm:mt-4"
            >
              <div className="relative flex h-24 w-28 items-center justify-center rounded-2xl border border-border bg-card shadow-inner">
                <span className="absolute inset-2 rounded-xl border border-dashed border-border/80" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <f2.icon size={24} strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Bottom-Left Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-border bg-muted/60 p-6 shadow-xs transition duration-300 hover:border-brand/30 hover:bg-muted lg:col-span-2">
            {/* Subtle Card Graphic: Timeline Dots */}
            <svg
              aria-hidden
              viewBox="0 0 140 70"
              className="pointer-events-none absolute right-3 top-4 h-16 w-32 text-foreground/[0.06]"
            >
              <line
                x1="14"
                y1="18"
                x2="124"
                y2="18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx="24" cy="18" r="4" fill="currentColor" />
              <circle cx="70" cy="18" r="4" fill="currentColor" />
              <circle cx="116" cy="18" r="4" fill="currentColor" />
              <rect
                x="18"
                y="32"
                width="44"
                height="5"
                rx="2.5"
                fill="currentColor"
              />
              <rect
                x="74"
                y="32"
                width="46"
                height="5"
                rx="2.5"
                fill="currentColor"
              />
            </svg>

            <div className="relative z-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-2xs">
                <f3.icon size={15} strokeWidth={2} />
              </div>

              <h3 className="mt-4 text-base font-bold text-foreground">
                {f3.title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {f3.description}
              </p>
            </div>

            {/* Mini Booking Preview */}
            <div className="relative z-10 mt-6 rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/80 pb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                  <Calendar size={12} className="text-brand" />
                  Quick Slot Request
                </span>
                <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-medium text-brand">
                  Instant
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Today, 4:00 PM</span>
                <span className="font-medium text-foreground">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Card 4: Bottom-Middle Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-border bg-muted/60 p-6 shadow-xs transition duration-300 hover:border-brand/30 hover:bg-muted lg:col-span-2">
            {/* Subtle Card Graphic: Ledger Lines */}
            <svg
              aria-hidden
              viewBox="0 0 140 70"
              className="pointer-events-none absolute right-3 top-4 h-16 w-32 text-foreground/[0.06]"
            >
              <rect
                x="24"
                y="12"
                width="96"
                height="42"
                rx="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="36"
                y1="26"
                x2="84"
                y2="26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="36"
                y1="38"
                x2="104"
                y2="38"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-2xs">
                <f4.icon size={15} strokeWidth={2} />
              </div>

              <h3 className="mt-4 text-base font-bold text-foreground">
                {f4.title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {f4.description}
              </p>
            </div>

            {/* Mini Pricing Preview */}
            <div className="relative z-10 mt-6 rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
                  <CreditCard size={12} className="text-brand" />
                  Upfront Estimate
                </span>
                <span className="text-[10px] font-medium text-brand">
                  No Hidden Fees
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Service Rate</span>
                <span className="text-sm font-bold text-foreground">
                  Clear Quote
                </span>
              </div>
            </div>
          </div>

          {/* Card 5 & 6 in Bottom-Right Card */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-border bg-muted/60 p-6 shadow-xs transition duration-300 hover:border-brand/30 hover:bg-muted sm:col-span-2 lg:col-span-2">
            {/* Subtle Card Graphic: Chat Bubbles */}
            <svg
              aria-hidden
              viewBox="0 0 150 80"
              className="pointer-events-none absolute right-2 top-3 h-20 w-36 text-foreground/[0.06]"
            >
              <rect
                x="48"
                y="10"
                width="86"
                height="22"
                rx="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="24"
                y="40"
                width="76"
                height="20"
                rx="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>

            <div className="relative z-10 space-y-4">
              <div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-2xs">
                  <f5.icon size={15} strokeWidth={2} />
                </div>

                <h3 className="mt-3 text-base font-bold text-foreground">
                  {f5.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {f5.description}
                </p>
              </div>

              <div className="border-t border-border/80 pt-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-card text-foreground">
                    <f6.icon size={13} strokeWidth={2} />
                  </span>
                  <h4 className="text-sm font-bold text-foreground">
                    {f6.title}
                  </h4>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {f6.description}
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between rounded-xl border border-border/80 bg-card/95 px-3 py-2 text-[11px] text-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <MessageSquare size={12} className="text-brand" />
                Direct Notes
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-muted-foreground">
                <Sparkles size={12} className="text-brand" />
                Care First
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
