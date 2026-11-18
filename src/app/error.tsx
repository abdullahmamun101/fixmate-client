
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16 text-foreground">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="text-3xl font-bold">
          Something Went Wrong!
        </h1>

        <p className="mt-3 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold transition hover:bg-muted"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
