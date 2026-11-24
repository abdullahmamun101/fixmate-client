"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type AuthMode = "signin" | "signup";

interface AuthSplitCardProps {
  initialMode?: AuthMode;
}

const dashboardFor = (role?: string) =>
  role === "admin"
    ? "/dashboard/admin"
    : role === "technician"
      ? "/dashboard/technician"
      : "/dashboard/customer";

const inputClass =
  "w-full rounded-xl border border-input bg-muted/60 px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand focus:bg-background focus:ring-2 focus:ring-brand/25";

const constellationNodes = [
  // Top-left cluster
  { x: 95, y: 110, r: 1.7, glow: 8 },
  { x: 185, y: 85, r: 1.4, glow: 7 },
  { x: 255, y: 145, r: 2.0, glow: 10 },
  { x: 145, y: 195, r: 1.6, glow: 8 },
  { x: 335, y: 105, r: 1.3, glow: 6 },

  // Mid-left cluster
  { x: 80, y: 310, r: 1.5, glow: 7 },
  { x: 195, y: 290, r: 1.9, glow: 9 },
  { x: 130, y: 415, r: 1.4, glow: 7 },
  { x: 235, y: 455, r: 1.8, glow: 9 },

  // Bottom-left cluster
  { x: 105, y: 560, r: 1.6, glow: 8 },
  { x: 215, y: 615, r: 2.0, glow: 10 },
  { x: 325, y: 675, r: 1.4, glow: 7 },
  { x: 440, y: 645, r: 1.5, glow: 7 },

  // Top-right cluster
  { x: 855, y: 95, r: 1.5, glow: 7 },
  { x: 965, y: 140, r: 2.0, glow: 10 },
  { x: 1085, y: 110, r: 1.4, glow: 7 },
  { x: 1030, y: 225, r: 1.7, glow: 8 },
  { x: 910, y: 215, r: 1.3, glow: 6 },

  // Mid-right cluster
  { x: 1110, y: 345, r: 1.6, glow: 8 },
  { x: 995, y: 380, r: 1.9, glow: 9 },
  { x: 1065, y: 495, r: 1.5, glow: 7 },

  // Bottom-right cluster
  { x: 935, y: 555, r: 1.8, glow: 9 },
  { x: 1090, y: 635, r: 2.0, glow: 10 },
  { x: 970, y: 675, r: 1.4, glow: 7 },
  { x: 825, y: 650, r: 1.5, glow: 7 },
];

const constellationLinks: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 2],
  [2, 4],
  [3, 6],
  [5, 6],
  [5, 7],
  [6, 7],
  [7, 8],
  [7, 9],
  [9, 10],
  [8, 10],
  [10, 11],
  [11, 12],
  [13, 14],
  [14, 15],
  [14, 17],
  [15, 16],
  [17, 16],
  [16, 19],
  [16, 18],
  [18, 19],
  [19, 20],
  [19, 21],
  [20, 22],
  [21, 22],
  [21, 23],
  [22, 23],
  [21, 24],
  [23, 24],
];

