import { testimonialService } from "@/services/testimonial.service";
import SectionHeader from "@/components/ui/SectionHeader";

export default async function Testimonials() {
  const { data: testimonials } = await testimonialService.getAll();

  return (
    <section className="border-t border-hairline px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="From Our Clients" title="Told in their own words" align="center" className="mx-auto" />

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border border-hairline p-8">
              <p className="font-display text-lg italic leading-relaxed text-ivory">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-hairline pt-4">
                <p className="font-body text-sm text-ivory">{testimonial.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-graphite">
                  {testimonial.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}