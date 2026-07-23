"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";
import { cn } from "@/lib/cn";

export default function SectionHeader({ eyebrow, title, description, align = "left", className = "" }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className={cn(align === "center" && "text-center mx-auto", "max-w-2xl", className)}
    >
      {eyebrow && (
        <span className="block font-mono text-xs uppercase tracking-[0.3em] text-gold mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-ivory leading-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-graphite font-body text-base leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
