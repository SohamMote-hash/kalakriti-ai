import type { CraftCategory } from "@/types";

const CATEGORY_BASE_PRICE: Record<CraftCategory, number> = {
  "Bamboo Craft": 500,
  Handloom: 750,
  Pottery: 650,
  Jewellery: 450,
  Woodwork: 800,
  "Traditional Art": 900,
  Textiles: 700,
  "Home Decor": 550,
  "Metal Craft": 600,
};

const PREMIUM_MATERIALS = ["silk", "brass", "sheesham", "teak", "quartz"];

export function estimateBasePrice(category: CraftCategory, material: string): number {
  const base = CATEGORY_BASE_PRICE[category] ?? 550;
  const materialLower = material.toLowerCase();
  const premium = PREMIUM_MATERIALS.some((m) => materialLower.includes(m));
  const adjusted = premium ? base * 1.3 : base;
  return Math.round(adjusted / 10) * 10;
}

export interface PricingRecommendation {
  suggestedMin: number;
  suggestedMax: number;
  reasoning: string;
}

export function suggestPriceRange(
  currentPrice: number,
  marketplaceAverage: number,
  suggestedMin: number,
  suggestedMax: number,
): PricingRecommendation {
  const diffPercent =
    marketplaceAverage > 0
      ? Math.round(((currentPrice - marketplaceAverage) / marketplaceAverage) * 100)
      : 0;

  let reasoning: string;
  if (diffPercent <= -10) {
    reasoning = `Your current price of ₹${currentPrice} is approximately ${Math.abs(diffPercent)}% below the marketplace average. Based on similar products and material category, a range between ₹${suggestedMin} and ₹${suggestedMax} may improve margins while remaining competitive.`;
  } else if (diffPercent >= 15) {
    reasoning = `Your current price of ₹${currentPrice} is approximately ${diffPercent}% above the marketplace average. Consider a range between ₹${suggestedMin} and ₹${suggestedMax}, or highlight premium materials and craftsmanship to justify the higher price point.`;
  } else {
    reasoning = `Your current price of ₹${currentPrice} is well aligned with the marketplace average of ₹${marketplaceAverage}. A range between ₹${suggestedMin} and ₹${suggestedMax} keeps you competitive while protecting your margins.`;
  }

  return { suggestedMin, suggestedMax, reasoning };
}
