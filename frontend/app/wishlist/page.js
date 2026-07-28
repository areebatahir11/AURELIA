"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { vehicleService } from "@/services/vehicle.service";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import VehicleCard from "@/features/vehicles/VehicleCard";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [vehicles, setVehicles] = useState(null);
  const router = useRouter();

  useEffect(() => {
    vehicleService.getAll().then(({ data }) => {
      setVehicles(data.filter((vehicle) => wishlist.includes(vehicle.id)));
    });
  }, [wishlist]);

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Saved" title="Your Wishlist" />

        {vehicles === null ? (
          <div className="mt-16 flex justify-center">
            <Loader />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Your wishlist is empty"
              description="Save vehicles you're considering by tapping the heart icon on any listing."
              actionLabel="Browse the collection"
              onAction={() => router.push("/collection")}
            />
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}