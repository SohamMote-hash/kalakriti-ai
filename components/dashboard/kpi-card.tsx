import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  deltaTone?: "positive" | "warning";
  iconTone?: "primary" | "secondary" | "accent" | "info";
}

const TONE_CLASSES: Record<NonNullable<KpiCardProps["iconTone"]>, string> = {
  primary: "bg-primary-soft text-primary",
  secondary: "bg-secondary-soft text-secondary",
  accent: "bg-accent-soft text-[#7a5c1a]",
  info: "bg-info-soft text-info",
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaTone = "positive",
  iconTone = "primary",
}: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", TONE_CLASSES[iconTone])}>
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </div>
      {delta && (
        <p
          className={cn(
            "mt-3 text-xs font-medium",
            deltaTone === "positive" ? "text-success" : "text-warning",
          )}
        >
          {delta}
        </p>
      )}
    </Card>
  );
}
