"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORICAL, CHART_CHROME } from "@/lib/chartColors";

export function CategoryComparisonChart({
  data,
  highlightCategory,
}: {
  data: { category: string; averagePrice: number; count: number }[];
  highlightCategory: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Comparison</CardTitle>
        <CardDescription>Average price by category across the marketplace.</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke={CHART_CHROME.grid} />
            <XAxis
              type="number"
              tick={{ fill: CHART_CHROME.mutedText, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: CHART_CHROME.mutedText, fontSize: 11 }}
              axisLine={{ stroke: CHART_CHROME.axis }}
              tickLine={false}
              width={110}
            />
            <Tooltip
              cursor={{ fill: "rgba(191,91,48,0.06)" }}
              contentStyle={{ borderRadius: 10, border: "1px solid #e7dcc7", fontSize: 12, background: "#ffffff" }}
              formatter={(value, _name, item) => [
                `₹${value} avg · ${item.payload.count} products`,
                item.payload.category,
              ]}
            />
            <Bar dataKey="averagePrice" radius={[0, 4, 4, 0]} maxBarSize={22}>
              {data.map((entry, i) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORICAL[i % CATEGORICAL.length]}
                  fillOpacity={entry.category === highlightCategory ? 1 : 0.55}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
