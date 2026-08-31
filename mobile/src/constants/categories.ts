import { Amphora, Flame, Gem, Hammer, Home, Palette, Shirt, Sprout, type LucideIcon } from "lucide-react-native";
import type { CraftCategory } from "@/types";

export const CATEGORY_ICON: Record<CraftCategory, LucideIcon> = {
  "Bamboo Craft": Sprout,
  Handloom: Shirt,
  Pottery: Amphora,
  Jewellery: Gem,
  Woodwork: Hammer,
  "Traditional Art": Palette,
  Textiles: Shirt,
  "Home Decor": Home,
  "Metal Craft": Flame,
};

export const CATEGORY_GRADIENT: Record<CraftCategory, [string, string]> = {
  "Bamboo Craft": ["#d9c68f", "#8a6a1f"],
  Handloom: ["#e3b79a", "#a84a24"],
  Pottery: ["#a9c3d1", "#35617a"],
  Jewellery: ["#e8c9d6", "#8a3f6b"],
  Woodwork: ["#c9a980", "#6b4a2b"],
  "Traditional Art": ["#e2b6b6", "#7a3b3b"],
  Textiles: ["#e0c9a6", "#a8752e"],
  "Home Decor": ["#cddccb", "#33513f"],
  "Metal Craft": ["#e8d193", "#a87c1f"],
};

export const MARKETPLACE_CATEGORIES: CraftCategory[] = [
  "Home Decor",
  "Textiles",
  "Jewellery",
  "Pottery",
  "Woodwork",
  "Bamboo Craft",
  "Handloom",
  "Traditional Art",
  "Metal Craft",
];
