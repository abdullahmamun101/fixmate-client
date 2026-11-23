
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const signUpData = {
        name,
        email,
        password,
        role,
      };

      const { error } = await authClient.signUp.email(
        signUpData as Parameters<typeof authClient.signUp.email>[0]
      );

      if (error) {
        setMessage(error.message || "Signup failed");
        return;
      }

      setMessage("Account created successfully!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("SIGN UP ERROR:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md space-y-4 p-6"
      >
        <h1 className="text-3xl font-bold">Create Account</h1>

        <input
          className="w-full rounded border p-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full rounded border p-3"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <label className="mb-2 block font-medium">
            Select Account Type
          </label>

          <select
            className="w-full rounded border p-3"
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
          className="w-full rounded border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

