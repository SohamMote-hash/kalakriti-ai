import {
  Amphora,
  Flame,
  Gem,
  Hammer,
  Home,
  Palette,
  Shirt,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { CraftCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_STYLE: Record<CraftCategory, { icon: LucideIcon; gradient: string }> = {
  "Bamboo Craft": { icon: Sprout, gradient: "from-[#d9c68f] via-[#c7ac6a] to-[#8a6a1f]" },
  Handloom: { icon: Shirt, gradient: "from-[#e3b79a] via-[#cf8a5e] to-[#a84a24]" },
  Pottery: { icon: Amphora, gradient: "from-[#a9c3d1] via-[#6f9bb0] to-[#35617a]" },
  Jewellery: { icon: Gem, gradient: "from-[#e8c9d6] via-[#c98aa3] to-[#8a3f6b]" },
  Woodwork: { icon: Hammer, gradient: "from-[#c9a980] via-[#a3773f] to-[#6b4a2b]" },
  "Traditional Art": { icon: Palette, gradient: "from-[#e2b6b6] via-[#c17a6f] to-[#7a3b3b]" },
  Textiles: { icon: Shirt, gradient: "from-[#e0c9a6] via-[#c99a58] to-[#a8752e]" },
  "Home Decor": { icon: Home, gradient: "from-[#cddccb] via-[#8fae8c] to-[#33513f]" },
  "Metal Craft": { icon: Flame, gradient: "from-[#e8d193] via-[#d3ac4c] to-[#a87c1f]" },
};

interface ProductImageProps {
  category: CraftCategory;
  className?: string;
  iconClassName?: string;
}

export function ProductImage({ category, className, iconClassName }: ProductImageProps) {
  const style = CATEGORY_STYLE[category] ?? CATEGORY_STYLE["Home Decor"];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        style.gradient,
        className,
      )}
    >
      <div className="craft-texture absolute inset-0 opacity-30" />
      <Icon
        className={cn("relative text-white/90 drop-shadow-sm", iconClassName ?? "h-10 w-10")}
        strokeWidth={1.5}
      />
    </div>
  );
}
