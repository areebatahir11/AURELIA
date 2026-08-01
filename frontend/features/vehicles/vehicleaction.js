"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart, GitCompare, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";
import { useAuthContext } from "@/context/AuthContext";
import { orderService } from "@/services/order.service";

export default function VehicleActions({ vehicle }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, addToCompare, removeFromCompare, isFull } = useCompare();
  const { isAuthenticated, user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const [showReserveForm, setShowReserveForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isReserved, setIsReserved] = useState(vehicle.status !== "available");

  const wishlisted = isWishlisted(vehicle.id);
  const comparing = isComparing(vehicle.id);

  function handleReserveClick() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setShowReserveForm(true);
  }

  async function handleReserveSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await orderService.create({
        vehicleId: vehicle.id,
        contactName: user.name,
        contactEmail: user.email,
        contactPhone: phone,
        notes,
      });
      setIsReserved(true);
      setShowReserveForm(false);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not complete this reservation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" onClick={() => toggleWishlist(vehicle.id)}>
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
        </Button>

        <Button
          variant="ghost"
          disabled={!comparing && isFull}
          onClick={() => (comparing ? removeFromCompare(vehicle.id) : addToCompare(vehicle.id))}
        >
          <GitCompare size={16} />
          {comparing ? "Remove from compare" : "Add to compare"}
        </Button>

        {isReserved ? (
          <span className="inline-flex items-center gap-2 border border-gold/40 px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-gold">
            <Check size={14} /> Reserved
          </span>
        ) : (
          <Button variant="primary" onClick={handleReserveClick}>
            Reserve This Vehicle
          </Button>
        )}
      </div>

      {showReserveForm && (
        <form onSubmit={handleReserveSubmit} className="mt-6 max-w-md space-y-4 border border-hairline p-6">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-graphite">
            Confirm your reservation request
          </p>
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
              Phone number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
              Notes (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full border border-hairline bg-transparent px-4 py-2.5 font-body text-sm text-ivory focus:border-gold focus:outline-none"
            />
          </div>
          {error && <p className="font-body text-xs text-red-400">{error}</p>}
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Reservation"}
          </Button>
        </form>
      )}
    </div>
  );
}