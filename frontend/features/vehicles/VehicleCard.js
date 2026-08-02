"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, GitCompare, ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";
import { formatCurrency } from "@/utils/formatters";
import { fadeUp } from "@/animations/variants";

export default function VehicleCard({ vehicle }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, addToCompare, removeFromCompare, isFull } = useCompare();
  const wishlisted = isWishlisted(vehicle.id);
  const comparing = isComparing(vehicle.id);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/collection/${vehicle.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {vehicle.images?.[0] ? (
            <img
              src={vehicle.images[0]}
              alt={vehicle.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-graphite">
              {vehicle.name}
            </div>
          )}

          {/* Bottom scrim, brightens on hover — sets up the "View Details" reveal below */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {vehicle.tags?.includes("exclusive") && <Badge>Exclusive</Badge>}
            {vehicle.tags?.includes("new-arrival") && <Badge tone="ivory">New Arrival</Badge>}
          </div>

          <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              onClick={(event) => {
                event.preventDefault();
                toggleWishlist(vehicle.id);
              }}
              aria-label="Toggle wishlist"
              className="flex h-9 w-9 items-center justify-center border border-ivory/20 bg-void/60 text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                comparing ? removeFromCompare(vehicle.id) : addToCompare(vehicle.id);
              }}
              disabled={!comparing && isFull}
              aria-label="Toggle compare"
              className="flex h-9 w-9 items-center justify-center border border-ivory/20 bg-void/60 text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <GitCompare size={15} className={comparing ? "text-gold" : ""} />
            </button>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex translate-y-2 items-center gap-1 font-mono text-[11px] uppercase tracking-[0.15em] text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            View Details <ArrowUpRight size={13} />
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite">
              {vehicle.brand}
            </span>
            <h3 className="mt-1 font-display text-2xl leading-tight text-ivory transition-colors group-hover:text-gold">
              {vehicle.name}
            </h3>
          </div>
          <p className="whitespace-nowrap pt-1 font-mono text-lg text-gold">
            {formatCurrency(vehicle.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}