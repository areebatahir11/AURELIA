import SectionHeader from "@/components/ui/SectionHeader";
import { SITE_CONFIG } from "@/config/site";

export const metadata = {
  title: "About | AURELIA",
};

export default function AboutPage() {
  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="About Us" title={`The Story of ${SITE_CONFIG.name}`} />

        <div className="mt-10 space-y-6 font-body text-base leading-relaxed text-graphite">
          <p>
            {SITE_CONFIG.name} exists for a simple reason: buying an extraordinary car should feel
            like an extraordinary experience — not a transaction lost among a thousand others.
          </p>
          <p>
            We are an independent, multi-brand dealership. We are not owned by any manufacturer,
            and we answer to one party only: the client in front of us. Every vehicle that enters
            our collection — from Porsche to Rolls-Royce, Ferrari to Tesla — passes the same
            standard of inspection, documentation, and provenance review before it is ever listed.
          </p>
          <p>
            Our concierge team exists to remove friction, not add to it. One advisor, reachable
            directly, from first inquiry through delivery.
          </p>
        </div>
      </div>
    </div>
  );
}