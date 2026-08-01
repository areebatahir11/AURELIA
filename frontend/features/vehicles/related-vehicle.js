import Link from "next/link";
import { vehicleService } from "@/services/vehicle.service";
import { formatCurrency } from "@/utils/formatters";

export default async function RelatedVehicles({ vehicle }) {
  const { data: sameBrand } = await vehicleService.getByBrand(vehicle.brandSlug);
  let related = sameBrand.filter((item) => item.id !== vehicle.id);

  if (related.length === 0) {
    const { data: allVehicles } = await vehicleService.getAll();
    related = allVehicles.filter((item) => item.category === vehicle.category && item.id !== vehicle.id);
  }

  related = related.slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="border-t border-hairline px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-display text-2xl text-ivory">You may also consider</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {related.map((item) => (
            <Link key={item.id} href={`/collection/${item.slug}`} className="group block">
              <div className="flex aspect-[4/3] items-center justify-center border border-hairline bg-surface font-mono text-xs text-graphite">
                {item.name}
              </div>
              <div className="mt-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-graphite">
                  {item.brand}
                </span>
                <h3 className="font-display text-lg text-ivory group-hover:text-gold">{item.name}</h3>
                <p className="font-mono text-sm text-gold">{formatCurrency(item.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}