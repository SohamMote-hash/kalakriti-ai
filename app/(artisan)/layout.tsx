import { Sidebar } from "@/components/shared/sidebar";

export default function ArtisanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden bg-background">{children}</main>
    </div>
  );
}
