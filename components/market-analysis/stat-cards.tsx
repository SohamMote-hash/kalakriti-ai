import { Layers, TrendingUp, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function MarketStatCards({
  similarCount,
  minPrice,
  maxPrice,
  averagePrice,
  suggestedMin,
  suggestedMax,
}: {
  similarCount: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  suggestedMin: number;
  suggestedMax: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-info-soft text-info">
          <Layers className="h-4.5 w-4.5" />
        </span>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-foreground-muted">
          Similar Products Found
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-foreground">{similarCount}</p>
      </Card>
      <Card className="p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-soft text-secondary">
          <TrendingUp className="h-4.5 w-4.5" />
        </span>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-foreground-muted">
          Price Range
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-foreground">
          {formatCurrency(minPrice)} – {formatCurrency(maxPrice)}
        </p>
      </Card>
      <Card className="p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-[#7a5c1a]">
          <Layers className="h-4.5 w-4.5" />
        </span>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-foreground-muted">
          Marketplace Average
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-foreground">
          {formatCurrency(averagePrice)}
        </p>
      </Card>
      <Card className="p-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Target className="h-4.5 w-4.5" />
        </span>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-foreground-muted">
          Suggested Position
        </p>
        <p className="mt-1 font-display text-xl font-semibold text-foreground">
          {formatCurrency(suggestedMin)} – {formatCurrency(suggestedMax)}
        </p>
      </Card>
    </div>
  );
}
