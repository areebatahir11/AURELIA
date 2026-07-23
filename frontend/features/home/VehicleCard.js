"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency } from "@/utils/formatters";
import { fadeUp } from "@/animations/variants";

export default function VehicleCard({ vehicle }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(vehicle.id);

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Link href={`/collection/${vehicle.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-graphite">
            {vehicle.name} — image placeholder
          </div>

          <button
            onClick={(event) => {
              event.preventDefault();
              toggleWishlist(vehicle.id);
            }}
            aria-label="Toggle wishlist"
            className="absolute right-4 top-4 text-ivory transition-colors hover:text-gold"
          >
            <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
          </button>

          {vehicle.tags?.includes("exclusive") && (
            <Badge className="absolute left-4 top-4">Exclusive</Badge>
          )}
        </div>

        <div className="mt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite">
            {vehicle.brand}
          </span>
          <h3 className="mt-1 font-display text-xl text-ivory">{vehicle.name}</h3>
          <p className="mt-2 font-mono text-sm text-gold">{formatCurrency(vehicle.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
