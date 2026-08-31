import type {
  AIBusinessPlan,
  AIBusinessPlanSection,
  Artisan,
  FinancialInputs,
  FinancialResults,
  Product,
} from "@/types";
import type { MarketAnalysisResult } from "@/lib/analytics/marketAnalysis";
import { formatCurrency } from "@/lib/utils";
import { callClaudeJSON, hasApiKey } from "./client";

export interface BusinessPlanContext {
  product: Product;
  artisan: Artisan;
  financialInputs: FinancialInputs;
  financialResults: FinancialResults;
  marketAnalysis: MarketAnalysisResult;
}

export function mockGenerateBusinessPlan(ctx: BusinessPlanContext): AIBusinessPlan {
  const { product, artisan, financialInputs, financialResults, marketAnalysis } = ctx;

  const sections: AIBusinessPlanSection[] = [
    {
      title: "Business Overview",
      content: `${artisan.name} operates a ${artisan.craftSpecialization.toLowerCase()} business based in ${artisan.location}, ${artisan.state}, with ${artisan.yearsOfExperience} years of craft experience. The business is now scaling its flagship product, "${product.name}", from local sales into a structured digital marketplace channel via Kalakriti AI, targeting both individual buyers and larger B2B customers such as retailers and interior designers.`,
    },
    {
      title: "Product Description",
      content: `"${product.name}" is a ${product.category.toLowerCase()} product handcrafted using ${product.material.toLowerCase()}, produced through the traditional ${product.craftTechnique.toLowerCase()} technique. Each unit takes approximately ${product.productionTimeDays} days to produce, with a current available quantity of ${product.availableQuantity} units. The product is positioned as an authentic, sustainably made alternative to mass-manufactured home and lifestyle goods.`,
    },
    {
      title: "Target Customers",
      content: `Primary customers include urban households seeking authentic handmade decor, gifting buyers, and design-conscious individuals purchasing through the Kalakriti marketplace. Secondary, higher-value customers include interior design studios, boutique hotels, gift retailers, and corporate gifting agencies looking for bulk orders of ${product.availableQuantity >= 50 ? "50-100+" : "20-50"} units with consistent quality and craft authenticity.`,
    },
    {
      title: "Market Opportunity",
      content: `Analysis of ${marketAnalysis.similarProductCount} comparable products on the Kalakriti marketplace shows prices ranging from ${formatCurrency(marketAnalysis.minPrice)} to ${formatCurrency(marketAnalysis.maxPrice)}, with a marketplace average of ${formatCurrency(marketAnalysis.averagePrice)} and ${marketAnalysis.competitionLevel.toLowerCase()} competition in the ${product.category} category. This indicates healthy, sustained buyer demand with room to differentiate through quality, storytelling, and faster fulfilment.`,
    },
    {
      title: "Pricing Strategy",
      content: `The product is currently priced at ${formatCurrency(product.price)}. Based on marketplace data, a recommended pricing range of ${formatCurrency(marketAnalysis.suggestedMin)} to ${formatCurrency(marketAnalysis.suggestedMax)} balances competitiveness with healthy margins. At the planned selling price of ${formatCurrency(financialInputs.sellingPrice)}, the business earns an estimated ${formatCurrency(financialResults.profitPerUnit)} profit per unit, a ${financialResults.profitMarginPercent.toFixed(1)}% margin.`,
    },
    {
      title: "Cost Structure",
      content: `Per-unit costs total ${formatCurrency(financialResults.costPerUnit)}, comprising material (${formatCurrency(financialInputs.materialCost)}), labour (${formatCurrency(financialInputs.labourCost)}), packaging (${formatCurrency(financialInputs.packagingCost)}), transport (${formatCurrency(financialInputs.transportCost)}), and other overheads (${formatCurrency(financialInputs.otherCost)}). At a planned production volume of ${financialInputs.productionQuantity} units per month, total monthly costs are estimated at ${formatCurrency(financialResults.totalMonthlyCost)}.`,
    },
    {
      title: "Revenue Projection",
      content: `At ${financialInputs.productionQuantity} units/month and a selling price of ${formatCurrency(financialInputs.sellingPrice)}, projected monthly revenue is ${formatCurrency(financialResults.totalRevenue)}, yielding an estimated monthly profit of ${formatCurrency(financialResults.estimatedProfit)}. The business reaches break-even at approximately ${Number.isFinite(financialResults.breakEvenUnits) ? `${financialResults.breakEvenUnits} units` : "an adjusted price point, as current costs exceed the selling price"} per month.`,
    },
    {
      title: "Growth Strategy",
      content: `Growth will be driven by three parallel channels: (1) expanding the Kalakriti marketplace catalogue with complementary ${product.category.toLowerCase()} products, (2) pursuing B2B bulk orders through Kalakriti's Buyer Discovery tool to secure recurring wholesale revenue, and (3) reinvesting early profits into raw material stock and modest production capacity increases to meet growing bulk demand.`,
    },
    {
      title: "Risks and Recommendations",
      content: `Key risks include raw material price fluctuations, production capacity constraints during high-demand periods, and price competition from lower-quality alternatives. It is recommended to maintain a ${formatCurrency(marketAnalysis.suggestedMin)}-${formatCurrency(marketAnalysis.suggestedMax)} pricing band, diversify buyer relationships across at least 2-3 B2B channels, and continue using AI-assisted market analysis before each pricing revision to stay aligned with marketplace trends.`,
    },
  ];

  return {
    productName: product.name,
    generatedAt: new Date().toISOString(),
    sections,
  };
}

