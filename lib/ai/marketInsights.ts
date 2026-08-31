import type { AIMarketInsight, Product } from "@/types";
import { callClaudeJSON, hasApiKey } from "./client";

export function mockGenerateDashboardInsights(
  products: Product[],
): AIMarketInsight[] {
  const insights: AIMarketInsight[] = [];
  const published = products.filter((p) => p.status === "published");

  if (published.length > 0) {
    const avgPrice = published.reduce((s, p) => s + p.price, 0) / published.length;
    const cheapest = [...published].sort((a, b) => a.price - b.price)[0];
    if (cheapest && cheapest.price < avgPrice * 0.75) {
      insights.push({
        headline: `Your "${cheapest.name}" is priced below the average market range.`,
        detail: `At ₹${cheapest.price}, it sits well under your ${cheapest.category} average of ₹${Math.round(avgPrice)}. Consider running a Market Analysis to find a better price band.`,
        tone: "warning",
      });
    }

    const mostViewed = [...published].sort((a, b) => b.views - a.views)[0];
    if (mostViewed) {
      insights.push({
        headline: `"${mostViewed.name}" is your top performer this month.`,
        detail: `It has received ${mostViewed.views} views and ${mostViewed.enquiries} buyer enquiries — consider creating similar variations.`,
        tone: "positive",
      });
    }
  }

  insights.push({
    headline: "Products with better background images receive more attention.",
    detail:
      "Listings using the AI Product Studio's enhanced imagery step see noticeably higher view-to-enquiry conversion. Try regenerating older listings.",
    tone: "neutral",
  });

  const lowStock = published.filter((p) => p.availableQuantity < 10);
  if (lowStock.length > 0) {
    insights.push({
      headline: `${lowStock.length} product${lowStock.length > 1 ? "s are" : " is"} running low on available stock.`,
      detail: "Restock soon to avoid missing out on bulk buyer opportunities.",
      tone: "warning",
    });
  }

  return insights.slice(0, 4);
}

async function realGenerateDashboardInsights(
  products: Product[],
): Promise<AIMarketInsight[]> {
  const system =
    "You are a business analyst assistant for Kalakriti AI, helping rural Indian artisans understand their product performance. " +
    'Respond with ONLY minified JSON: {"insights": [{"headline": string, "detail": string, "tone": "positive"|"neutral"|"warning"}]}. Provide 3-4 short, specific, actionable insights.';

  const summary = products
    .filter((p) => p.status === "published")
    .map((p) => `${p.name} | ${p.category} | ₹${p.price} | ${p.views} views | ${p.enquiries} enquiries | stock ${p.availableQuantity}`)
    .join("\n");

  const result = await callClaudeJSON<{ insights: AIMarketInsight[] }>(
    system,
    `Artisan's published products:\n${summary}`,
    1000,
  );
  return result.insights;
}

export async function generateDashboardInsights(
  products: Product[],
): Promise<{ insights: AIMarketInsight[]; source: "ai" | "mock" }> {
  if (hasApiKey()) {
    try {
      const insights = await realGenerateDashboardInsights(products);
      return { insights, source: "ai" };
    } catch (error) {
      console.error("[ai] Falling back to mock dashboard insights:", error);
    }
  }
  return { insights: mockGenerateDashboardInsights(products), source: "mock" };
}
