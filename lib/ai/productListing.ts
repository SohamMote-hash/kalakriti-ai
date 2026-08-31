import type { AIProductListingInput, AIProductListingOutput, CraftCategory } from "@/types";
import { callClaudeJSON, hasApiKey } from "./client";
import { estimateBasePrice } from "./pricing";

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
  const core = input.productName
    .replace(/^hand(woven|made|crafted|carved|painted)\s*/i, "")
    .trim();
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

export function mockGenerateProductListing(
  input: AIProductListingInput,
): AIProductListingOutput {
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

async function realGenerateProductListing(
  input: AIProductListingInput,
): Promise<AIProductListingOutput> {
  const system =
    "You are an expert e-commerce copywriter for Kalakriti AI, a marketplace that helps rural Indian artisans sell handmade products to larger buyers. " +
    "Given basic product details, produce a professional listing. Respond with ONLY minified JSON matching this TypeScript type, no markdown: " +
    '{"title": string, "description": string, "category": string, "materials": string[], "tags": string[], "craftTechnique": string, "suggestedPrice": number}. ' +
    "The description should be 2-4 sentences, warm and professional, emphasising craftsmanship and authenticity. Tags should be short PascalCase words without # symbols. suggestedPrice is in Indian Rupees (INR), a realistic number for a handmade artisan product.";

  const user = `Product name: ${input.productName}\nCategory: ${input.category}\nMaterial: ${input.material}\nArtisan's description: ${input.shortDescription || "N/A"}`;

  const result = await callClaudeJSON<AIProductListingOutput>(system, user, 1200);
  return result;
}

export async function generateProductListing(
  input: AIProductListingInput,
): Promise<{ output: AIProductListingOutput; source: "ai" | "mock" }> {
  if (hasApiKey()) {
    try {
      const output = await realGenerateProductListing(input);
      return { output, source: "ai" };
    } catch (error) {
      console.error("[ai] Falling back to mock product listing:", error);
    }
  }
  return { output: mockGenerateProductListing(input), source: "mock" };
}
