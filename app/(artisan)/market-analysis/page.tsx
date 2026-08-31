"use client";

import { useMemo, useState } from "react";
import { Database } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ProductImage } from "@/components/shared/product-image";
import { MarketStatCards } from "@/components/market-analysis/stat-cards";
import { PriceHistogramChart } from "@/components/market-analysis/price-histogram-chart";
import { CategoryComparisonChart } from "@/components/market-analysis/category-comparison-chart";
import { CompetitionIndicator } from "@/components/market-analysis/competition-indicator";
import { AIPricingInsight } from "@/components/market-analysis/ai-pricing-insight";
import { useAppStore } from "@/lib/store";
import { currentArtisan } from "@/data/seedArtisans";
import { runMarketAnalysis } from "@/lib/analytics/marketAnalysis";
import { suggestPriceRange } from "@/lib/ai/pricing";
import { formatCurrency } from "@/lib/utils";

export default function MarketAnalysisPage() {
  const products = useAppStore((s) => s.products);
  const myProducts = useMemo(
    () => products.filter((p) => p.artisanId === currentArtisan.id && p.status === "published"),
    [products],
  );

  const [selectedId, setSelectedId] = useState(myProducts[0]?.id ?? "");
  const selected = myProducts.find((p) => p.id === selectedId) ?? myProducts[0];

  const analysis = useMemo(() => {
    if (!selected) return null;
    return runMarketAnalysis(selected, products);
  }, [selected, products]);

  const pricing = useMemo(() => {
    if (!selected || !analysis) return null;
    return suggestPriceRange(selected.price, analysis.averagePrice, analysis.suggestedMin, analysis.suggestedMax);
  }, [selected, analysis]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
        Market Analysis
      </h1>
      <p className="mt-1 text-foreground-muted">
        See how your pricing compares to similar products on the marketplace.
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-info-soft px-3.5 py-2 text-xs text-info">
        <Database className="h-3.5 w-3.5 shrink-0" />
        Insights are generated using products listed on the Kalakriti marketplace only.
      </div>

      {myProducts.length === 0 ? (
        <Card className="mt-6 p-10 text-center text-sm text-foreground-muted">
          Publish a product first to run market analysis against it.
        </Card>
      ) : (
        <>
          <div className="mt-6 max-w-sm">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Selected Product
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

          {selected && analysis && pricing && (
            <div className="mt-6 flex flex-col gap-6">
              <Card className="flex items-center gap-4 p-4">
                <ProductImage category={selected.category} className="h-16 w-16 rounded-lg" iconClassName="h-6 w-6" />
                <div>
                  <p className="font-display text-base font-semibold text-foreground">{selected.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {selected.category} · Currently priced at {formatCurrency(selected.price)}
                  </p>
                </div>
              </Card>

              <MarketStatCards
                similarCount={analysis.similarProductCount}
                minPrice={analysis.minPrice}
                maxPrice={analysis.maxPrice}
                averagePrice={analysis.averagePrice}
                suggestedMin={analysis.suggestedMin}
                suggestedMax={analysis.suggestedMax}
              />

              <div className="grid gap-6 lg:grid-cols-3">
                <PriceHistogramChart data={analysis.priceHistogram} currentPrice={selected.price} />
                <CategoryComparisonChart
                  data={analysis.categoryComparison}
                  highlightCategory={selected.category}
                />
                <CompetitionIndicator level={analysis.competitionLevel} />
              </div>

              <AIPricingInsight reasoning={pricing.reasoning} />

              {analysis.similarProducts.length > 0 && (
                <Card className="p-5">
                  <p className="mb-3 font-display text-base font-semibold text-foreground">
                    Similar Products on the Marketplace
                  </p>
                  <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
                    {analysis.similarProducts.slice(0, 8).map(({ product, score }) => (
                      <div key={product.id} className="flex w-40 shrink-0 flex-col gap-2 rounded-lg border border-border p-2">
                        <ProductImage category={product.category} className="h-24 w-full rounded-md" iconClassName="h-6 w-6" />
                        <div>
                          <p className="line-clamp-1 text-xs font-medium text-foreground">{product.name}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-primary">{formatCurrency(product.price)}</p>
                            <p className="text-[10px] text-foreground-muted">{Math.round(score * 100)}% match</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
