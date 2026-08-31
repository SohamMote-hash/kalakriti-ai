import type { AIProductListingInput } from "@/types";
import { generateProductListing } from "@/lib/ai/productListing";

export async function POST(request: Request) {
  const input = (await request.json()) as AIProductListingInput;

  if (!input.productName || !input.category || !input.material) {
    return Response.json(
      { error: "productName, category, and material are required" },
      { status: 400 },
    );
  }

  const result = await generateProductListing(input);
  return Response.json(result);
}
