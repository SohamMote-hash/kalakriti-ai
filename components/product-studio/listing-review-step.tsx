"use client";

import { useState } from "react";
import { RefreshCw, X, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AIBadge } from "@/components/shared/ai-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { marketplaceCategories } from "@/data/seedProducts";
import type { CraftCategory } from "@/types";

export interface EditableListing {
  title: string;
  description: string;
  category: CraftCategory;
  materials: string[];
  tags: string[];
  craftTechnique: string;
  price: number;
}

interface ListingReviewStepProps {
  listing: EditableListing;
  onChange: (patch: Partial<EditableListing>) => void;
  onRegenerate: () => void;
  regenerating: boolean;
  onContinue: () => void;
  source: "ai" | "mock" | null;
}

export function ListingReviewStep({
  listing,
  onChange,
  onRegenerate,
  regenerating,
  onContinue,
  source,
}: ListingReviewStepProps) {
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const value = tagInput.trim().replace(/^#/, "");
    if (value && !listing.tags.includes(value)) {
      onChange({ tags: [...listing.tags, value] });
    }
    setTagInput("");
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>AI Generated Product Listing</CardTitle>
          <CardDescription>Review and edit anything before moving to preview.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <AIBadge label={source === "ai" ? "AI Generated" : "AI Generated (offline mock)"} />
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={regenerating}>
            <RefreshCw className={regenerating ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            Regenerate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-1.5">
          <Label htmlFor="title">Professional Product Title</Label>
          <Input id="title" value={listing.title} onChange={(e) => onChange({ title: e.target.value })} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="description">Professional Description</Label>
          <Textarea
            id="description"
            value={listing.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className="min-h-[130px]"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Select value={listing.category} onValueChange={(v) => onChange({ category: v as CraftCategory })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {marketplaceCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="materials">Materials</Label>
            <Input
              id="materials"
              value={listing.materials.join(", ")}
              onChange={(e) => onChange({ materials: e.target.value.split(",").map((m) => m.trim()).filter(Boolean) })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="price">Suggested Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={listing.price}
              onChange={(e) => onChange({ price: Number(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="technique">Craft Technique</Label>
          <Input
            id="technique"
            value={listing.craftTechnique}
            onChange={(e) => onChange({ craftTechnique: e.target.value })}
          />
        </div>

        <div className="grid gap-1.5">
          <Label>AI Generated Tags</Label>
          <div className="flex flex-wrap items-center gap-2">
            {listing.tags.map((tag) => (
              <Badge key={tag} variant="default" className="gap-1 pr-1.5">
                #{tag}
                <button
                  type="button"
                  onClick={() => onChange({ tags: listing.tags.filter((t) => t !== tag) })}
                  className="rounded-full p-0.5 hover:bg-primary-hover/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag + Enter"
              className="h-7 w-32 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="lg" onClick={onContinue}>
            <Check className="h-4 w-4" /> Accept &amp; Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
