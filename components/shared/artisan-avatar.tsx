import { cn } from "@/lib/utils";
import type { Artisan } from "@/types";

export function ArtisanAvatar({
  artisan,
  className,
}: {
  artisan: Pick<Artisan, "initials" | "avatarColor">;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full font-display font-semibold text-white",
        artisan.avatarColor,
        className ?? "h-9 w-9 text-sm",
      )}
    >
      {artisan.initials}
    </span>
  );
}
