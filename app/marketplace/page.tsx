"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/marketplace/product-card";
import { useAppStore } from "@/lib/store";
import { marketplaceCategories } from "@/data/seedProducts";
import { cn } from "@/lib/utils";

type SortOption = "popular" | "newest" | "price-low" | "price-high";

export default function MarketplacePage() {
  const products = useAppStore((s) => s.products);
  const savedProductIds = useAppStore((s) => s.savedProductIds);
  const toggleSavedProduct = useAppStore((s) => s.toggleSavedProduct);
  const role = useAppStore((s) => s.role);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<SortOption>("popular");

  const published = useMemo(() => products.filter((p) => p.status === "published"), [products]);

  const filtered = useMemo(() => {
    let result = published;
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    const sorted = [...result];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        sorted.sort((a, b) => b.views - a.views);
    }
    return sorted;
  }, [published, category, search, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            Marketplace
          </h1>
          <p className="mt-1 text-foreground-muted">
            {published.length} handmade products from artisans across India.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, categories, or tags…"
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-foreground-muted" />
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["All", ...marketplaceCategories].map((c) => (
          <button key={c} type="button" onClick={() => setCategory(c)}>
            <Badge
              variant={category === c ? "default" : "outline"}
              className={cn("cursor-pointer px-3 py-1 text-xs", category === c && "shadow-sm")}
            >
              {c}
            </Badge>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="font-display text-lg font-semibold text-foreground">No products found</p>
          <p className="text-sm text-foreground-muted">Try a different search term or category.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              saved={role === "buyer" ? savedProductIds.includes(product.id) : undefined}
              onToggleSave={role === "buyer" ? toggleSavedProduct : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
