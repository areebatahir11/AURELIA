"use client";

import { cn } from "@/lib/cn";

const VARIANTS = {
  primary: "bg-gold text-void hover:bg-goldBright",
  outline: "border border-hairline text-ivory hover:border-gold hover:text-gold bg-transparent",
  ghost: "text-ivory hover:text-gold bg-transparent",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 font-body uppercase tracking-[0.15em]",
        "transition-all duration-300 ease-out disabled:opacity-40 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
