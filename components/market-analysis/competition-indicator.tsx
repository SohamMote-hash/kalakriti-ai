import { AlertTriangle, CheckCircle2, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { COMPETITION_COLOR } from "@/lib/chartColors";
import { cn } from "@/lib/utils";

const LEVELS: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];
const ICONS = { Low: CheckCircle2, Medium: AlertTriangle, High: Flame };

export function CompetitionIndicator({ level }: { level: "Low" | "Medium" | "High" }) {
  const Icon = ICONS[level];
  const activeIndex = LEVELS.indexOf(level);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competition Level</CardTitle>
        <CardDescription>How crowded this category is on the marketplace.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: `${COMPETITION_COLOR[level]}22`, color: COMPETITION_COLOR[level] }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <p className="font-display text-2xl font-semibold text-foreground">{level}</p>
        </div>
        <div className="mt-4 flex gap-1.5">
          {LEVELS.map((l, i) => (
            <div
              key={l}
              className={cn("h-2 flex-1 rounded-full transition-colors")}
              style={{
                backgroundColor: i <= activeIndex ? COMPETITION_COLOR[level] : "#e7dcc7",
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-foreground-muted">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </CardContent>
    </Card>
  );
}
