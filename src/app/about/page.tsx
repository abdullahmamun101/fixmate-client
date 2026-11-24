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
    key: "trusted",
    icon: ShieldCheck,
    title: "Trusted Professionals",
    description:
      "We connect customers with technicians whose services are reviewed and approved.",
  },
  {
    key: "customer",
    icon: Users,
    title: "Customer First",
    description:
      "Our platform is designed to make finding and booking repair services simple.",
  },
  {
    key: "reliable",
    icon: Target,
    title: "Reliable Solutions",
    description:
      "We help customers find suitable repair solutions for their everyday needs.",
  },
  {
    key: "simple",
    icon: HeartHandshake,
    title: "Simple Experience",
    description:
      "From booking to payment, we aim to provide a smooth service experience.",
  },
];

function CoreValueGraphic({ variant }: { variant: string }) {
  return (
    <div className="relative mt-6 h-36 w-full select-none overflow-hidden rounded-2xl border border-border/60 bg-background/60">
      {/* Soft ambient glow inside graphic stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-1/2 h-24 w-44 -translate-x-1/2 rounded-full bg-brand/20 blur-2xl"
      />

      {variant === "trusted" && (
        <svg
          viewBox="0 0 240 130"
          className="relative z-10 h-full w-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.14)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldLeft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="shieldRight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.72" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          <ellipse
            cx="120"
            cy="114"
            rx="68"
            ry="8"
            className="fill-foreground/10"
          />

          {/* 3D Isometric Shield */}
          <g className="text-brand">
            <path
              d="M120 20L76 37V66C76 92 94 106 120 112V20Z"
              fill="url(#shieldLeft)"
            />
            <path
              d="M120 20L164 37V66C164 92 146 106 120 112V20Z"
              fill="url(#shieldRight)"
            />
            <path
              d="M120 20L76 37V66C76 92 94 106 120 112C146 106 164 92 164 66V37L120 20Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeOpacity="0.65"
            />
          </g>

          {/* 3D Checkmark */}
          <path
            d="M101 66L114 79L141 51"
            className="stroke-brand-foreground"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Floating 3D mini spheres */}
          <circle cx="54" cy="42" r="7" className="fill-brand/45" />
          <circle cx="188" cy="36" r="5" className="fill-foreground/25" />
          <circle cx="184" cy="88" r="8" className="fill-brand/30" />
        </svg>
      )}

      {variant === "customer" && (
        <svg
          viewBox="0 0 240 130"
          className="relative z-10 h-full w-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.14)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <ellipse
            cx="120"
            cy="115"
            rx="66"
            ry="8"
            className="fill-foreground/10"
          />

          {/* 3D Isometric Cube Base */}
          <g className="text-brand">
            <polygon
              points="120,34 166,57 120,80 74,57"
              fill="url(#cubeTop)"
            />
            <polygon
              points="74,57 120,80 120,108 74,85"
              fill="currentColor"
              fillOpacity="0.72"
            />
            <polygon
              points="166,57 120,80 120,108 166,85"
              fill="currentColor"
              fillOpacity="0.45"
            />
          </g>

          {/* Floating 3D User Badge */}
          <circle
            cx="120"
            cy="42"
            r="12"
            className="fill-card stroke-brand"
            strokeWidth="3"
          />
          <circle cx="120" cy="39" r="4" className="fill-brand" />
          <path
            d="M113 48C114.5 45.2 117 44 120 44C123 44 125.5 45.2 127 48"
            className="stroke-brand"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Floating accent dots */}
          <circle cx="58" cy="78" r="6" className="fill-brand/35" />
          <circle cx="184" cy="48" r="6.5" className="fill-brand/50" />
        </svg>
      )}

      {variant === "reliable" && (
        <svg
          viewBox="0 0 240 130"
          className="relative z-10 h-full w-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.14)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="120"
            cy="115"
            rx="66"
            ry="8"
            className="fill-foreground/10"
          />

          {/* 3D Tilted Target Discs */}
          <g transform="translate(116, 66) rotate(-14)">
            <ellipse
              cx="0"
              cy="6"
              rx="42"
              ry="32"
              className="fill-brand/35"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="42"
              ry="32"
              className="fill-card stroke-brand"
              strokeWidth="3.5"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="25"
              ry="19"
              className="fill-brand/15 stroke-brand/80"
              strokeWidth="3"
            />
            <ellipse cx="0" cy="0" rx="9" ry="7" className="fill-brand" />
          </g>

          {/* 3D Dart / Precision Pin */}
          <path
            d="M166 26L130 62"
            className="stroke-foreground/75"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <polygon points="125,67 136,64 128,56" className="fill-brand" />
          <polygon points="166,26 178,24 168,38" className="fill-brand" />

          <circle cx="58" cy="44" r="6" className="fill-brand/40" />
        </svg>
      )}

      {variant === "simple" && (
        <svg
          viewBox="0 0 240 130"
          className="relative z-10 h-full w-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.14)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="120"
            cy="115"
            rx="68"
            ry="8"
            className="fill-foreground/10"
          />

          {/* 3D Rounded Step Blocks */}
          <rect
            x="64"
            y="66"
            width="38"
            height="34"
            rx="10"
            className="fill-card stroke-brand/70"
            strokeWidth="3"
          />
          <rect
            x="101"
            y="48"
            width="42"
            height="52"
            rx="12"
            className="fill-brand/90 stroke-brand"
            strokeWidth="3"
          />
          <rect
            x="142"
            y="62"
            width="36"
            height="38"
            rx="10"
            className="fill-card stroke-brand/70"
            strokeWidth="3"
          />

          {/* Check badge on center block */}
          <circle cx="122" cy="72" r="11" className="fill-card" />
          <path
            d="M117 72L120.5 75.5L127.5 68.5"
            className="stroke-brand"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="54" cy="42" r="5.5" className="fill-brand/45" />
          <circle cx="188" cy="38" r="7" className="fill-brand/30" />
        </svg>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 1. Centered Hero Banner (Reference Top Section) */}
      <section className="border-b border-border bg-muted/40 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">
            About FixMate
          </span>

          <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Making Home Repairs
            <span className="mt-1 block text-brand">
              Simple and Reliable
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            FixMate is a service booking platform that connects customers
            with skilled technicians for home appliance and electronic
            repair services. We make it easier to discover services,
            request bookings and manage repairs.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-2xs transition hover:bg-brand/90"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 2. Split Editorial Overview + Framed Mission Panel (Reference Split Section) */}
      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              Who We Are
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              One Platform for Your Repair Needs
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Finding a reliable repair technician should not be
              complicated. FixMate brings customers and service
              professionals together through one convenient platform.
            </p>
          </div>

          <div className="rounded-xl border border-brand/30 bg-card p-6 shadow-xs sm:p-8 lg:col-span-7">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-brand">
                  <Target size={20} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  Our Mission
                </h3>

                <p className="mt-2.5 text-sm leading-7 text-muted-foreground">
                  To make repair services more accessible by creating a
                  transparent and convenient connection between customers
                  and skilled service professionals.
                </p>
              </div>

              <div className="border-t border-border pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                <span className="text-xs font-bold uppercase tracking-wider text-brand">
                  How It Connects
                </span>

                <h3 className="mt-2 text-lg font-bold text-foreground">
                  Customers, Pros & Admins
                </h3>

                <p className="mt-2.5 text-sm leading-7 text-muted-foreground">
                  Customers can browse approved services, submit repair
                  requests and track their bookings. Technicians can manage
                  their services and handle customer requests, while
                  administrators oversee platform activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Core Values Section (Reference Soft Rounded Cards + 3D Graphics) */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              What Matters to Us
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Our Core Values
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              The principles behind the FixMate service experience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group flex flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-card via-card to-brand/10 p-6 shadow-xs transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-extrabold leading-snug text-foreground">
                        {value.title}
                      </h3>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 text-brand shadow-2xs">
                        <Icon size={17} />
                      </span>
                    </div>

                    <p className="mt-2.5 text-xs leading-6 text-muted-foreground sm:text-sm">
                      {value.description}
                    </p>
                  </div>

                  <CoreValueGraphic variant={value.key} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}