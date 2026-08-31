import type {
  AIBusinessPlan,
  AIBusinessPlanSection,
  AIMarketInsight,
  AIProductListingInput,
  AIProductListingOutput,
  Artisan,
  CraftCategory,
  FinancialInputs,
  FinancialResults,
  Product,
} from "@/types";
import type { MarketAnalysisResult } from "./marketAnalysis";
import { estimateBasePrice } from "./pricing";
import { formatCurrency } from "@/utils/format";

export interface BusinessPlanContext {
  product: Product;
  artisan: Artisan;
  financialInputs: FinancialInputs;
  financialResults: FinancialResults;
  marketAnalysis: MarketAnalysisResult;
}

const TECHNIQUE_KEYWORDS: { keywords: string[]; technique: string; verb: string }[] = [
  { keywords: ["bamboo", "cane", "rattan"], technique: "Hand Weaving", verb: "Handwoven" },
  { keywords: ["cotton", "handloom", "khadi"], technique: "Handloom Weaving", verb: "Handwoven" },
  { keywords: ["silk"], technique: "Pit Loom Weaving", verb: "Handwoven" },
  { keywords: ["wood", "sheesham", "teak"], technique: "Hand Chisel Carving", verb: "Hand-Carved" },
  { keywords: ["clay", "terracotta"], technique: "Hand Moulding & Firing", verb: "Hand-Moulded" },
  { keywords: ["ceramic", "pottery", "quartz"], technique: "Wheel Throwing & Glazing", verb: "Hand-Thrown" },
  { keywords: ["brass", "copper", "metal", "bronze"], technique: "Chasing & Repoussé", verb: "Hand-Engraved" },
  { keywords: ["mirror", "bead"], technique: "Bead & Mirror Embroidery", verb: "Hand-Embroidered" },
  { keywords: ["paper", "canvas", "pigment", "dye"], technique: "Natural Pigment Painting", verb: "Hand-Painted" },
];

const CATEGORY_TAGS: Partial<Record<CraftCategory, string[]>> = {
  "Bamboo Craft": ["BambooCraft", "Sustainable", "EcoFriendly"],
  Handloom: ["Handloom", "PureCotton"],
  Pottery: ["Pottery", "GlazedCeramic"],
  Jewellery: ["TribalJewellery", "HandmadeJewellery"],
  Woodwork: ["Woodwork", "WoodCarving"],
  "Traditional Art": ["FolkArt", "TraditionalArt"],
  Textiles: ["Textiles", "NaturalDyes"],
  "Home Decor": ["HomeDecor", "InteriorStyling"],
  "Metal Craft": ["MetalCraft", "BrassCraft"],
};

function detectTechnique(material: string, productName: string) {
  const haystack = `${material} ${productName}`.toLowerCase();
  for (const entry of TECHNIQUE_KEYWORDS) {
    if (entry.keywords.some((k) => haystack.includes(k))) return entry;
  }
  return { keywords: [], technique: "Traditional Hand Craftsmanship", verb: "Handcrafted" };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1000;
  }
  return hash;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

const OPENERS = [
  (material: string) => `Handcrafted using sustainably sourced ${material.toLowerCase()}`,
  (material: string) => `Crafted with care from ${material.toLowerCase()}`,
  (material: string) => `Made using traditional techniques with ${material.toLowerCase()}`,
];

const MIDDLES = [
  (technique: string) =>
    `this piece combines functional design with timeless artisanal craftsmanship, using ${technique.toLowerCase()} techniques passed down through generations`,
  (technique: string) =>
    `each piece reflects the region's ${technique.toLowerCase()} heritage, with subtle variations that make every item unique`,
  (technique: string) =>
    `skilled artisans apply traditional ${technique.toLowerCase()} methods to bring out fine, authentic detailing`,
];

const CLOSERS = [
  "A striking addition that brings warm, handmade character to any modern space.",
  "Perfect for everyday use or as a thoughtful, story-rich gift.",
  "A meaningful way to bring authentic Indian craftsmanship into contemporary living.",
];

function buildDescription(input: AIProductListingInput, technique: string): string {
  const seed = hashString(input.productName + input.material);
  const opener = pick(OPENERS, seed)(input.material);
  const middle = pick(MIDDLES, seed + 7)(technique);
  const closer = pick(CLOSERS, seed + 13);
  const extra = input.shortDescription ? ` ${input.shortDescription}` : "";
  return `${opener}, ${middle}.${extra ? extra : ""} ${closer}`;
}

function buildTitle(input: AIProductListingInput, verb: string): string {
  const material = input.material.replace(/^natural\s+/i, "Natural ").trim();
  const core = input.productName.replace(/^hand(woven|made|crafted|carved|painted)\s*/i, "").trim();
  return `${verb} ${material} ${core} – Traditional Artisan Craft`;
}

function buildTags(input: AIProductListingInput): string[] {
  const base = new Set<string>(["Handmade", "TraditionalCraft"]);
  const categoryTags = CATEGORY_TAGS[input.category] ?? [input.category.replace(/\s+/g, "")];
  categoryTags.forEach((t) => base.add(t));
  const materialLower = input.material.toLowerCase();
  if (materialLower.includes("bamboo") || materialLower.includes("cotton") || materialLower.includes("wood")) {
    base.add("Sustainable");
  }
  return Array.from(base).slice(0, 6);
}

export function mockGenerateProductListing(input: AIProductListingInput): AIProductListingOutput {
  const normalized = `${input.productName} ${input.material}`.toLowerCase();

  if (normalized.includes("bamboo") && normalized.includes("basket")) {
    return {
      title: "Handwoven Natural Bamboo Storage Basket – Traditional Artisan Craft",
      description:
        "Handcrafted using sustainably sourced natural bamboo, this traditional woven basket combines functional storage with timeless artisanal craftsmanship. Each piece is woven by hand using techniques passed down through generations, making every basket subtly unique. Perfect for organising linens, plants, or everyday essentials while adding warm, earthy texture to modern interiors.",
      category: "Home Decor",
      materials: ["Bamboo", "Natural Fiber"],
      tags: ["Handmade", "BambooCraft", "Sustainable", "HomeDecor", "TraditionalCraft"],
      craftTechnique: "Hand Weaving",
      suggestedPrice: 580,
    };
  }

  const { technique, verb } = detectTechnique(input.material, input.productName);

  return {
    title: buildTitle(input, verb),
    description: buildDescription(input, technique),
    category: input.category,
    materials: input.material.split(/[,&]/).map((m) => m.trim()).filter(Boolean),
    tags: buildTags(input),
    craftTechnique: technique,
    suggestedPrice: estimateBasePrice(input.category, input.material),
  };
}

export function mockGenerateDashboardInsights(products: Product[]): AIMarketInsight[] {
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

export function mockGenerateBusinessPlan(ctx: BusinessPlanContext): AIBusinessPlan {
  const { product, artisan, financialInputs, financialResults, marketAnalysis } = ctx;

  const sections: AIBusinessPlanSection[] = [
    {
      title: "Business Overview",
      content: `${artisan.name} operates a ${artisan.craftSpecialization.toLowerCase()} business based in ${artisan.location}, ${artisan.state}, with ${artisan.yearsOfExperience} years of craft experience. The business is now scaling its flagship product, "${product.name}", from local sales into a structured digital marketplace channel via Kalakriti, targeting both individual buyers and larger B2B customers such as retailers and interior designers.`,
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
