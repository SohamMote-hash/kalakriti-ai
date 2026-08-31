"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import { Logo } from "./logo";
import { RoleSwitcher } from "./role-switcher";
import { useAppStore } from "@/lib/store";
import { currentArtisan } from "@/data/seedArtisans";
import { ArtisanAvatar } from "./artisan-avatar";
import { cn } from "@/lib/utils";

export function TopNav() {
  const role = useAppStore((s) => s.role);
  const pathname = usePathname();

  const links =
    role === "artisan"
      ? [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Marketplace", href: "/marketplace" },
        ]
      : [
          { label: "Marketplace", href: "/marketplace" },
          { label: "Buyer Dashboard", href: "/buyer-dashboard" },
        ];

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-6 border-b border-border bg-background/90 px-6 backdrop-blur">
      <Logo />
      <nav className="hidden items-center gap-1 md:flex">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-surface-muted text-foreground"
                  : "text-foreground-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <RoleSwitcher />
        {role === "artisan" ? (
          <ArtisanAvatar artisan={currentArtisan} className="h-9 w-9 text-xs" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Store className="h-4 w-4" />
          </span>
        )}
      </div>
    </header>
  );
}
