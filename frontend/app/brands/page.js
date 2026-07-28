import { brandService } from "@/services/brand.service";
import SectionHeader from "@/components/ui/SectionHeader";
import BrandCard from "@/features/brands/brandcard";

export const metadata = {
  title: "Brand Directory | AURELIA",
};

export default async function BrandsPage() {
  const { data: brands } = await brandService.getAll();

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Our Partners"
          title="Brand Directory"
          description="Eleven marques, each represented with the same standard of verification and care."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  );
}