"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CostBreakdownChart } from "@/components/financial/cost-breakdown-chart";
import { RevenueCostChart } from "@/components/financial/revenue-cost-chart";
import { ProfitSummaryCard } from "@/components/financial/profit-summary-card";
import { WhatIfSimulator } from "@/components/financial/what-if-simulator";
import { calculateFinancials, costBreakdown, defaultFinancialInputs } from "@/lib/financial/calculations";
import type { FinancialInputs } from "@/types";

const FIELDS: { key: keyof FinancialInputs; label: string; prefix?: string }[] = [
  { key: "materialCost", label: "Raw Material Cost", prefix: "₹" },
  { key: "labourCost", label: "Labour Cost", prefix: "₹" },
  { key: "packagingCost", label: "Packaging Cost", prefix: "₹" },
  { key: "transportCost", label: "Transportation Cost", prefix: "₹" },
  { key: "otherCost", label: "Other Expenses", prefix: "₹" },
  { key: "productionQuantity", label: "Monthly Production Quantity" },
  { key: "sellingPrice", label: "Selling Price", prefix: "₹" },
];

export default function FinancialPlannerPage() {
  const [inputs, setInputs] = useState<FinancialInputs>(defaultFinancialInputs);

  const results = useMemo(() => calculateFinancials(inputs), [inputs]);
  const breakdown = useMemo(() => costBreakdown(inputs), [inputs]);

  function setField(key: keyof FinancialInputs, value: number) {
    setInputs((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
        Financial Planner
      </h1>
      <p className="mt-1 text-foreground-muted">
        Plan your costs, pricing, and profit for a single product line.
      </p>

      <Card className="mt-6 p-5">
        <p className="mb-4 font-display text-base font-semibold text-foreground">Monthly Inputs</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FIELDS.map((field) => (
            <div key={field.key} className="grid gap-1.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type="number"
                min={0}
                value={inputs[field.key]}
                onChange={(e) => setField(field.key, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ProfitSummaryCard results={results} />
        <CostBreakdownChart data={breakdown} />
        <RevenueCostChart
          totalRevenue={results.totalRevenue}
          totalCost={results.totalMonthlyCost}
          estimatedProfit={results.estimatedProfit}
        />
      </div>

      <div className="mt-6">
        <WhatIfSimulator
          sellingPrice={inputs.sellingPrice}
          productionQuantity={inputs.productionQuantity}
          onSellingPriceChange={(v) => setField("sellingPrice", v)}
          onProductionQuantityChange={(v) => setField("productionQuantity", v)}
          estimatedProfit={results.estimatedProfit}
        />
      </div>
    </div>
  );
}
