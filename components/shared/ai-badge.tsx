import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIBadge({ className, label = "AI Generated" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary-soft to-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary-hover",
        className,
      )}
    >
      <Sparkles className="h-3 w-3" />
      {label}
    </span>
  );
}
