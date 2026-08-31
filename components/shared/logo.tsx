import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 shrink-0", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="h-4.5 w-4.5" strokeWidth={2} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-semibold tracking-tight text-foreground">
          Kalakriti
        </span>
        <span className="text-[10.5px] font-medium uppercase tracking-wide text-foreground-muted">
          Craft to Digital Business
        </span>
      </span>
    </Link>
  );
}
