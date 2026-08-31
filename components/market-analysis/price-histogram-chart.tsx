"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CHART_CHROME } from "@/lib/chartColors";

export function PriceHistogramChart({
  data,
  currentPrice,
}: {
  data: { bucket: string; count: number }[];
  currentPrice: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Distribution</CardTitle>
        <CardDescription>How similar marketplace products are priced.</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={CHART_CHROME.grid} />
            <XAxis
              dataKey="bucket"
              tick={{ fill: CHART_CHROME.mutedText, fontSize: 10 }}
              axisLine={{ stroke: CHART_CHROME.axis }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: CHART_CHROME.mutedText, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={28}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(191,91,48,0.08)" }}
              contentStyle={{ borderRadius: 10, border: "1px solid #e7dcc7", fontSize: 12, background: "#ffffff" }}
              formatter={(value) => [`${value} products`, "Count"]}
            />
            <Bar dataKey="count" fill="#2a78d6" radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-2 text-center text-xs text-foreground-muted">
          Your product is priced at ₹{currentPrice}
        </p>
      </CardContent>
    </Card>
  );
}
