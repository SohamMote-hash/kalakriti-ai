import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProductImage } from "@/components/shared/product-image";
import { getArtisanById } from "@/data/seedArtisans";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}

export function ProductCard({ product, saved, onToggleSave }: ProductCardProps) {
  const artisan = getArtisanById(product.artisanId);

  return (
    <Card className="group relative h-full overflow-hidden transition-shadow hover:shadow-md">
      {onToggleSave && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleSave(product.id);
          }}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur transition-colors hover:bg-surface"
        >
          <Heart className={cn("h-4 w-4", saved ? "fill-danger text-danger" : "text-foreground-muted")} />
        </button>
      )}
      <Link href={`/products/${product.id}`}>
        <ProductImage category={product.category} className="h-48 w-full" />
        <div className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-foreground-muted">
            {product.category}
          </p>
          <p className="mt-1 line-clamp-1 font-display text-sm font-semibold text-foreground">
            {product.name}
          </p>
          {artisan && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-foreground-muted">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">
                {artisan.name} · {artisan.location}, {artisan.state}
              </span>
            </div>
          )}
          <div className="mt-2.5 flex items-center justify-between">
            <span className="font-display text-lg font-semibold text-primary">
              {formatCurrency(product.price)}
            </span>
            {artisan && (
              <span className="flex items-center gap-0.5 text-xs text-foreground-muted">
                <Star className="h-3 w-3 fill-accent text-accent" /> {artisan.rating}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
