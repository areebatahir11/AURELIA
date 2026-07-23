import { cn } from "@/lib/cn";

export default function Badge({ children, tone = "gold", className = "" }) {
  const tones = {
    gold: "border-gold/40 text-gold",
    ivory: "border-hairline text-ivory",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
