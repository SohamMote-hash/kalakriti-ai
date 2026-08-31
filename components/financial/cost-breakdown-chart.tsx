"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORICAL } from "@/lib/chartColors";
import { formatCurrency } from "@/lib/utils";

export function CostBreakdownChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>Where each rupee of your cost per unit goes.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              stroke="#faf6ef"
              strokeWidth={2}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={CATEGORICAL[i % CATEGORICAL.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 10, border: "1px solid #e7dcc7", fontSize: 12, background: "#ffffff" }}
              formatter={(value, name) => [formatCurrency(Number(value ?? 0)), name]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-foreground-muted">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
