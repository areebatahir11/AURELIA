"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { isValidEmail } from "@/utils/validators";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  function onSubmit(formValues) {
    // TODO: replace with a real endpoint once FastAPI /contact route exists
    console.log("Contact form submitted:", formValues);
    setIsSubmitted(true);
    reset();
  }

  return (
    <div className="px-6 pt-32 pb-24 lg:px-12">
      <div className="mx-auto max-w-xl">
        <SectionHeader eyebrow="Get in Touch" title="Contact Aurelia" />

        {isSubmitted ? (
          <p className="mt-10 font-body text-gold">
            Thank you — a member of our concierge team will be in touch shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
                Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory focus:border-gold focus:outline-none"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  validate: (value) => isValidEmail(value) || "Enter a valid email",
                })}
                className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory focus:border-gold focus:outline-none"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-[0.1em] text-graphite">
                Message
              </label>
              <textarea
                rows={5}
                {...register("message", { required: "Message is required" })}
                className="w-full border border-hairline bg-transparent px-4 py-3 font-body text-sm text-ivory focus:border-gold focus:outline-none"
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
            </div>

            <Button type="submit" variant="primary">
              Send message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}