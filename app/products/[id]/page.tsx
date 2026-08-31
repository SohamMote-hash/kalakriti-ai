"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Boxes,
  MapPin,
  Star,
  MessageCircle,
  PackageSearch,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductImage } from "@/components/shared/product-image";
import { ArtisanAvatar } from "@/components/shared/artisan-avatar";
import { RequestBulkOrderModal } from "@/components/buyer/request-bulk-order-modal";
import { useAppStore } from "@/lib/store";
import { getArtisanById } from "@/data/seedArtisans";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const products = useAppStore((s) => s.products);
  const addEnquiry = useAppStore((s) => s.addEnquiry);
  const [enquired, setEnquired] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const artisan = getArtisanById(product.artisanId);
  const artisanProducts = products.filter(
    (p) => p.artisanId === product.artisanId && p.id !== product.id && p.status === "published",
  );

  function handleAddToEnquiry() {
    if (!product) return;
    addEnquiry({
      productId: product.id,
      buyerName: "Demo Buyer Co.",
      buyerCompany: "Marketplace Enquiry",
      message: `Interested in "${product.name}". Please share more details.`,
      quantity: 1,
    });
    setEnquired(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        href="/marketplace"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductImage category={product.category} className="h-[420px] w-full rounded-xl" iconClassName="h-20 w-20" />

        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl font-semibold leading-snug text-foreground">
              {product.name}
            </h1>
          </div>

          <p className="font-display text-3xl font-semibold text-primary">
            {formatCurrency(product.price)}
          </p>

          <p className="leading-relaxed text-foreground-muted">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-lg border border-border p-3">
              <Boxes className="h-4 w-4 text-foreground-muted" />
              <div>
                <p className="text-xs text-foreground-muted">Available Quantity</p>
                <p className="font-medium text-foreground">{product.availableQuantity} units</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border p-3">
              <Clock className="h-4 w-4 text-foreground-muted" />
              <div>
                <p className="text-xs text-foreground-muted">Production Time</p>
                <p className="font-medium text-foreground">{product.productionTimeDays} days</p>
              </div>
            </div>
          </div>

          <div className="text-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Materials
            </p>
            <p className="mt-1 text-foreground">{product.material}</p>
          </div>
          <div className="text-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Craft Technique
            </p>
            <p className="mt-1 text-foreground">{product.craftTechnique}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>

          {artisan && (
            <Link
              href="#about-artisan"
              className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted/60 p-3.5 transition-colors hover:border-border-strong"
            >
              <ArtisanAvatar artisan={artisan} className="h-11 w-11" />
              <div>
                <p className="text-sm font-semibold text-foreground">{artisan.name}</p>
                <p className="flex items-center gap-1 text-xs text-foreground-muted">
                  <MapPin className="h-3 w-3" /> {artisan.location}, {artisan.state} ·{" "}
                  <Star className="h-3 w-3 fill-accent text-accent" /> {artisan.rating}
                </p>
              </div>
            </Link>
          )}

          <div className="mt-2 flex flex-wrap gap-3">
            <Button onClick={handleAddToEnquiry} disabled={enquired}>
              {enquired ? <CheckCircle2 className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
              {enquired ? "Added to Enquiries" : "Add to Enquiry"}
            </Button>
            <RequestBulkOrderModal
              products={[product]}
              defaultProductId={product.id}
              trigger={
                <Button variant="secondary">
                  <PackageSearch className="h-4 w-4" /> Request Bulk Order
                </Button>
              }
            />
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Mail className="h-4 w-4" /> Contact Artisan
                </Button>
              </DialogTrigger>
              <DialogContent>
                {contactSent ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
                      <CheckCircle2 className="h-7 w-7" />
                    </span>
                    <p className="font-display text-lg font-semibold text-foreground">Message sent!</p>
                    <p className="text-sm text-foreground-muted">
                      {artisan?.name} typically responds within a day.
                    </p>
                    <Button
                      className="mt-2"
                      onClick={() => {
                        setContactOpen(false);
                        setTimeout(() => setContactSent(false), 200);
                      }}
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Contact {artisan?.name}</DialogTitle>
                      <DialogDescription>
                        Send a direct message about &quot;{product.name}&quot;.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Hi, I'm interested in this product…"
                      className="min-h-[120px]"
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setContactOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setContactSent(true)}>Send Message</Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {artisan && (
        <Card id="about-artisan" className="mt-12 scroll-mt-24 p-6">
          <p className="mb-4 font-display text-lg font-semibold text-foreground">About the Artisan</p>
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex items-center gap-4 sm:w-64 sm:flex-col sm:items-start">
              <ArtisanAvatar artisan={artisan} className="h-16 w-16 text-xl" />
              <div>
                <p className="font-display text-base font-semibold text-foreground">{artisan.name}</p>
                <p className="text-sm text-foreground-muted">{artisan.craftSpecialization}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-foreground-muted">
                  <MapPin className="h-3 w-3" /> {artisan.location}, {artisan.state}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-foreground-muted">{artisan.bio}</p>
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {artisan.yearsOfExperience}
                  </p>
                  <p className="text-xs text-foreground-muted">Years of Experience</p>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {artisan.totalProducts}
                  </p>
                  <p className="text-xs text-foreground-muted">Products Listed</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 font-display text-lg font-semibold text-foreground">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {artisan.rating}
                  </p>
                  <p className="text-xs text-foreground-muted">Buyer Rating</p>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {artisan.memberSince}
                  </p>
                  <p className="text-xs text-foreground-muted">On Kalakriti Since</p>
                </div>
              </div>
            </div>
          </div>

          {artisanProducts.length > 0 && (
            <div className="mt-6 border-t border-border pt-5">
              <p className="mb-3 text-sm font-semibold text-foreground">
                More from {artisan.name}
              </p>
              <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
                {artisanProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="flex w-40 shrink-0 flex-col gap-2 rounded-lg border border-border p-2 transition-colors hover:border-border-strong"
                  >
                    <ProductImage category={p.category} className="h-24 w-full rounded-md" iconClassName="h-6 w-6" />
                    <div>
                      <p className="line-clamp-1 text-xs font-medium text-foreground">{p.name}</p>
                      <p className="text-xs font-semibold text-primary">{formatCurrency(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