async function realGenerateBusinessPlan(ctx: BusinessPlanContext): Promise<AIBusinessPlan> {
  const { product, artisan, financialInputs, financialResults, marketAnalysis } = ctx;

  const system =
    "You are a business consultant AI for Kalakriti AI, helping a rural Indian artisan turn their handmade product business into a structured, fundable plan. " +
    'Respond with ONLY minified JSON: {"sections": [{"title": string, "content": string}]}. ' +
    "Produce exactly 9 sections in this order with these exact titles: Business Overview, Product Description, Target Customers, Market Opportunity, Pricing Strategy, Cost Structure, Revenue Projection, Growth Strategy, Risks and Recommendations. Each content should be 2-4 professional sentences grounded in the data provided, in Indian Rupees.";

  const user = `Artisan: ${artisan.name}, ${artisan.location}, ${artisan.state}, ${artisan.yearsOfExperience} years experience in ${artisan.craftSpecialization}.
Product: ${product.name}, category ${product.category}, material ${product.material}, technique ${product.craftTechnique}, price ₹${product.price}, available quantity ${product.availableQuantity}.
Financials: material ₹${financialInputs.materialCost}, labour ₹${financialInputs.labourCost}, packaging ₹${financialInputs.packagingCost}, transport ₹${financialInputs.transportCost}, other ₹${financialInputs.otherCost}, monthly quantity ${financialInputs.productionQuantity}, selling price ₹${financialInputs.sellingPrice}. Cost/unit ₹${financialResults.costPerUnit}, monthly profit ₹${financialResults.estimatedProfit}, margin ${financialResults.profitMarginPercent.toFixed(1)}%, break-even ${financialResults.breakEvenUnits} units.
Market analysis: ${marketAnalysis.similarProductCount} similar marketplace products, price range ₹${marketAnalysis.minPrice}-₹${marketAnalysis.maxPrice}, average ₹${marketAnalysis.averagePrice}, competition ${marketAnalysis.competitionLevel}, suggested range ₹${marketAnalysis.suggestedMin}-₹${marketAnalysis.suggestedMax}.`;

  const result = await callClaudeJSON<{ sections: AIBusinessPlanSection[] }>(
    system,
    user,
    3000,
  );

  return {
    productName: product.name,
    generatedAt: new Date().toISOString(),
    sections: result.sections,
  };
}

export async function generateBusinessPlan(
  ctx: BusinessPlanContext,
): Promise<{ plan: AIBusinessPlan; source: "ai" | "mock" }> {
  if (hasApiKey()) {
    try {
      const plan = await realGenerateBusinessPlan(ctx);
      return { plan, source: "ai" };
    } catch (error) {
      console.error("[ai] Falling back to mock business plan:", error);
    }
  }
  return { plan: mockGenerateBusinessPlan(ctx), source: "mock" };
}
