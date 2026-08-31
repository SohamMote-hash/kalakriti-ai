"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Store,
  BarChart3,
  Wallet,
  FileText,
  Handshake,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Product Studio", href: "/product-studio", icon: Sparkles },
  { label: "My Products", href: "/products", icon: Store },
  { label: "Market Analysis", href: "/market-analysis", icon: BarChart3 },
  { label: "Financial Planner", href: "/financial-planner", icon: Wallet },
  { label: "Business Plan", href: "/business-plan", icon: FileText },
  { label: "B2B Opportunities", href: "/b2b-opportunities", icon: Handshake },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/60 px-3 py-5 lg:flex">
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary-soft text-primary-hover"
                  : "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={active ? 2.25 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4">
        <p className="text-xs font-semibold text-foreground">Need inspiration?</p>
        <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
          Try the AI Product Studio to turn your next handmade piece into a professional listing in minutes.
        </p>
      </div>
    </aside>
  );
}
