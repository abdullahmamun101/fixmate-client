
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Wrench,
  Laptop,
  House,
  Zap,
  Settings,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative isolate -mt-20 overflow-hidden pt-20">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 text-foreground opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto grid min-h-[650px] w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left Content */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand sm:text-sm">
            <Wrench size={16} />
            Your Trusted Repair Partner
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Broken Device? Get It Fixed by
            <span className="mt-2 block text-brand">
              Verified Technicians
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Connect with skilled technicians for reliable home appliance and
            electronic repairs. Book easily, track every step, and pay only
            after the job is done.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-7 py-3.5 font-bold text-foreground transition hover:bg-accent"
            >
              Explore Services
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-brand" />
              Trusted Technicians
            </span>

            <span className="flex items-center gap-2">
              <Clock size={18} className="text-brand" />
              Easy Booking
            </span>
          </div>
        </div>

{/* Main illustration: Repair Tools Only */}
<div className="relative flex min-h-[420px] w-full items-center justify-center sm:min-h-[460px]">
  {/* Soft ambient glow behind tools */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute h-72 w-72 rounded-full bg-brand/15 blur-3xl sm:h-80 sm:w-80"
  />

  <svg
    viewBox="0 0 480 480"
    className="relative z-10 w-full max-w-[430px] drop-shadow-[0_18px_35px_rgba(0,0,0,0.18)]"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="toolBrandGrad" x1="120" y1="100" x2="360" y2="380" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.65" />
      </linearGradient>
      <linearGradient id="panelGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
      </linearGradient>
    </defs>

    {/* Ground shadow */}
    <ellipse
      cx="240"
      cy="394"
      rx="155"
      ry="15"
      className="fill-foreground/10"
    />

    {/* Decorative orbital rings */}
    <circle
      cx="240"
      cy="238"
      r="166"
      className="stroke-brand/15"
      strokeWidth="1.5"
      strokeDasharray="6 6"
    />
    <circle
      cx="240"
      cy="238"
      r="134"
      className="stroke-border/60"
      strokeWidth="1"
    />

    {/* 1. Center-Left: Heavy Adjustable Wrench */}
    <g transform="rotate(-28 195 245)">
      {/* Wrench shaft */}
      <rect
        x="178"
        y="165"
        width="34"
        height="165"
        rx="14"
        className="fill-card stroke-brand"
        strokeWidth="4"
      />
      {/* Shaft inner groove */}
      <line
        x1="195"
        y1="195"
        x2="195"
        y2="298"
        className="stroke-brand/35"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Top open-end jaw */}
      <path
        d="M168 130C156 140 156 164 170 174H220C234 164 234 140 222 130L208 144H182L168 130Z"
        className="fill-card stroke-brand"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Bottom ring head */}
      <circle
        cx="195"
        cy="336"
        r="24"
        className="fill-card stroke-brand"
        strokeWidth="4"
      />
      <circle
        cx="195"
        cy="336"
        r="9"
        className="fill-background stroke-brand/70"
        strokeWidth="3"
      />
    </g>

    {/* 2. Center-Right: Precision Screwdriver */}
    <g transform="rotate(26 285 245)">
      {/* Metal blade */}
      <rect
        x="280"
        y="120"
        width="10"
        height="95"
        rx="3"
        className="fill-foreground/75"
      />
      {/* Flat/Phillips tip */}
      <path
        d="M278 120L285 106L292 120H278Z"
        className="fill-brand"
      />
      {/* Ergonomic handle */}
      <rect
        x="269"
        y="215"
        width="32"
        height="112"
        rx="14"
        className="text-brand"
        fill="url(#toolBrandGrad)"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      {/* Grip ridges */}
      <line x1="274" y1="238" x2="296" y2="238" className="stroke-brand-foreground/45" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="274" y1="252" x2="296" y2="252" className="stroke-brand-foreground/45" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="274" y1="266" x2="296" y2="266" className="stroke-brand-foreground/45" strokeWidth="2.5" strokeLinecap="round" />
      {/* End cap */}
      <rect
        x="273"
        y="314"
        width="24"
        height="13"
        rx="6"
        className="fill-card stroke-foreground/70"
        strokeWidth="2.5"
      />
    </g>

    {/* 3. Front Center: Digital Diagnostic / Multimeter Module */}
    <g>
      <rect
        x="182"
        y="222"
        width="116"
        height="142"
        rx="18"
        className="fill-card stroke-brand"
        strokeWidth="4"
      />
      {/* Screen */}
      <rect
        x="196"
        y="238"
        width="88"
        height="46"
        rx="8"
        className="text-brand"
        fill="url(#panelGlass)"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Signal / waveform line on screen */}
      <path
        d="M206 262H222L229 249L238 273L246 255L253 262H274"
        className="stroke-brand"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rotary dial */}
      <circle
        cx="240"
        cy="318"
        r="24"
        className="fill-background/80 stroke-brand"
        strokeWidth="3"
      />
      <circle
        cx="240"
        cy="318"
        r="14"
        className="fill-brand/15 stroke-brand/60"
        strokeWidth="2"
      />
      <line
        x1="240"
        y1="304"
        x2="240"
        y2="313"
        className="stroke-brand"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Probe ports */}
      <circle cx="204" cy="346" r="5" className="fill-brand" />
      <circle cx="276" cy="346" r="5" className="fill-foreground/70" />
    </g>

    {/* 4. Top Accent: Gear / Cog */}
    <g transform="translate(240, 118)">
      <circle
        cx="0"
        cy="0"
        r="22"
        className="fill-card stroke-brand"
        strokeWidth="3.5"
      />
      <circle
        cx="0"
        cy="0"
        r="8"
        className="fill-background stroke-brand"
        strokeWidth="3"
      />
      <path
        d="M-4 -28H4V-22H-4V-28ZM-4 22H4V28H-4V22ZM-28 -4H-22V4H-28V-4ZM22 -4H28V4H22V-4ZM-21 -17L-16 -21L-12 -16L-17 -12L-21 -17ZM12 16L16 12L21 17L17 21L12 16ZM16 -21L21 -17L17 -12L12 -16L16 -21ZM-21 17L-17 12L-12 16L-16 21L-21 17Z"
        className="fill-brand"
      />
    </g>

    {/* Sparkles & accents */}
    <path
      d="M372 122L378 138L394 144L378 150L372 166L366 150L350 144L366 138L372 122Z"
      className="fill-brand/25 stroke-brand"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="108" cy="154" r="8" className="fill-brand/30" />
    <circle cx="378" cy="356" r="10" className="fill-brand/20" />
    <circle cx="96" cy="348" r="5" className="fill-brand/40" />
  </svg>

  {/* Floating service cards */}
  <div className="animate-bounce [animation-duration:4.5s] absolute left-2 top-12 z-20 flex items-center gap-3 rounded-2xl border border-border/80 bg-card/95 px-3.5 py-3 shadow-lg backdrop-blur-md sm:left-0">
    <div className="rounded-xl bg-brand/15 p-2.5 text-brand ring-1 ring-brand/20">
      <Laptop size={21} />
    </div>
    <div>
      <div className="flex items-center gap-1.5">
        <p className="text-xs font-bold text-foreground">Device Repair</p>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </div>
      <p className="text-[11px] text-muted-foreground">Same-day diagnostics</p>
    </div>
  </div>

  <div className="animate-bounce [animation-duration:5s] absolute bottom-12 right-2 z-20 flex items-center gap-3 rounded-2xl border border-border/80 bg-card/95 px-3.5 py-3 shadow-lg backdrop-blur-md sm:right-0">
    <div className="rounded-xl bg-brand/15 p-2.5 text-brand ring-1 ring-brand/20">
      <House size={21} />
    </div>
    <div>
      <div className="flex items-center gap-1.5">
        <p className="text-xs font-bold text-foreground">Home Services</p>
        <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] font-semibold text-brand">
          Verified
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground">Trusted local pros</p>
    </div>
  </div>

  <div className="absolute right-6 top-6 z-20 rounded-2xl border border-border/80 bg-card/95 p-3 text-brand shadow-md backdrop-blur-md">
    <Zap size={20} />
  </div>

  <div className="absolute bottom-6 left-8 z-20 rounded-2xl border border-border/80 bg-card/95 p-3 text-brand shadow-md backdrop-blur-md">
    <Settings size={20} />
  </div>
</div>
      </div>
    </section>
  );
}





