import type { Product } from "@/types";

/**
 * Similarity is scored 0-1 from category match, material overlap, tag
 * overlap, and price proximity — all computed against products already
 * listed on the Kalakriti marketplace (no external data sources).
 */
export function similarityScore(target: Product, candidate: Product): number {
  if (candidate.id === target.id) return 0;

  let score = 0;

  if (candidate.category === target.category) score += 0.4;

  const targetMaterialWords = normalizeWords(target.material);
  const candidateMaterialWords = normalizeWords(candidate.material);
  const materialOverlap = overlapRatio(targetMaterialWords, candidateMaterialWords);
  score += materialOverlap * 0.25;

  const tagOverlap = overlapRatio(target.tags, candidate.tags);
  score += tagOverlap * 0.2;

  const priceDiff = Math.abs(candidate.price - target.price);
  const priceProximity = Math.max(0, 1 - priceDiff / Math.max(target.price, 1));
  score += priceProximity * 0.15;

  return Math.min(1, score);
}

function normalizeWords(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[\s,&]+/)
    .filter(Boolean);
}

function overlapRatio(a: string[], b: string[]): number {
  const setA = new Set(a.map((v) => v.toLowerCase()));
  const setB = new Set(b.map((v) => v.toLowerCase()));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection += 1;
  }
  return intersection / Math.min(setA.size, setB.size);
}

export function findSimilarProducts(
  target: Product,
  allProducts: Product[],
  options: { minScore?: number; limit?: number } = {},
): { product: Product; score: number }[] {
  const { minScore = 0.15, limit = 20 } = options;

  return allProducts
    .filter((p) => p.status === "published")
    .map((product) => ({ product, score: similarityScore(target, product) }))
    .filter((entry) => entry.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
