import type { AIBusinessPlan, AIMarketInsight, AIProductListingInput, AIProductListingOutput, Product } from "@/types";
import { getApiBaseUrl, API_TIMEOUT_MS } from "@/constants/config";
import { mockGenerateBusinessPlan, mockGenerateDashboardInsights, mockGenerateProductListing } from "./mockAi";
import type { BusinessPlanContext } from "./mockAi";

export type AISource = "ai" | "mock";

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Request to ${path} failed with ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Every function below tries the shared Next.js backend first (same
 * /api/ai/* routes the web app uses — real Claude output when the server
 * has ANTHROPIC_API_KEY, deterministic mock otherwise). If the backend is
 * unreachable (no dev server running, offline demo, physical device not
 * on the same network) it falls back to the identical mock generators
 * bundled locally, so the mobile app never fails without a connection.
 */
export async function generateProductListing(
  input: AIProductListingInput,
): Promise<{ output: AIProductListingOutput; source: AISource }> {
  try {
    return await postJSON<{ output: AIProductListingOutput; source: AISource }>("/api/ai/listing", input);
  } catch {
    return { output: mockGenerateProductListing(input), source: "mock" };
  }
}

export async function generateDashboardInsights(
  products: Product[],
): Promise<{ insights: AIMarketInsight[]; source: AISource }> {
  try {
    return await postJSON<{ insights: AIMarketInsight[]; source: AISource }>("/api/ai/insights", { products });
  } catch {
    return { insights: mockGenerateDashboardInsights(products), source: "mock" };
  }
}

export async function generateBusinessPlan(
  ctx: BusinessPlanContext,
): Promise<{ plan: AIBusinessPlan; source: AISource }> {
  try {
    return await postJSON<{ plan: AIBusinessPlan; source: AISource }>("/api/ai/business-plan", ctx);
  } catch {
    return { plan: mockGenerateBusinessPlan(ctx), source: "mock" };
  }
}
