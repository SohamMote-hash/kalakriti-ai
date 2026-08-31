import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { step: 1, label: "Upload Product" },
  { step: 2, label: "AI Processing" },
  { step: 3, label: "Review Listing" },
  { step: 4, label: "Preview & Publish" },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => (
        <div key={s.step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                current > s.step
                  ? "border-primary bg-primary text-primary-foreground"
                  : current === s.step
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border-strong bg-surface text-foreground-muted",
              )}
            >
              {current > s.step ? <Check className="h-4 w-4" /> : s.step}
            </div>
            <span
              className={cn(
                "hidden text-center text-[11px] font-medium sm:block",
                current >= s.step ? "text-foreground" : "text-foreground-muted",
              )}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "mx-2 h-0.5 flex-1 rounded-full transition-colors",
                current > s.step ? "bg-primary" : "bg-border",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
