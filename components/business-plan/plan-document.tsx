"use client";

import { Textarea } from "@/components/ui/textarea";
import type { AIBusinessPlanSection } from "@/types";

export function PlanDocument({
  productName,
  generatedAt,
  sections,
  editing,
  onSectionChange,
}: {
  productName: string;
  generatedAt: string;
  sections: AIBusinessPlanSection[];
  editing: boolean;
  onSectionChange: (index: number, content: string) => void;
}) {
  return (
    <div id="business-plan-document" className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-10 shadow-sm">
      <div className="mb-8 border-b border-border pb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Kalakriti</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
          Business Plan — {productName}
        </h1>
        <p className="mt-1 text-xs text-foreground-muted">
          Generated on {new Date(generatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex flex-col gap-7">
        {sections.map((section, i) => (
          <section key={section.title}>
            <h2 className="font-display text-base font-semibold text-foreground">
              {i + 1}. {section.title}
            </h2>
            {editing ? (
              <Textarea
                value={section.content}
                onChange={(e) => onSectionChange(i, e.target.value)}
                className="mt-2 min-h-[90px] text-sm leading-relaxed"
              />
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{section.content}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
