import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Compass className="h-7 w-7" />
      </span>
      <h1 className="font-display text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-sm text-foreground-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
