import type { MarketplaceAnalytics, Product } from "@/types";
import { findSimilarProducts } from "./similarity";

export interface MarketAnalysisResult extends MarketplaceAnalytics {
  similarProducts: { product: Product; score: number }[];
  priceHistogram: { bucket: string; count: number }[];
  categoryComparison: { category: string; averagePrice: number; count: number }[];
  positionVsAverage: number;
}

export function runMarketAnalysis(
  target: Product,
  allProducts: Product[],
): MarketAnalysisResult {
  const similar = findSimilarProducts(target, allProducts);
  const prices = similar.map((s) => s.product.price);

  const minPrice = prices.length ? Math.min(...prices) : target.price;
  const maxPrice = prices.length ? Math.max(...prices) : target.price;
  const averagePrice = prices.length
    ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    : target.price;

  const competitionLevel: MarketplaceAnalytics["competitionLevel"] =
    similar.length >= 10 ? "High" : similar.length >= 5 ? "Medium" : "Low";

  const suggestedMin = Math.round((averagePrice * 0.93) / 10) * 10;
  const suggestedMax = Math.round((averagePrice * 1.1) / 10) * 10;

  const bucketSize = Math.max(50, Math.round((maxPrice - minPrice || 200) / 6 / 10) * 10);
  const priceHistogram = buildHistogram(prices, minPrice, maxPrice, bucketSize);

  const categoryComparison = buildCategoryComparison(target, allProducts);

  const positionVsAverage =
    averagePrice > 0 ? ((target.price - averagePrice) / averagePrice) * 100 : 0;

  return {
    productId: target.id,
    similarProductCount: similar.length,
    minPrice,
    maxPrice,
    averagePrice,
    competitionLevel,
    suggestedMin,
    suggestedMax,
    similarProducts: similar,
    priceHistogram,
    categoryComparison,
    positionVsAverage,
  };
}

function buildHistogram(
  prices: number[],
  min: number,
  max: number,
  bucketSize: number,
): { bucket: string; count: number }[] {
  if (prices.length === 0) return [];
  const start = Math.floor(min / bucketSize) * bucketSize;
  const end = Math.ceil(max / bucketSize) * bucketSize;
  const buckets: { bucket: string; count: number; from: number; to: number }[] = [];

  for (let b = start; b < end; b += bucketSize) {
    buckets.push({ bucket: `₹${b}-${b + bucketSize}`, count: 0, from: b, to: b + bucketSize });
  }
  if (buckets.length === 0) {
    buckets.push({ bucket: `₹${start}-${start + bucketSize}`, count: 0, from: start, to: start + bucketSize });
  }

  for (const price of prices) {
    const bucket = buckets.find((b) => price >= b.from && price < b.to) ?? buckets[buckets.length - 1];
    bucket.count += 1;
  }

  return buckets.map(({ bucket, count }) => ({ bucket, count }));
}

function buildCategoryComparison(target: Product, allProducts: Product[]) {
  const categories = new Map<string, number[]>();
  for (const p of allProducts) {
    if (p.status !== "published") continue;
    const list = categories.get(p.category) ?? [];
    list.push(p.price);
    categories.set(p.category, list);
  }

  return Array.from(categories.entries())
    .map(([category, prices]) => ({
      category,
      averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      count: prices.length,
    }))
    .sort((a, b) => {
      if (a.category === target.category) return -1;
      if (b.category === target.category) return 1;
      return b.count - a.count;
    })
    .slice(0, 7);
}
