import type { BusinessPlanContext } from "@/lib/ai/businessPlan";
import { generateBusinessPlan } from "@/lib/ai/businessPlan";

export async function POST(request: Request) {
  const context = (await request.json()) as BusinessPlanContext;
  const result = await generateBusinessPlan(context);
  return Response.json(result);
}
