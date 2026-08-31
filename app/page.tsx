import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Wallet,
  FileText,
  Handshake,
  UploadCloud,
  Wand2,
  TrendingUp,
  Building2,
  Star,
  MapPin,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/shared/product-image";
import { seedProducts } from "@/data/seedProducts";
import { getArtisanById } from "@/data/seedArtisans";
import { formatCurrency } from "@/lib/utils";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Product Studio",
    description:
      "Turn a phone photo and a few details into a professional listing with AI-generated titles, descriptions, and tags.",
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description:
      "See how your product compares to similar items already selling on the Kalakriti marketplace — real data, not guesswork.",
  },
  {
    icon: Wallet,
    title: "Financial Planning",
    description:
      "Track cost per unit, profit margin, and break-even point with an interactive planner built for small production runs.",
  },
  {
    icon: FileText,
    title: "AI Business Plans",
    description:
      "Generate a complete, investor-ready business plan from your product, pricing, and market data in one click.",
  },
  {
    icon: Handshake,
    title: "B2B Opportunities",
    description:
      "Get matched with retailers, interior designers, hotels, and wholesalers looking for exactly what you make.",
  },
];

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload Your Product",
    description: "Snap a photo, add a name, category, and material — that's all it takes to get started.",
  },
  {
    icon: Wand2,
    title: "Let AI Build Your Listing",
    description: "AI analyses your product and generates a professional title, description, and pricing suggestion.",
  },
  {
    icon: TrendingUp,
    title: "Understand Your Market",
    description: "Compare your pricing against similar marketplace products and see where you stand.",
  },
  {
    icon: Building2,
    title: "Grow Your Business",
    description: "Plan your finances, generate a business plan, and connect with buyers ready to order in bulk.",
  },
];

const PIPELINE = [
  "Handmade Product",
  "AI Processing",
  "Professional Listing",
  "Marketplace",
  "Larger Buyers",
];

export default function LandingPage() {
  const featured = seedProducts.slice(0, 4);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="craft-texture absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge variant="default" className="mb-5">
              <Sparkles className="h-3 w-3" /> AI-Powered Artisan Marketplace
            </Badge>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[3.4rem]">
              Turn Your Craft Into a{" "}
              <span className="text-primary">Growing Digital Business.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">
              AI-powered tools that help traditional artisans create professional product
              listings, understand their market, plan finances, and connect with larger buyers.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/product-studio">
                  Start Creating <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-foreground-muted">
              <div>
                <p className="font-display text-xl font-semibold text-foreground">10</p>
                <p>Artisan Partners</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="font-display text-xl font-semibold text-foreground">
                  {seedProducts.length}
                </p>
                <p>Products Listed</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="font-display text-xl font-semibold text-foreground">8</p>
                <p>B2B Buyer Categories</p>
              </div>
            </div>
          </div>

          {/* Transformation visual */}
          <Card className="border-border-strong bg-surface/90 p-6">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              From craft to commerce
            </p>
            <div className="flex flex-col items-center gap-1.5">
              {PIPELINE.map((step, i) => (
                <div key={step} className="flex w-full flex-col items-center">
                  <div
                    className={`w-full rounded-lg border px-4 py-3 text-center text-sm font-medium ${
                      i === PIPELINE.length - 1
                        ? "border-primary bg-primary-soft text-primary-hover"
                        : "border-border bg-surface-muted text-foreground"
                    }`}
                  >
                    {step}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <ArrowDown className="my-1 h-4 w-4 text-foreground-muted/60" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            Everything an artisan needs, in one place
          </h2>
          <p className="mt-3 text-foreground-muted">
            Not just another place to sell — a complete AI business partner for traditional craft.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="p-5 transition-shadow hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <feature.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface-muted/50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              How it works
            </h2>
            <p className="mt-3 text-foreground-muted">
              Four steps from a handmade product to a business buyers can find and trust.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg font-semibold">
                  {i + 1}
                </div>
                <step.icon className="mt-4 h-6 w-6 text-secondary" strokeWidth={1.75} />
                <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              From the marketplace
            </h2>
            <p className="mt-3 text-foreground-muted">
              Real artisan products, discoverable by buyers across India.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/marketplace">
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => {
            const artisan = getArtisanById(product.artisanId);
            return (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
                  <ProductImage category={product.category} className="h-44 w-full" />
                  <div className="p-4">
                    <p className="line-clamp-1 font-display text-sm font-semibold text-foreground">
                      {product.name}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-foreground-muted">
                      <MapPin className="h-3 w-3" /> {artisan?.location}, {artisan?.state}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-display text-base font-semibold text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-foreground-muted">
                        <Star className="h-3 w-3 fill-accent text-accent" /> {artisan?.rating}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-border bg-secondary py-16 text-secondary-foreground md:py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 text-center">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">
            From Handmade Product to Digital Business.
          </h2>
          <p className="max-w-xl text-secondary-foreground/80">
            Join Kalakriti AI and let AI handle the listing, pricing, and business planning —
            while you focus on your craft.
          </p>
          <Button size="lg" variant="default" asChild className="mt-2">
            <Link href="/product-studio">
              Start Creating <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-foreground-muted">
        Kalakriti AI — a hackathon prototype. All artisan and buyer data shown is illustrative
        seed data.
      </footer>
    </div>
  );
}
