export type CraftCategory =
  | "Bamboo Craft"
  | "Handloom"
  | "Pottery"
  | "Jewellery"
  | "Woodwork"
  | "Traditional Art"
  | "Textiles"
  | "Home Decor"
  | "Metal Craft";

export type ProductStatus = "draft" | "published";

export interface Artisan {
  id: string;
  name: string;
  location: string;
  state: string;
  craftSpecialization: string;
  bio: string;
  yearsOfExperience: number;
  avatarColor: string;
  initials: string;
  rating: number;
  totalProducts: number;
  memberSince: string;
}

export interface Product {
  id: string;
  artisanId: string;
  name: string;
  category: CraftCategory;
  material: string;
  description: string;
  shortDescription: string;
  price: number;
  tags: string[];
  status: ProductStatus;
  craftTechnique: string;
  productionTimeDays: number;
  availableQuantity: number;
  views: number;
  enquiries: number;
  createdAt: string;
  aiGenerated: boolean;
}

export interface MarketplaceAnalytics {
  productId: string;
  similarProductCount: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  competitionLevel: "Low" | "Medium" | "High";
  suggestedMin: number;
  suggestedMax: number;
}

export interface FinancialInputs {
  materialCost: number;
  labourCost: number;
  packagingCost: number;
  transportCost: number;
  otherCost: number;
  productionQuantity: number;
  sellingPrice: number;
}

export interface FinancialResults {
  costPerUnit: number;
  totalMonthlyCost: number;
  totalRevenue: number;
  estimatedProfit: number;
  profitMarginPercent: number;
  breakEvenUnits: number;
  profitPerUnit: number;
}

export type BuyerCategory =
  | "Retailer"
  | "Interior Designer"
  | "Hotel"
  | "Gift Shop"
  | "Wholesaler"
  | "Corporate Buyer";

export interface Buyer {
  id: string;
  companyName: string;
  category: BuyerCategory;
  location: string;
  interestedIn: string;
  potentialOrderMin: number;
  potentialOrderMax: number;
  matchScore: number;
  matchReason: string;
  preferredCategories: CraftCategory[];
  logoInitials: string;
  logoColor: string;
  about: string;
}

export type EnquiryStatus = "new" | "responded" | "closed";

export interface Enquiry {
  id: string;
  productId: string;
  buyerName: string;
  buyerCompany: string;
  message: string;
  quantity: number;
  status: EnquiryStatus;
  createdAt: string;
}

export interface BulkOrderRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  productId: string;
  quantity: number;
  budget: number;
  deliveryLocation: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

export interface AIProductListingInput {
  productName: string;
  category: CraftCategory;
  material: string;
  shortDescription: string;
}

export interface AIProductListingOutput {
  title: string;
  description: string;
  category: CraftCategory;
  materials: string[];
  tags: string[];
  craftTechnique: string;
  suggestedPrice: number;
}

export interface AIMarketInsight {
  headline: string;
  detail: string;
  tone: "positive" | "neutral" | "warning";
}

export interface AIBusinessPlanSection {
  title: string;
  content: string;
}

export interface AIBusinessPlan {
  productName: string;
  generatedAt: string;
  sections: AIBusinessPlanSection[];
}

export type UserRole = "artisan" | "buyer";

export type Language = "en" | "hi" | "mr";
