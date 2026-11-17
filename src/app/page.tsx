
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-zinc-800 px-8 py-5">
        <h1 className="text-2xl font-bold">
          FixMate<span className="text-blue-500">.</span>
        </h1>

        <div className="flex items-center gap-5">
          <Link href="/sign-in" className="hover:text-blue-400">
            Login
          </Link>

          <Link href="/sign-up" className="hover:text-blue-400">
            Sign Up
          </Link>

          <LogoutButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
          Smart Repair Service Platform
        </p>

        <h2 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Your Trusted Partner for
          <span className="text-blue-500"> Device Repair.</span>
        </h2>

        <p className="mt-6 max-w-xl text-zinc-400">
          Find professional technicians and get your home appliances
          and electronic devices repaired easily with FixMate.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/services"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
          >
            Explore Services
          </Link>

          <Link
            href="/sign-up"
            className="rounded-lg border border-zinc-600 px-6 py-3 font-semibold hover:bg-zinc-800"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Demo Status */}
      <section className="border-t border-zinc-800 px-6 py-8 text-center">
        <p className="text-sm text-zinc-500">
          Development Version
        </p>
      </section>
    </main>
  );
}

