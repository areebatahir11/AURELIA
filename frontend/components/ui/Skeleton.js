import { cn } from "@/lib/cn";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={cn("animate-pulse bg-surface border border-hairline", className)}
      aria-hidden="true"
    />
  );
}
