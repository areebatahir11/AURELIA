// app/(customer)/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function CustomerLoginPage() {
  const { login } = useAuthContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      setError("Invalid email or password.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-void">
      <div className="w-full max-w-sm">
        <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.3em] text-gold">
          Customer Access
        </p>
        <h1 className="mb-10 text-center font-display text-3xl text-ivory">AURELIA</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory placeholder-graphite focus:border-gold focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory placeholder-graphite focus:border-gold focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="font-body text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-gold bg-gold/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.15em] text-goldBright transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-graphite">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-goldBright underline hover:text-gold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}