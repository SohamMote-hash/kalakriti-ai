"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Eye, MessageSquare, Boxes, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductImage } from "@/components/shared/product-image";
import { useAppStore } from "@/lib/store";
import { currentArtisan } from "@/data/seedArtisans";
import { formatCurrency } from "@/lib/utils";

export default function MyProductsPage() {
  const products = useAppStore((s) => s.products);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const myProducts = useMemo(
    () => products.filter((p) => p.artisanId === currentArtisan.id),
    [products],
  );

  const filtered = myProducts.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            My Products
          </h1>
          <p className="mt-1 text-foreground-muted">
            Manage your listings and track how they perform on the marketplace.
          </p>
        </div>
        <Button asChild>
          <Link href="/product-studio">
            <Plus className="h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All ({myProducts.length})</TabsTrigger>
            <TabsTrigger value="published">
              Published ({myProducts.filter((p) => p.status === "published").length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({myProducts.filter((p) => p.status === "draft").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center gap-3 p-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Store className="h-6 w-6" />
          </span>
          <p className="font-display text-lg font-semibold text-foreground">No products here yet</p>
          <p className="max-w-sm text-sm text-foreground-muted">
            Use the AI Product Studio to turn your next handmade item into a professional listing.
          </p>
          <Button asChild className="mt-2">
            <Link href="/product-studio">
              <Plus className="h-4 w-4" /> Add New Product
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                <ProductImage category={product.category} className="h-44 w-full" />
                <Badge
                  variant={product.status === "published" ? "success" : "neutral"}
                  className="absolute left-3 top-3"
                >
                  {product.status === "published" ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="p-4">
                <p className="line-clamp-1 font-display text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <p className="mt-0.5 text-xs text-foreground-muted">{product.category}</p>
                <p className="mt-2 font-display text-lg font-semibold text-primary">
                  {formatCurrency(product.price)}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {product.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> {product.enquiries}
                  </span>
                  <span className="flex items-center gap-1">
                    <Boxes className="h-3.5 w-3.5" /> {product.availableQuantity} in stock
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/products/${product.id}`}>View</Link>
                  </Button>
                  <Button variant="soft" size="sm" className="flex-1" asChild>
                    <Link href="/market-analysis">Analyze</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
