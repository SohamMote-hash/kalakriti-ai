"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BuyerCard } from "@/components/b2b/buyer-card";
import { seedBuyers } from "@/data/seedBuyers";
import { cn } from "@/lib/utils";
import type { BuyerCategory } from "@/types";

const CATEGORIES: BuyerCategory[] = [
  "Retailer",
  "Interior Designer",
  "Hotel",
  "Gift Shop",
  "Wholesaler",
  "Corporate Buyer",
];

export default function B2BOpportunitiesPage() {
  const [filter, setFilter] = useState<"All" | BuyerCategory>("All");

  const buyers = useMemo(() => {
    const list =
      filter === "All" ? seedBuyers : seedBuyers.filter((b) => b.category === filter);
    return [...list].sort((a, b) => b.matchScore - a.matchScore);
  }, [filter]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
        B2B Buyer Discovery
      </h1>
      <p className="mt-1 text-foreground-muted">
        Retailers, designers, and wholesalers matched to your products by AI.
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-info-soft px-3.5 py-2 text-xs text-info">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        Matching is AI-assisted, based on your product category, production capacity, and pricing.
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)}>
            <Badge
              variant={filter === c ? "default" : "outline"}
              className={cn("cursor-pointer px-3 py-1 text-xs", filter === c && "shadow-sm")}
            >
              {c}
            </Badge>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {buyers.map((buyer) => (
          <BuyerCard key={buyer.id} buyer={buyer} />
        ))}
      </div>
    </div>
  );
}
