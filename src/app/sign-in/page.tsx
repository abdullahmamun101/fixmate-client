"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setMessage(error.message || "Login failed");
    } else {
      setMessage("Login successful!");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md space-y-4 p-6"
      >
        <h1 className="text-3xl font-bold">Welcome Back</h1>

        <input
          className="w-full rounded border p-3"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white"
        >
          {loading ? "Logging in..." : "Sign In"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}