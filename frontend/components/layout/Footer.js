import Link from "next/link";
import { FOOTER_LINKS } from "@/constants/navigation";
import { SITE_CONFIG } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-void px-6 pb-10 pt-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <span className="font-display text-2xl tracking-[0.2em] text-ivory">
              {SITE_CONFIG.name}
            </span>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-graphite">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-gold">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-ivory/70 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 font-mono text-xs text-graphite md:flex-row">
          <span>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</span>
          <span>An independent multi-brand dealership. Not affiliated with any manufacturer.</span>
        </div>
      </div>
    </footer>
  );
}