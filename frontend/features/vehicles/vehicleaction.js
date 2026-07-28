"use client";

import { Heart, GitCompare } from "lucide-react";
import Button from "@/components/ui/Button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";

export default function VehicleActions({ vehicleId }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isComparing, addToCompare, removeFromCompare, isFull } = useCompare();

  const wishlisted = isWishlisted(vehicleId);
  const comparing = isComparing(vehicleId);

  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="outline" onClick={() => toggleWishlist(vehicleId)}>
        <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
      </Button>

      <Button
        variant="ghost"
        disabled={!comparing && isFull}
        onClick={() => (comparing ? removeFromCompare(vehicleId) : addToCompare(vehicleId))}
      >
        <GitCompare size={16} />
        {comparing ? "Remove from compare" : "Add to compare"}
      </Button>
    </div>
  );
}