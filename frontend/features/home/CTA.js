"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="border-t border-hairline px-6 py-28 text-center lg:px-12">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-4xl leading-tight text-ivory md:text-5xl">
          Your next vehicle is already here
        </h2>
        <p className="mt-4 font-body text-graphite">
          Speak with a concierge, or browse the full collection at your own pace.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button as={Link} href="/collection" variant="primary">
            Browse the collection
          </Button>
          <Button as={Link} href="/concierge" variant="outline">
            Talk to a concierge
          </Button>
        </div>
      </div>
    </section>
  );
}