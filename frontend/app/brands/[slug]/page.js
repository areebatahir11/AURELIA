import { notFound } from "next/navigation";
import { brandService } from "@/services/brand.service";
import { vehicleService } from "@/services/vehicle.service";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import VehicleCard from "@/features/vehicles/VehicleCard";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: brand } = await brandService.getBySlug(slug);
  return { title: brand ? `${brand.name} | AURELIA` : "Brand not found | AURELIA" };
}

export default async function BrandDetailPage({ params }) {
  const { slug } = await params;
  const { data: brand } = await brandService.getBySlug(slug);

  if (!brand) {
    notFound();
  }

  const { data: vehicles } = await vehicleService.getByBrand(brand.slug);

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={`${brand.country} · Est. ${brand.founded}`}
          title={brand.name}
          description={brand.description}
        />

        <div className="mt-16">
          {vehicles.length === 0 ? (
            <EmptyState
              title={`No ${brand.name} vehicles listed right now`}
              description="New inventory from this marque is added regularly — check back soon."
            />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}