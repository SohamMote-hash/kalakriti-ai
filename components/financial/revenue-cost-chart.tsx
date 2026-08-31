"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORICAL, CHART_CHROME } from "@/lib/chartColors";
import { formatCurrency } from "@/lib/utils";

export function RevenueCostChart({
  totalRevenue,
  totalCost,
  estimatedProfit,
}: {
  totalRevenue: number;
  totalCost: number;
  estimatedProfit: number;
}) {
  const data = [{ name: "This Month", Revenue: totalRevenue, Cost: totalCost, Profit: Math.max(0, estimatedProfit) }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Cost</CardTitle>
        <CardDescription>Monthly revenue against total production cost.</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barGap={12}>
            <CartesianGrid vertical={false} stroke={CHART_CHROME.grid} />
            <XAxis dataKey="name" tick={{ fill: CHART_CHROME.mutedText, fontSize: 11 }} axisLine={{ stroke: CHART_CHROME.axis }} tickLine={false} />
            <YAxis
              tick={{ fill: CHART_CHROME.mutedText, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid #e7dcc7", fontSize: 12, background: "#ffffff" }}
              formatter={(value) => formatCurrency(Number(value ?? 0))}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-foreground-muted">{value}</span>}
            />
            <Bar dataKey="Revenue" fill={CATEGORICAL[0]} radius={[4, 4, 0, 0]} maxBarSize={64} />
            <Bar dataKey="Cost" fill={CATEGORICAL[1]} radius={[4, 4, 0, 0]} maxBarSize={64} />
            <Bar dataKey="Profit" fill={CATEGORICAL[2]} radius={[4, 4, 0, 0]} maxBarSize={64} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
