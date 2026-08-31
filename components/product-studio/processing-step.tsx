"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PROCESSING_STEPS = [
  "Analyzing product image",
  "Identifying craft technique",
  "Detecting category",
  "Generating professional description",
  "Generating SEO tags",
];

export function ProcessingStep({ onDone }: { onDone: () => void }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (completed >= PROCESSING_STEPS.length) {
      const timer = setTimeout(onDone, 500);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setCompleted((c) => c + 1), 550);
    return () => clearTimeout(timer);
  }, [completed, onDone]);

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 py-14">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        </span>
        <div className="text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            AI is processing your product…
          </p>
          <p className="mt-1 text-sm text-foreground-muted">
            This usually takes a few seconds.
          </p>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-2.5">
          {PROCESSING_STEPS.map((step, i) => {
            const done = i < completed;
            const active = i === completed;
            return (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors",
                  done
                    ? "border-success/30 bg-success-soft text-success"
                    : active
                      ? "border-primary/30 bg-primary-soft/50 text-primary-hover"
                      : "border-border bg-surface text-foreground-muted",
                )}
              >
                {done ? (
                  <Check className="h-4 w-4 shrink-0" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border-2 border-current opacity-30" />
                )}
                {step}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
