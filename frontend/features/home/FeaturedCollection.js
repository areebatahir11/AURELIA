import { vehicleService } from "@/services/vehicle.service";
import SectionHeader from "@/components/ui/SectionHeader";
import VehicleCard from "@/features/vehicles/VehicleCard";

export default async function FeaturedCollection() {
  const featuredRefs = await vehicleService.getFeatured();
  const allVehicles = await vehicleService.getAll();
  const vehicles = featuredRefs.data
    .map((ref) => allVehicles.data.find((car) => car.id === ref.id))
    .filter(Boolean);

  return (
    <section className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Curated Selection"
          title="The Featured Collection"
          description="A rotating selection of the most sought-after vehicles currently in our care."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}