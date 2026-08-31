import type { Product } from "@/types";
import { generateDashboardInsights } from "@/lib/ai/marketInsights";

export async function POST(request: Request) {
  const { products } = (await request.json()) as { products: Product[] };
  const result = await generateDashboardInsights(products ?? []);
  return Response.json(result);
}
