import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import type { Enquiry, Product } from "@/types";

const STATUS_VARIANT = {
  new: "info",
  responded: "success",
  closed: "neutral",
} as const;

export function RecentEnquiries({
  enquiries,
  products,
}: {
  enquiries: Enquiry[];
  products: Product[];
}) {
  const sorted = [...enquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Buyer Enquiries</CardTitle>
        <CardDescription>Messages from buyers interested in your products.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {sorted.length === 0 && (
          <p className="py-6 text-center text-sm text-foreground-muted">
            No enquiries yet. Publish products to start receiving buyer interest.
          </p>
        )}
        {sorted.map((enquiry) => {
          const product = products.find((p) => p.id === enquiry.productId);
          return (
            <div
              key={enquiry.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3.5"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-info-soft text-info">
                <MessageSquare className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {enquiry.buyerName}{" "}
                    <span className="font-normal text-foreground-muted">
                      · {enquiry.buyerCompany}
                    </span>
                  </p>
                  <Badge variant={STATUS_VARIANT[enquiry.status]}>{enquiry.status}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  On {product?.name ?? "your product"} · {enquiry.quantity} units
                </p>
                <p className="mt-1.5 text-sm text-foreground-muted line-clamp-2">
                  {enquiry.message}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
