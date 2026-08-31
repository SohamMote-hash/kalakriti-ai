"use client";

import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";

export function WhatIfSimulator({
  sellingPrice,
  productionQuantity,
  onSellingPriceChange,
  onProductionQuantityChange,
  estimatedProfit,
}: {
  sellingPrice: number;
  productionQuantity: number;
  onSellingPriceChange: (v: number) => void;
  onProductionQuantityChange: (v: number) => void;
  estimatedProfit: number;
}) {
  return (
    <Card className="p-5">
      <p className="mb-1 font-display text-base font-semibold text-foreground">What If?</p>
      <p className="mb-5 text-xs text-foreground-muted">
        Drag the sliders to see how price and volume change your profit — live.
      </p>

      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Selling Price</span>
            <span className="font-display font-semibold text-primary">{formatCurrency(sellingPrice)}</span>
          </div>
          <Slider
            value={[sellingPrice]}
            min={50}
            max={3000}
            step={10}
            onValueChange={([v]) => onSellingPriceChange(v)}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Monthly Production Quantity</span>
            <span className="font-display font-semibold text-primary">{productionQuantity} units</span>
          </div>
          <Slider
            value={[productionQuantity]}
            min={5}
            max={500}
            step={5}
            onValueChange={([v]) => onProductionQuantityChange(v)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-surface-muted p-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
          Projected Monthly Profit
        </p>
        <p
          className={`mt-1 font-display text-2xl font-semibold ${
            estimatedProfit >= 0 ? "text-success" : "text-danger"
          }`}
        >
          {formatCurrency(estimatedProfit)}
        </p>
      </div>
    </Card>
  );
}
