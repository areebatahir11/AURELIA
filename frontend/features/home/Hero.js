"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/animations/variants";
import { SITE_CONFIG } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative flex h-screen items-end overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
        <source src="/videos/hero-drift.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-void/60" />

      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-2xl px-6 pb-24 lg:px-12"
      >
        <motion.span
          variants={fadeUp}
          className="mb-4 block font-mono text-xs uppercase tracking-[0.3em] text-gold"
        >
          {SITE_CONFIG.tagline}
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="mb-6 font-display text-5xl leading-[1.05] text-ivory md:text-6xl"
        >
          Where extraordinary machines find their next owner
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mb-8 max-w-md font-body text-base leading-relaxed text-ivory/80"
        >
          A curated multi-brand dealership sourcing the world&apos;s most exceptional vehicles,
          matched to those who accept nothing less.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <Button as={Link} href="/collection" variant="primary">
            Explore the collection
          </Button>
          <Button as={Link} href="/concierge" variant="outline">
            Meet the concierge
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
