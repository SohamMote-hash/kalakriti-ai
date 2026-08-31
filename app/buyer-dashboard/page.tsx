"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, PackageSearch, Sparkles, Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/marketplace/product-card";
import { RequestBulkOrderModal } from "@/components/buyer/request-bulk-order-modal";
import { useAppStore } from "@/lib/store";
import { marketplaceCategories } from "@/data/seedProducts";
import { cn } from "@/lib/utils";

export default function BuyerDashboardPage() {
  const products = useAppStore((s) => s.products);
  const savedProductIds = useAppStore((s) => s.savedProductIds);
  const toggleSavedProduct = useAppStore((s) => s.toggleSavedProduct);
  const bulkOrderRequests = useAppStore((s) => s.bulkOrderRequests);

  const [category, setCategory] = useState<string>("All");

  const published = useMemo(() => products.filter((p) => p.status === "published"), [products]);

  const recommended = useMemo(() => {
    const filtered = category === "All" ? published : published.filter((p) => p.category === category);
    return [...filtered].sort((a, b) => b.views - a.views).slice(0, 8);
  }, [published, category]);

  const savedProducts = published.filter((p) => savedProductIds.includes(p.id));

  const newCollections = [...published]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const bulkReady = [...published].sort((a, b) => b.availableQuantity - a.availableQuantity).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            Welcome back, Buyer
          </h1>
          <p className="mt-1 text-foreground-muted">
            Discover handmade products and connect directly with artisans for bulk orders.
          </p>
        </div>
        <RequestBulkOrderModal
          products={published}
          trigger={
            <Button size="lg">
              <PackageSearch className="h-4 w-4" /> Request Bulk Order
            </Button>
          }
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Recommended For You</h2>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
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
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {recommended.map((product) => (
          <ProductCard key={product.id} product={product} saved={savedProductIds.includes(product.id)} onToggleSave={toggleSavedProduct} />
        ))}
      </div>

      <div className="mt-10 flex items-center gap-2">
        <Heart className="h-5 w-5 text-danger" />
        <h2 className="font-display text-lg font-semibold text-foreground">
          Saved Products ({savedProducts.length})
        </h2>
      </div>
      {savedProducts.length === 0 ? (
        <Card className="mt-3 p-8 text-center text-sm text-foreground-muted">
          You haven&apos;t saved any products yet. Tap the heart icon on a product to save it here.
        </Card>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} saved onToggleSave={toggleSavedProduct} />
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center gap-2">
        <PackageSearch className="h-5 w-5 text-secondary" />
        <h2 className="font-display text-lg font-semibold text-foreground">Bulk Order Opportunities</h2>
      </div>
      <p className="mt-1 text-sm text-foreground-muted">
        Products with strong available stock, ready for larger orders.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bulkReady.map((product) => (
          <Card key={product.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</p>
              <p className="text-xs text-foreground-muted">{product.availableQuantity} units available</p>
            </div>
            <RequestBulkOrderModal
              products={[product]}
              defaultProductId={product.id}
              trigger={
                <Button size="sm" variant="secondary" className="shrink-0">
                  Request
                </Button>
              }
            />
          </Card>
        ))}
      </div>

      {bulkOrderRequests.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground-muted">
            Your Sent Requests
          </p>
          <div className="flex flex-col gap-2">
            {bulkOrderRequests.map((req) => {
              const product = products.find((p) => p.id === req.productId);
              return (
                <Card key={req.id} className="flex items-center justify-between p-3.5 text-sm">
                  <span className="text-foreground">
                    {req.quantity} units of {product?.name ?? "a product"}
                  </span>
                  <Badge variant="info">{req.status}</Badge>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h2 className="font-display text-lg font-semibold text-foreground">New Artisan Collections</h2>
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {newCollections.map((product) => (
          <ProductCard key={product.id} product={product} saved={savedProductIds.includes(product.id)} onToggleSave={toggleSavedProduct} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/marketplace">
            <Store className="h-4 w-4" /> Browse Full Marketplace
          </Link>
        </Button>
      </div>
    </div>
  );
}
