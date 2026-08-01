"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function CustomerLoginPage() {
  const { login } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      router.push(user.role === "admin" ? "/admin" : redirectTo);
    } catch {
      setError("Invalid email or password.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.3em] text-gold">
          Welcome Back
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
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory focus:border-gold focus:outline-none"
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
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>

          {error && <p className="font-body text-xs text-red-400">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-graphite">
          Don&apos;t have an account?{" "}
          <Link href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="text-gold underline hover:text-goldBright">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}