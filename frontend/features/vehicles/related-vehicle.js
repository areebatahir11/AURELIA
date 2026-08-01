import Link from "next/link";
import Image from "next/image";
import { vehicleService } from "@/services/vehicle.service";
import { formatCurrency } from "@/utils/formatters";
import { getFallbackImage } from "@/constants/vehicleimages";

export default async function RelatedVehicles({ vehicle }) {
  let related = [];

  try {
    const { data: sameBrand } = await vehicleService.getByBrand(vehicle.brandSlug);
    related = sameBrand.filter((item) => item.id !== vehicle.id);

    if (related.length === 0) {
      const { data: allVehicles } = await vehicleService.getAll();
      related = allVehicles.filter((item) => item.category === vehicle.category && item.id !== vehicle.id);
    }
  } catch (error) {
    console.error("Failed to load related vehicles:", error.message);
    return null;
  }

  related = related.slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="border-t border-hairline px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-display text-2xl text-ivory">You may also consider</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {related.map((item) => {
            const displayImage = item.images?.[0] || getFallbackImage(item.brand, item.id?.length ?? 0);

            return (
              <Link key={item.id} href={`/collection/${item.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden border border-hairline bg-surface">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-graphite">
                      {item.name}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-graphite">
                    {item.brand}
                  </span>
                  <h3 className="font-display text-lg text-ivory group-hover:text-gold">{item.name}</h3>
                  <p className="font-mono text-sm text-gold">{formatCurrency(item.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}