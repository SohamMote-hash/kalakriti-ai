import Link from "next/link";
import { Plus, BarChart3, Wallet, FileText, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

const ACTIONS: { label: string; href: string; icon: LucideIcon; tone: string }[] = [
  { label: "Add New Product", href: "/product-studio", icon: Plus, tone: "bg-primary text-primary-foreground" },
  { label: "Run Market Analysis", href: "/market-analysis", icon: BarChart3, tone: "bg-secondary text-secondary-foreground" },
  { label: "Open Financial Planner", href: "/financial-planner", icon: Wallet, tone: "bg-info text-white" },
  { label: "Generate Business Plan", href: "/business-plan", icon: FileText, tone: "bg-accent text-white" },
];

export function QuickActions() {
  return (
    <Card className="p-5">
      <p className="mb-4 font-display text-base font-semibold text-foreground">Quick Actions</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 rounded-lg border border-border p-3.5 transition-colors hover:border-border-strong hover:bg-surface-muted"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.tone}`}>
              <action.icon className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
