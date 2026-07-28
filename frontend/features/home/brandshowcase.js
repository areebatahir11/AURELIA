import Link from "next/link";
import { brandService } from "@/services/brand.service";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function BrandShowcase() {
  const { data: brands } = await brandService.getAll();

  return (
    <section className="border-t border-hairline px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Our Marques"
          title="Eleven brands. One standard."
          description="Every marque in our collection is chosen for what it represents, not just what it sells."
        />

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden border border-hairline sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group flex aspect-square flex-col items-center justify-center gap-2 border-hairline bg-void p-6 text-center transition-colors hover:bg-surface"
            >
              <span className="font-display text-lg text-ivory transition-colors group-hover:text-gold">
                {brand.name}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-graphite">
                {brand.country}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}