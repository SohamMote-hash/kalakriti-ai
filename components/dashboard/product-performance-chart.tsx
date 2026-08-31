"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CHART_CHROME } from "@/lib/chartColors";
import type { Product } from "@/types";

export function ProductPerformanceChart({ products }: { products: Product[] }) {
  const data = [...products]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
    .map((p) => ({
      name: p.name.length > 18 ? `${p.name.slice(0, 18)}…` : p.name,
      views: p.views,
      enquiries: p.enquiries,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
        <CardDescription>Views across your published products this month.</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={CHART_CHROME.grid} />
            <XAxis
              dataKey="name"
              tick={{ fill: CHART_CHROME.mutedText, fontSize: 11 }}
              axisLine={{ stroke: CHART_CHROME.axis }}
              tickLine={false}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: CHART_CHROME.mutedText, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip
              cursor={{ fill: "rgba(191,91,48,0.08)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e7dcc7",
                fontSize: 12,
                background: "#ffffff",
              }}
            />
            <Bar dataKey="views" name="Views" fill="#bf5b30" radius={[4, 4, 0, 0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
