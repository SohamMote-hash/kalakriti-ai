import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/shared/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Kalakriti AI — From Handmade Craft to Digital Business",
  description:
    "AI-powered digital marketplace and business intelligence platform helping rural and traditional Indian artisans turn handmade products into professional online businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TooltipProvider delayDuration={150}>
          <TopNav />
          <div className="flex flex-1 flex-col">{children}</div>
        </TooltipProvider>
      </body>
    </html>
  );
}
