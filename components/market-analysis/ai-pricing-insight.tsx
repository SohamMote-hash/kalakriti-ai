import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AIBadge } from "@/components/shared/ai-badge";

export function AIPricingInsight({ reasoning }: { reasoning: string }) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary-soft/50 to-surface">
      <CardContent className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-display text-base font-semibold text-foreground">Pricing Insight</p>
          <AIBadge />
        </div>
        <p className="text-sm leading-relaxed text-foreground">{reasoning}</p>
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-surface/70 p-3 text-xs text-foreground-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>
            This is AI assistance. Recommendations are based on marketplace data and should be
            reviewed by the artisan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
