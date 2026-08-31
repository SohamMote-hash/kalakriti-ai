"use client";

import { useRef, useState } from "react";
import { ImagePlus, Sparkles, UploadCloud, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { marketplaceCategories } from "@/data/seedProducts";
import type { CraftCategory } from "@/types";
import { cn } from "@/lib/utils";

export interface ProductFormValues {
  productName: string;
  category: CraftCategory | "";
  material: string;
  shortDescription: string;
}

interface UploadStepProps {
  values: ProductFormValues;
  onChange: (patch: Partial<ProductFormValues>) => void;
  imagePreview: string | null;
  onImageSelect: (dataUrl: string | null) => void;
  onGenerate: () => void;
}

export function UploadStep({ values, onChange, imagePreview, onImageSelect, onGenerate }: UploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onImageSelect(reader.result as string);
    reader.readAsDataURL(file);
  }

  const canGenerate = Boolean(values.productName && values.category && values.material);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Product</CardTitle>
        <CardDescription>
          Add a photo and a few details — the AI Product Studio will handle the rest.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div
          className={cn(
            "flex min-h-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            dragActive ? "border-primary bg-primary-soft/40" : "border-border-strong bg-surface-muted/60",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          {imagePreview ? (
            <div className="relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Uploaded product"
                className="mx-auto max-h-52 rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={() => onImageSelect(null)}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <UploadCloud className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm font-medium text-foreground">
                Drag and drop a product photo
              </p>
              <p className="mt-1 text-xs text-foreground-muted">PNG or JPG, up to 10MB</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => inputRef.current?.click()}
              >
                <ImagePlus className="h-3.5 w-3.5" /> Browse files
              </Button>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="e.g. Handwoven Bamboo Basket"
              value={values.productName}
              onChange={(e) => onChange({ productName: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Craft Category</Label>
              <Select
                value={values.category}
                onValueChange={(v) => onChange({ category: v as CraftCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                placeholder="e.g. Natural Bamboo"
                value={values.material}
                onChange={(e) => onChange({ material: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="shortDescription">Short Description (optional)</Label>
            <Textarea
              id="shortDescription"
              placeholder="A quick note about your product — AI will expand on this."
              value={values.shortDescription}
              onChange={(e) => onChange({ shortDescription: e.target.value })}
              className="min-h-[84px]"
            />
          </div>

          <Button size="lg" disabled={!canGenerate} onClick={onGenerate} className="mt-1 self-start">
            <Sparkles className="h-4 w-4" /> Generate with AI
          </Button>
          {!canGenerate && (
            <p className="text-xs text-foreground-muted">
              Add a product name, category, and material to continue.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
