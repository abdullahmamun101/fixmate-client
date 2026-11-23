"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const dashboardFor = (role?: string) =>
  role === "admin"
    ? "/dashboard/admin"
    : role === "technician"
      ? "/dashboard/technician"
      : "/dashboard/customer";

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/30";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      const role = (data?.user as { role?: string } | undefined)?.role;

      toast.success("Signed in successfully");
      router.push(dashboardFor(role));
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-10 sm:px-6">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg sm:p-8"
      >
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your repair requests.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            className={inputClass}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <input
            id="password"
            className={inputClass}
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-full bg-brand px-4 py-3 text-sm font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          New to FixMate?{" "}
          <Link href="/sign-up" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}