export default function AuthSplitCard({
  initialMode = "signin",
}: AuthSplitCardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const router = useRouter();

  // Sign In state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up state
  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [message, setMessage] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      const authRole = (data?.user as { role?: string } | undefined)?.role;

      toast.success("Signed in successfully");
      router.push(dashboardFor(authRole));
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpLoading(true);
    setMessage("");

    try {
      const signUpData = {
        name,
        email: signUpEmail,
        password: signUpPassword,
        role,
      };

      const { error } = await authClient.signUp.email(
        signUpData as Parameters<typeof authClient.signUp.email>[0]
      );

      if (error) {
        const errMsg = error.message || "Signup failed";
        setMessage(errMsg);
        toast.error(errMsg);
        return;
      }

      const successMsg = "Account created successfully!";
      setMessage(successMsg);
      toast.success(successMsg);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("SIGN UP ERROR:", error);
      const fallbackMsg = "Something went wrong. Please try again.";
      setMessage(fallbackMsg);
      toast.error(fallbackMsg);
    } finally {
      setSignUpLoading(false);
    }
  };

  const isSignUp = mode === "signup";

  return (
    <main className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground sm:px-6">
      {/* Soft Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-brand/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-96 w-96 rounded-full bg-brand/20 blur-3xl"
      />

      {/* Refined Smaller & Balanced Constellation Network */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-foreground"
      >
        <svg
          viewBox="0 0 1200 760"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full opacity-30 blur-[0.8px]"
          fill="none"
        >
          <defs>
            <radialGradient id="subtleNodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.25" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Thin Connecting Lines */}
          <g stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.22">
            {constellationLinks.map(([from, to], idx) => {
              const a = constellationNodes[from];
              const b = constellationNodes[to];
              return (
                <line
                  key={idx}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
              );
            })}
          </g>

          {/* Small Glowing Dots */}
          <g>
            {constellationNodes.map((node, idx) => (
              <g key={idx}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.glow}
                  fill="url(#subtleNodeGlow)"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill="currentColor"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Main Auth Container */}
      <div className="relative w-full max-w-4xl">
        {/* Mobile Mode Switcher */}
        <div className="mb-4 grid grid-cols-2 rounded-full border border-border bg-card/90 p-1 shadow-sm backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`rounded-full py-2 text-xs font-bold transition ${
              !isSignUp
                ? "bg-brand text-brand-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`rounded-full py-2 text-xs font-bold transition ${
              isSignUp
                ? "bg-brand text-brand-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Desktop Sliding Split Card */}
        <div className="relative hidden overflow-hidden rounded-[2rem] border border-border bg-card/95 text-card-foreground shadow-2xl backdrop-blur-md md:grid md:min-h-[540px] md:grid-cols-2">
          {/* Left Form Slot: Sign Up Form */}
          <div
            className={`flex flex-col justify-center p-8 transition-all duration-700 ease-in-out lg:p-10 ${
              isSignUp
                ? "translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-8 opacity-0"
            }`}
          >
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
                  Create Account
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Register to book trusted repair services on FixMate.
                </p>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="desktop-signup-name"
                  className="text-xs font-semibold text-foreground"
                >
                  Full Name
                </label>
                <input
                  id="desktop-signup-name"
                  className={inputClass}
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="desktop-signup-email"
                  className="text-xs font-semibold text-foreground"
                >
                  Email Address
                </label>
                <input
                  id="desktop-signup-email"
                  className={inputClass}
                  type="email"
                  placeholder="Email Address"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required={isSignUp}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="desktop-signup-role"
                  className="text-xs font-semibold text-foreground"
                >
                  Select Account Type
                </label>
                <select
                  id="desktop-signup-role"
                  className={inputClass}
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "customer" | "technician")
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="desktop-signup-password"
                  className="text-xs font-semibold text-foreground"
                >
                  Password
                </label>
                <input
                  id="desktop-signup-password"
                  className={inputClass}
                  type="password"
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required={isSignUp}
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={signUpLoading}
                className="mt-2 w-full rounded-xl bg-brand px-4 py-3 text-xs font-bold uppercase tracking-wider text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signUpLoading ? "Creating Account..." : "Sign Up"}
              </button>

              {message && (
                <p className="text-center text-xs font-medium text-muted-foreground">
                  {message}
                </p>
              )}
            </form>
          </div>

          {/* Right Form Slot: Sign In Form */}
          <div
            className={`flex flex-col justify-center p-8 transition-all duration-700 ease-in-out lg:p-10 ${
              !isSignUp
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-8 opacity-0"
            }`}
          >
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
                  Sign In
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sign in to manage your repair requests.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="desktop-signin-email"
                  className="text-xs font-semibold text-foreground"
                >
                  Email
                </label>
                <input
                  id="desktop-signin-email"
                  className={inputClass}
                  type="email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required={!isSignUp}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="desktop-signin-password"
                  className="text-xs font-semibold text-foreground"
                >
                  Password
                </label>
                <input
                  id="desktop-signin-password"
                  className={inputClass}
                  type="password"
                  placeholder="Your password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required={!isSignUp}
                />
              </div>

              <button
                type="submit"
                disabled={signInLoading}
                className="w-full rounded-xl bg-brand px-4 py-3 text-xs font-bold uppercase tracking-wider text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signInLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Sliding Brand Overlay Panel */}
          <div
            aria-hidden="false"
            className={`absolute inset-y-0 left-0 z-20 flex w-1/2 flex-col items-center justify-center overflow-hidden bg-brand px-8 text-center text-brand-foreground shadow-xl transition-transform duration-700 ease-in-out ${
              isSignUp
                ? "translate-x-full rounded-l-[6.5rem] rounded-r-[2rem]"
                : "translate-x-0 rounded-l-[2rem] rounded-r-[6.5rem]"
            }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-foreground/15 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-14 -left-14 h-52 w-52 rounded-full bg-foreground/10 blur-2xl"
            />

            {!isSignUp ? (
              <div className="relative z-10 max-w-xs space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Welcome Back!
                </h2>
                <p className="text-sm leading-6 text-brand-foreground/85">
                  Enter your personal details to access your account and manage
                  repair requests.
                </p>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="mt-2 inline-flex items-center justify-center rounded-xl border border-brand-foreground/70 bg-transparent px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-foreground transition hover:bg-brand-foreground/15"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative z-10 max-w-xs space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Create Account
                </h2>
                <p className="text-sm leading-6 text-brand-foreground/85">
                  Already have an account? Sign in to track your bookings and
                  services.
                </p>
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="mt-2 inline-flex items-center justify-center rounded-xl border border-brand-foreground/70 bg-transparent px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-foreground transition hover:bg-brand-foreground/15"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile View Card */}
        <div className="rounded-2xl border border-border bg-card/95 p-6 text-card-foreground shadow-xl backdrop-blur-md md:hidden">
          {!isSignUp ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <h1 className="text-2xl font-extrabold">Welcome Back</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in to manage your repair requests.
                </p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mobile-signin-email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  id="mobile-signin-email"
                  className={inputClass}
                  type="email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required={!isSignUp}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="mobile-signin-password"
                  className="text-sm font-semibold"
                >
                  Password
                </label>
                <input
                  id="mobile-signin-password"
                  className={inputClass}
                  type="password"
                  placeholder="Your password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required={!isSignUp}
                />
              </div>

              <button
                type="submit"
                disabled={signInLoading}
                className="w-full rounded-full bg-brand px-4 py-3 text-sm font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signInLoading ? "Signing in..." : "Sign In"}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                New to FixMate?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-semibold text-brand hover:underline"
                >
                  Create an account
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <h1 className="text-2xl font-extrabold">Create Account</h1>

              <input
                className={inputClass}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
              />

              <input
                className={inputClass}
                type="email"
                placeholder="Email Address"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required={isSignUp}
              />

              <div>
                <label
                  htmlFor="mobile-signup-role"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Select Account Type
                </label>

                <select
                  id="mobile-signup-role"
                  className={inputClass}
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "customer" | "technician")
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                </select>
              </div>

              <input
                className={inputClass}
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required={isSignUp}
                minLength={8}
              />

              <button
                type="submit"
                disabled={signUpLoading}
                className="w-full rounded-full bg-brand px-4 py-3 text-sm font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signUpLoading ? "Creating Account..." : "Create Account"}
              </button>

              {message && (
                <p className="text-center text-sm text-muted-foreground">
                  {message}
                </p>
              )}

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-semibold text-brand hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}