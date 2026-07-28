"use client";

import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, FileCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/animations/variants";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Every vehicle, verified",
    description:
      "Full inspection, documented service history, and ownership provenance before a single listing goes live.",
  },
  {
    icon: UserCheck,
    title: "A named advisor, not a queue",
    description:
      "Your concierge stays with you from first inquiry through delivery — one person, reachable directly.",
  },
  {
    icon: FileCheck,
    title: "Transparent, always",
    description:
      "The price you see is the price you pay. No hidden fees, no manufactured urgency, no fine print.",
  },
];

export default function WhyAurelia() {
  return (
    <section className="border-t border-hairline px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Why Aurelia"
          title="Bought the way it should feel"
          align="center"
        />

        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3"
        >
          {PILLARS.map((pillar) => (
            <motion.div key={pillar.title} variants={fadeUp} className="text-center">
              <pillar.icon className="mx-auto mb-5 text-gold" size={28} strokeWidth={1.25} />
              <h3 className="font-display text-xl text-ivory">{pillar.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-graphite">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}