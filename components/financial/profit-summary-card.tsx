import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { FinancialResults } from "@/types";
import { cn } from "@/lib/utils";

export function ProfitSummaryCard({ results }: { results: FinancialResults }) {
  const items = [
    { label: "Total Cost Per Unit", value: formatCurrency(results.costPerUnit) },
    { label: "Total Monthly Cost", value: formatCurrency(results.totalMonthlyCost) },
    { label: "Total Revenue", value: formatCurrency(results.totalRevenue) },
    {
      label: "Estimated Profit",
      value: formatCurrency(results.estimatedProfit),
      tone: results.estimatedProfit >= 0 ? "success" : "danger",
    },
    {
      label: "Profit Margin",
      value: `${results.profitMarginPercent.toFixed(1)}%`,
      tone: results.profitMarginPercent >= 0 ? "success" : "danger",
    },
    {
      label: "Break-Even Point",
      value: Number.isFinite(results.breakEvenUnits) ? `${results.breakEvenUnits} units` : "Not reachable",
    },
  ];

  return (
    <Card className="p-5">
      <p className="mb-1 font-display text-base font-semibold text-foreground">Profit Summary</p>
      <p className="mb-4 text-xs text-foreground-muted">
        Profit per unit: {formatCurrency(results.profitPerUnit)}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-foreground-muted">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1 font-display text-lg font-semibold text-foreground",
                item.tone === "success" && "text-success",
                item.tone === "danger" && "text-danger",
              )}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
