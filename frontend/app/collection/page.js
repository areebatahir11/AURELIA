import { vehicleService } from "@/services/vehicle.service";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import VehicleCard from "@/features/vehicles/VehicleCard";

export const metadata = {
  title: "The Collection | AURELIA",
};

export default async function CollectionPage() {
  const { data: vehicles } = await vehicleService.getAll();

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Full Inventory"
          title="The Collection"
          description={`${vehicles.length} vehicles currently available, each independently verified before listing.`}
        />

        {vehicles.length === 0 ? (
          <EmptyState
            title="No vehicles match right now"
            description="Check back shortly, or speak with a concierge about sourcing something specific."
          />
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