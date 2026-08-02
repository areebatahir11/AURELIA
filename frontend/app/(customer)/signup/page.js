"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

function CustomerSignupForm() {
  const { signup } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signup({ name, email, password });
      router.push(redirectTo);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not create your account.");
      setIsSubmitting(false);
    }
  }

  return (
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
            onChange={(event) => setName(event.target.value)}
            className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory focus:border-gold focus:outline-none"
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
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory focus:border-gold focus:outline-none"
          />
        </div>

        {error && <p className="font-body text-xs text-red-400">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-xs text-graphite">
        Already have an account?{" "}
        <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-gold underline hover:text-goldBright">