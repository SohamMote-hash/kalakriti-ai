"use client";

import Link from "next/link";
import { CheckCircle2, MapPin, Pencil, Save, Star, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/shared/product-image";
import { ArtisanAvatar } from "@/components/shared/artisan-avatar";
import { AIBadge } from "@/components/shared/ai-badge";
import type { EditableListing } from "./listing-review-step";
import type { Artisan } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PublishPreviewStepProps {
  listing: EditableListing;
  imagePreview: string | null;
  artisan: Artisan;
  onEdit: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  publishedProductId: string | null;
}

export function PublishPreviewStep({
  listing,
  imagePreview,
  artisan,
  onEdit,
  onSaveDraft,
  onPublish,
  publishedProductId,
}: PublishPreviewStepProps) {
  if (publishedProductId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <p className="font-display text-xl font-semibold text-foreground">
            Your product is live on the marketplace!
          </p>
          <p className="max-w-md text-sm text-foreground-muted">
            &quot;{listing.title}&quot; has been published. Buyers can now discover it — next, see
            how it compares to similar products on the marketplace.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/market-analysis">Run Market Analysis</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/products/${publishedProductId}`}>View Listing</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt={listing.title} className="h-full max-h-[420px] w-full object-cover" />
            ) : (
              <ProductImage category={listing.category} className="h-full min-h-[320px] w-full" iconClassName="h-16 w-16" />
            )}
            <AIBadge className="absolute left-4 top-4" label="AI Enhanced" />
          </div>
          <CardContent className="flex flex-col gap-4 p-7">
            <div>
              <Badge variant="secondary" className="mb-2">
                {listing.category}
              </Badge>
              <h2 className="font-display text-2xl font-semibold leading-snug text-foreground">
                {listing.title}
              </h2>
            </div>
            <p className="font-display text-3xl font-semibold text-primary">
              {formatCurrency(listing.price)}
            </p>
            <p className="text-sm leading-relaxed text-foreground-muted">{listing.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted/60 p-3.5">
              <ArtisanAvatar artisan={artisan} className="h-11 w-11" />
              <div>
                <p className="text-sm font-semibold text-foreground">{artisan.name}</p>
                <p className="flex items-center gap-1 text-xs text-foreground-muted">
                  <MapPin className="h-3 w-3" /> {artisan.location}, {artisan.state} · {" "}
                  <Star className="h-3 w-3 fill-accent text-accent" /> {artisan.rating}
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4" /> Edit Listing
        </Button>
        <Button variant="soft" onClick={onSaveDraft}>
          <Save className="h-4 w-4" /> Save Draft
        </Button>
        <Button onClick={onPublish}>
          <Upload className="h-4 w-4" /> Publish to Marketplace
        </Button>
      </div>
    </div>
  );
}
