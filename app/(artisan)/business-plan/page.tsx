"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Download, FileText, Pencil, RefreshCw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIBadge } from "@/components/shared/ai-badge";
import { PlanDocument } from "@/components/business-plan/plan-document";
import { useAppStore } from "@/lib/store";
import { currentArtisan } from "@/data/seedArtisans";
import { runMarketAnalysis } from "@/lib/analytics/marketAnalysis";
import { calculateFinancials, defaultFinancialInputs } from "@/lib/financial/calculations";
import { estimateBasePrice } from "@/lib/ai/pricing";
import type { AIBusinessPlan, AIBusinessPlanSection } from "@/types";
import type { BusinessPlanContext } from "@/lib/ai/businessPlan";

const DATA_SOURCES = [
  "Product Information",
  "Financial Data",
  "Marketplace Analysis",
  "Pricing Strategy",
];

export default function BusinessPlanPage() {
  const products = useAppStore((s) => s.products);
  const myProducts = useMemo(
    () => products.filter((p) => p.artisanId === currentArtisan.id && p.status === "published"),
    [products],
  );

  const [selectedId, setSelectedId] = useState(myProducts[0]?.id ?? "");
  const selected = myProducts.find((p) => p.id === selectedId) ?? myProducts[0];

  const [plan, setPlan] = useState<AIBusinessPlan | null>(null);
  const [source, setSource] = useState<"ai" | "mock" | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleGenerate() {
    if (!selected) return;
    setLoading(true);
    try {
      const financialInputs = {
        ...defaultFinancialInputs,
        sellingPrice: selected.price || estimateBasePrice(selected.category, selected.material),
      };
      const financialResults = calculateFinancials(financialInputs);
      const marketAnalysis = runMarketAnalysis(selected, products);

      const context: BusinessPlanContext = {
        product: selected,
        artisan: currentArtisan,
        financialInputs,
        financialResults,
        marketAnalysis,
      };

      const res = await fetch("/api/ai/business-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      });
      const data = (await res.json()) as { plan: AIBusinessPlan; source: "ai" | "mock" };
      setPlan(data.plan);
      setSource(data.source);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  }

  function updateSection(index: number, content: string) {
    setPlan((prev) => {
      if (!prev) return prev;
      const sections: AIBusinessPlanSection[] = prev.sections.map((s, i) =>
        i === index ? { ...s, content } : s,
      );
      return { ...prev, sections };
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
        AI Business Plan Generator
      </h1>
      <p className="mt-1 text-foreground-muted">
        Turn your product, pricing, and market data into a complete business plan.
      </p>

      {myProducts.length === 0 ? (
        <Card className="mt-6 p-10 text-center text-sm text-foreground-muted">
          Publish a product first to generate a business plan for it.
        </Card>
      ) : (
        <>
          <Card className="mt-6 p-5 print:hidden">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-sm flex-1">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  Product
                </label>
                <Select value={selected?.id} onValueChange={setSelectedId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {myProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" onClick={handleGenerate} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {plan ? "Regenerate Business Plan" : "Generate Business Plan"}
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
              {DATA_SOURCES.map((src) => (
                <span key={src} className="flex items-center gap-1.5 text-xs text-foreground-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {src}
                </span>
              ))}
            </div>
          </Card>

          {loading && (
            <Card className="mt-6 flex flex-col items-center gap-3 p-14 text-center">
              <FileText className="h-8 w-8 animate-pulse text-primary" />
              <p className="text-sm text-foreground-muted">
                Analysing your product, financials, and market position…
              </p>
            </Card>
          )}

          {!loading && plan && (
            <>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <AIBadge label={source === "ai" ? "AI Generated Business Plan" : "AI Generated Business Plan (offline mock)"} />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
                    <Pencil className="h-3.5 w-3.5" /> {editing ? "Done Editing" : "Edit Plan"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerate}>
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </Button>
                  <Button size="sm" onClick={() => window.print()}>
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <PlanDocument
                  productName={plan.productName}
                  generatedAt={plan.generatedAt}
                  sections={plan.sections}
                  editing={editing}
                  onSectionChange={updateSection}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
