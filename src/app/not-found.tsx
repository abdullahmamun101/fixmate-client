import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground">
      {/* Scattered Tilted "404" Tags matching the reference */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] top-[10%] -rotate-12 rounded-md border border-border bg-card px-4 py-1.5 text-2xl font-black tracking-tight text-foreground shadow-sm sm:left-[8%] sm:text-3xl"
      >
        404
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[24%] top-[6%] -rotate-6 rounded-sm border-2 border-foreground/80 bg-background px-4 py-1 text-xl font-black tracking-tight text-foreground sm:text-2xl"
      >
        404
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[22%] top-[5%] rotate-12 rounded-md border border-border bg-card px-4 py-1.5 text-2xl font-black tracking-tight text-foreground shadow-sm sm:text-3xl"
      >
        404
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-[11%] rotate-6 rounded-md border border-brand/40 bg-brand px-4 py-1.5 text-2xl font-black tracking-tight text-brand-foreground shadow-sm sm:right-[4%] sm:text-3xl"
      >
        404
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[22%] -left-4 rotate-12 rounded-md border border-brand/40 bg-brand px-4 py-1.5 text-2xl font-black tracking-tight text-brand-foreground shadow-sm sm:left-[3%] sm:text-3xl"
      >
        404
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[7%] left-[18%] -rotate-6 rounded-md border border-border bg-card px-4 py-1.5 text-2xl font-black tracking-tight text-foreground shadow-sm sm:text-3xl"
      >
        404
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[8%] right-[6%] rotate-6 rounded-md border border-border bg-card px-4 py-1.5 text-2xl font-black tracking-tight text-foreground shadow-sm sm:right-[10%] sm:text-3xl"
      >
        404
      </span>

      {/* Center Content */}
      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
          ERROR 404
        </p>

        <h1 className="mt-2 text-6xl font-black uppercase tracking-tighter text-foreground sm:text-8xl">
          OH NO!
        </h1>

        <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Page Not Found
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
          the page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-foreground/40 bg-background/60 px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground backdrop-blur-xs transition hover:border-brand hover:bg-brand hover:text-brand-foreground"
        >
          <span>Back to Home</span>
          <span className="h-2 w-2 rounded-full bg-brand transition group-hover:bg-brand-foreground" />
        </Link>
      </div>
    </main>
  );
}
