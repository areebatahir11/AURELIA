// app/(customer)/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function CustomerSignupPage() {
  const { signup } = useAuthContext();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signup({ name, email, password });
      router.push("/");
    } catch (err) {
      setError(err.message || "Signup failed");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-void">
      <div className="w-full max-w-sm">
        <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.3em] text-gold">
          Create Account
        </p>
        <h1 className="mb-10 text-center font-display text-3xl text-ivory">AURELIA</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory placeholder-graphite focus:border-gold focus:outline-none"
              placeholder="John Doe"
            />
          </div>

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
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-graphite">
          Already have an account?{" "}
          <a href="/login" className="text-goldBright underline hover:text-gold">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}