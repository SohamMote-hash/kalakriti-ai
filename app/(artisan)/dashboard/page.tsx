"use client";

import { useMemo } from "react";
import { Package, Eye, MessageSquare, IndianRupee } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ProductPerformanceChart } from "@/components/dashboard/product-performance-chart";
import { RecentEnquiries } from "@/components/dashboard/recent-enquiries";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useAppStore } from "@/lib/store";
import { currentArtisan } from "@/data/seedArtisans";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const products = useAppStore((s) => s.products);
  const enquiries = useAppStore((s) => s.enquiries);

  const myProducts = useMemo(
    () => products.filter((p) => p.artisanId === currentArtisan.id),
    [products],
  );

  const myEnquiries = useMemo(
    () => enquiries.filter((e) => myProducts.some((p) => p.id === e.productId)),
    [enquiries, myProducts],
  );

  const totalViews = myProducts.reduce((sum, p) => sum + p.views, 0);
  const estimatedRevenue = myProducts.reduce((sum, p) => {
    const estimatedUnits = Math.max(2, Math.round(p.enquiries * 1.6));
    return sum + p.price * estimatedUnits;
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            Good morning, {currentArtisan.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-foreground-muted">
            Here&apos;s how your craft business is performing.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Products"
          value={String(myProducts.length)}
          icon={Package}
          delta={`${myProducts.filter((p) => p.status === "published").length} published`}
          iconTone="primary"
        />
        <KpiCard
          label="Product Views"
          value={formatCompactNumber(totalViews)}
          icon={Eye}
          delta="+18% vs last month"
          iconTone="info"
        />
        <KpiCard
          label="Buyer Enquiries"
          value={String(myEnquiries.length)}
          icon={MessageSquare}
          delta={`${myEnquiries.filter((e) => e.status === "new").length} awaiting response`}
          deltaTone={myEnquiries.some((e) => e.status === "new") ? "warning" : "positive"}
          iconTone="secondary"
        />
        <KpiCard
          label="Est. Monthly Revenue"
          value={formatCurrency(estimatedRevenue)}
          icon={IndianRupee}
          delta="Based on recent enquiry activity"
          iconTone="accent"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProductPerformanceChart products={myProducts} />
          <RecentEnquiries enquiries={myEnquiries} products={myProducts} />
        </div>
        <div className="flex flex-col gap-6">
          <AIInsights products={myProducts} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
