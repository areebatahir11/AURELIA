"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart, GitCompare, Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";
import { useAuthContext } from "@/context/AuthContext";
import { orderService } from "@/services/order.service";
import { formatCurrency } from "@/utils/formatters";

export default function VehicleActions({ vehicle }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, addToCompare, removeFromCompare, isFull } = useCompare();
  const { isAuthenticated, user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isReserved, setIsReserved] = useState(vehicle.status !== "available");

  const wishlisted = isWishlisted(vehicle.id);
  const comparing = isComparing(vehicle.id);

  function handleReserveClick() {
    if (!isAuthenticated) {
      // Signup/login is only required at this step — browsing and wishlisting stay guest-friendly
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setError("");
    setShowModal(true);
  }

  async function handleConfirmReservation(event) {
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
      setShowModal(false);
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

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-void/80 px-6">
          <div className="w-full max-w-md border border-hairline bg-void p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Confirm Reservation</p>
                <h3 className="mt-2 font-display text-2xl text-ivory">{vehicle.name}</h3>
                <p className="font-mono text-sm text-gold">{formatCurrency(vehicle.price)}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="text-graphite transition-colors hover:text-gold"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mb-6 font-body text-xs leading-relaxed text-graphite">
              This holds the vehicle for you and notifies our concierge team — it is not a payment.
              Your hold expires automatically if not confirmed by the concierge in time, and you can
              cancel it yourself any time before then.
            </p>

            <form onSubmit={handleConfirmReservation} className="space-y-4">
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
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Submitting..." : "Confirm Reservation"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}