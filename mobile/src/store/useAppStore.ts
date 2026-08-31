import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import i18n from "@/i18n";
import { seedProducts } from "@/data/seedProducts";
import { seedEnquiries } from "@/data/seedEnquiries";
import { generateId } from "@/utils/format";
import type { BulkOrderRequest, Enquiry, Language, Product, UserRole } from "@/types";

interface AppState {
  onboardingComplete: boolean;
  completeOnboarding: () => void;

  language: Language;
  setLanguage: (language: Language) => void;

  role: UserRole | null;
  setRole: (role: UserRole) => void;

  products: Product[];
  addProduct: (product: Product) => void;

  enquiries: Enquiry[];
  addEnquiry: (enquiry: Omit<Enquiry, "id" | "createdAt" | "status">) => void;

  savedProductIds: string[];
  toggleSavedProduct: (productId: string) => void;

  bulkOrderRequests: BulkOrderRequest[];
  addBulkOrderRequest: (request: Omit<BulkOrderRequest, "id" | "createdAt" | "status">) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingComplete: false,
      completeOnboarding: () => set({ onboardingComplete: true }),

      language: "en",
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },

      role: null,
      setRole: (role) => set({ role }),

      products: seedProducts,
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),

      enquiries: seedEnquiries,
      addEnquiry: (enquiry) =>
        set((state) => ({
          enquiries: [
            { ...enquiry, id: generateId("enq"), status: "new", createdAt: new Date().toISOString().slice(0, 10) },
            ...state.enquiries,
          ],
        })),

      savedProductIds: [],
      toggleSavedProduct: (productId) =>
        set((state) => ({
          savedProductIds: state.savedProductIds.includes(productId)
            ? state.savedProductIds.filter((id) => id !== productId)
            : [...state.savedProductIds, productId],
        })),

      bulkOrderRequests: [],
      addBulkOrderRequest: (request) =>
        set((state) => ({
          bulkOrderRequests: [
            { ...request, id: generateId("order"), status: "pending", createdAt: new Date().toISOString() },
            ...state.bulkOrderRequests,
          ],
        })),
    }),
    {
      name: "kalakriti-mobile-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.language) i18n.changeLanguage(state.language);
      },
    },
  ),
);
