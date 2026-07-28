import Link from "next/link";

export default function BrandCard({ brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex flex-col justify-between border border-hairline p-8 transition-colors hover:border-gold"
    >
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-graphite">
          {brand.country} · Est. {brand.founded}
        </span>
        <h3 className="mt-3 font-display text-2xl text-ivory">{brand.name}</h3>
        <p className="mt-3 font-body text-sm leading-relaxed text-graphite">{brand.description}</p>
      </div>
      <span className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
        View inventory →
      </span>
    </Link>
  );
}