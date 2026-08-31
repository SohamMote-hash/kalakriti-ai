"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AIBadge } from "@/components/shared/ai-badge";
import { mockGenerateDashboardInsights } from "@/lib/ai/marketInsights";
import type { AIMarketInsight, Product } from "@/types";
import { cn } from "@/lib/utils";

const TONE_STYLE = {
  positive: { icon: TrendingUp, className: "bg-success-soft text-success" },
  warning: { icon: AlertTriangle, className: "bg-warning-soft text-warning" },
  neutral: { icon: Lightbulb, className: "bg-info-soft text-info" },
};

export function AIInsights({ products }: { products: Product[] }) {
  const [insights, setInsights] = useState<AIMarketInsight[]>(() =>
    mockGenerateDashboardInsights(products),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.insights?.length) setInsights(data.insights);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Suggestions based on your product performance.</CardDescription>
        </div>
        <AIBadge />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        {!loading &&
          insights.map((insight, i) => {
            const tone = TONE_STYLE[insight.tone];
            const Icon = tone.icon;
            return (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3.5">
                <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", tone.className)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{insight.headline}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-foreground-muted">
                    {insight.detail}
                  </p>
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
