import { notFound } from "next/navigation";
import { vehicleService } from "@/services/vehicle.service";
import { formatCurrency, formatMileage } from "@/utils/formatters";
import Badge from "@/components/ui/Badge";
import SpecPlate from "@/features/vehicles/specplate";
import VehicleActions from "@/features/vehicles/vehicleaction";
import RelatedVehicles from "@/features/vehicles/related-vehicle";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: vehicle } = await vehicleService.getBySlug(slug);
  return { title: vehicle ? `${vehicle.name} | AURELIA` : "Vehicle not found | AURELIA" };
}

export default async function VehicleDetailPage({ params }) {
  const { slug } = await params;
  const { data: vehicle } = await vehicleService.getBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <div>
      <div className="px-6 pt-32 pb-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="flex aspect-[4/3] items-center justify-center border border-hairline bg-surface font-mono text-xs text-graphite">
            {vehicle.name} — image placeholder
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-graphite">
                {vehicle.brand}
              </span>
              {vehicle.tags?.map((tag) => (
                <Badge key={tag}>{tag.replace("-", " ")}</Badge>
              ))}
            </div>

            <h1 className="mb-3 font-display text-4xl text-ivory md:text-5xl">{vehicle.name}</h1>
            <p className="mb-6 font-mono text-2xl text-gold">{formatCurrency(vehicle.price)}</p>
            <p className="mb-8 max-w-lg font-body text-base leading-relaxed text-graphite">
              {vehicle.description}
            </p>

            <div className="mb-8 flex gap-8 border-y border-hairline py-4 font-mono text-xs uppercase tracking-[0.1em] text-graphite">
              <span>{vehicle.year}</span>
              <span>{formatMileage(vehicle.mileage)}</span>
              <span>{vehicle.category}</span>
            </div>

            <div className="mb-10">
              <VehicleActions vehicle={vehicle} />
            </div>

            <SpecPlate vehicle={vehicle} />
          </div>
        </div>
      </div>

      <RelatedVehicles vehicle={vehicle} />
    </div>
  );
}