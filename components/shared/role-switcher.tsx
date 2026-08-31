"use client";

import { usePathname, useRouter } from "next/navigation";
import { Store, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { UserRole } from "@/types";

const ARTISAN_ONLY_PREFIXES = [
  "/dashboard",
  "/product-studio",
  "/products",
  "/market-analysis",
  "/financial-planner",
  "/business-plan",
  "/b2b-opportunities",
  "/settings",
];

const BUYER_ONLY_PREFIXES = ["/buyer-dashboard"];

export function RoleSwitcher({ className }: { className?: string }) {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(next: UserRole) {
    if (next === role) return;
    setRole(next);

    const onArtisanOnly = ARTISAN_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
    const onBuyerOnly = BUYER_ONLY_PREFIXES.some((p) => pathname.startsWith(p));

    if (next === "buyer" && onArtisanOnly) {
      router.push("/buyer-dashboard");
    } else if (next === "artisan" && onBuyerOnly) {
      router.push("/dashboard");
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border-strong bg-surface-muted p-1",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => handleChange("artisan")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
          role === "artisan"
            ? "bg-surface text-primary shadow-sm"
            : "text-foreground-muted hover:text-foreground",
        )}
      >
        <User className="h-3.5 w-3.5" />
        Artisan Mode
      </button>
      <button
        type="button"
        onClick={() => handleChange("buyer")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
          role === "buyer"
            ? "bg-surface text-secondary shadow-sm"
            : "text-foreground-muted hover:text-foreground",
        )}
      >
        <Store className="h-3.5 w-3.5" />
        Buyer Mode
      </button>
    </div>
  );
}
