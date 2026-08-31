"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedProducts } from "@/data/seedProducts";
import { seedEnquiries } from "@/data/seedEnquiries";
import type { BulkOrderRequest, Enquiry, Product, UserRole } from "@/types";
import { generateId } from "@/lib/utils";

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;

  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;

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
      role: "artisan",
      setRole: (role) => set({ role }),

      products: seedProducts,
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      enquiries: seedEnquiries,
      addEnquiry: (enquiry) =>
        set((state) => ({
          enquiries: [
            {
              ...enquiry,
              id: generateId("enq"),
              status: "new",
              createdAt: new Date().toISOString().slice(0, 10),
            },
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
            {
              ...request,
              id: generateId("order"),
              status: "pending",
              createdAt: new Date().toISOString(),
            },
            ...state.bulkOrderRequests,
          ],
        })),
    }),
    {
      name: "kalakriti-store",
      partialize: (state) => ({
        role: state.role,
        products: state.products,
        enquiries: state.enquiries,
        savedProductIds: state.savedProductIds,
        bulkOrderRequests: state.bulkOrderRequests,
      }),
    },
  ),
);
