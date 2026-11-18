
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">
          Page Not Found
        </h2>

        <Link
          href="/"
          className="mt-6 inline-block text-primary underline"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
