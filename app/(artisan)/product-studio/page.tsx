"use client";

import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { StepIndicator } from "@/components/product-studio/step-indicator";
import { UploadStep, type ProductFormValues } from "@/components/product-studio/upload-step";
import { ProcessingStep } from "@/components/product-studio/processing-step";
import { ListingReviewStep, type EditableListing } from "@/components/product-studio/listing-review-step";
import { PublishPreviewStep } from "@/components/product-studio/publish-preview-step";
import { useAppStore } from "@/lib/store";
import { currentArtisan } from "@/data/seedArtisans";
import { generateId } from "@/lib/utils";
import type { AIProductListingInput, AIProductListingOutput, Product } from "@/types";

const EMPTY_FORM: ProductFormValues = {
  productName: "",
  category: "",
  material: "",
  shortDescription: "",
};

async function requestListing(input: AIProductListingInput) {
  const res = await fetch("/api/ai/listing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return (await res.json()) as { output: AIProductListingOutput; source: "ai" | "mock" };
}

export default function ProductStudioPage() {
  const addProduct = useAppStore((s) => s.addProduct);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [listing, setListing] = useState<EditableListing | null>(null);
  const [aiSource, setAiSource] = useState<"ai" | "mock" | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [publishedProductId, setPublishedProductId] = useState<string | null>(null);

  const pendingResult = useRef<Promise<{ output: AIProductListingOutput; source: "ai" | "mock" }> | null>(null);

  function handleGenerate() {
    if (!form.category) return;
    pendingResult.current = requestListing({
      productName: form.productName,
      category: form.category,
      material: form.material,
      shortDescription: form.shortDescription,
    });
    setStep(2);
  }

  async function handleProcessingDone() {
    const result = await pendingResult.current;
    if (!result) return;
    setListing({
      title: result.output.title,
      description: result.output.description,
      category: result.output.category,
      materials: result.output.materials,
      tags: result.output.tags,
      craftTechnique: result.output.craftTechnique,
      price: result.output.suggestedPrice,
    });
    setAiSource(result.source);
    setStep(3);
  }

  async function handleRegenerate() {
    if (!form.category) return;
    setRegenerating(true);
    try {
      const result = await requestListing({
        productName: form.productName,
        category: form.category,
        material: form.material,
        shortDescription: form.shortDescription,
      });
      setListing({
        title: result.output.title,
        description: result.output.description,
        category: result.output.category,
        materials: result.output.materials,
        tags: result.output.tags,
        craftTechnique: result.output.craftTechnique,
        price: result.output.suggestedPrice,
      });
      setAiSource(result.source);
    } finally {
      setRegenerating(false);
    }
  }

  function buildProduct(status: "draft" | "published"): Product {
    const l = listing!;
    return {
      id: generateId("prod"),
      artisanId: currentArtisan.id,
      name: l.title,
      category: l.category,
      material: l.materials.join(", "),
      description: l.description,
      shortDescription: form.shortDescription || l.description.slice(0, 120),
      price: l.price,
      tags: l.tags,
      status,
      craftTechnique: l.craftTechnique,
      productionTimeDays: 7,
      availableQuantity: 20,
      views: 0,
      enquiries: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      aiGenerated: true,
    };
  }

  function handleSaveDraft() {
    if (!listing) return;
    const product = buildProduct("draft");
    addProduct(product);
    setPublishedProductId(null);
    setStep(1);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setListing(null);
  }

  function handlePublish() {
    if (!listing) return;
    const product = buildProduct("published");
    addProduct(product);
    setPublishedProductId(product.id);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-2 flex items-center gap-3">
        {step > 1 && !publishedProductId && (
          <button
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as typeof step) : s))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-surface-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            AI Product Studio
          </h1>
          <p className="mt-1 text-foreground-muted">
            Turn your handmade product into a professional online listing.
          </p>
        </div>
      </div>

      <div className="my-7">
        <StepIndicator current={step} />
      </div>

      {step === 1 && (
        <UploadStep
          values={form}
          onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          imagePreview={imagePreview}
          onImageSelect={setImagePreview}
          onGenerate={handleGenerate}
        />
      )}

      {step === 2 && <ProcessingStep onDone={handleProcessingDone} />}

      {step === 3 && listing && (
        <ListingReviewStep
          listing={listing}
          onChange={(patch) => setListing((l) => (l ? { ...l, ...patch } : l))}
          onRegenerate={handleRegenerate}
          regenerating={regenerating}
          onContinue={() => setStep(4)}
          source={aiSource}
        />
      )}

      {step === 4 && listing && (
        <PublishPreviewStep
          listing={listing}
          imagePreview={imagePreview}
          artisan={currentArtisan}
          onEdit={() => setStep(3)}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          publishedProductId={publishedProductId}
        />
      )}

      {step === 1 && (
        <p className="mt-4 text-center text-xs text-foreground-muted">
          Tip: try &quot;Handwoven Bamboo Basket&quot; · Home Decor · Natural Bamboo for the full demo flow
        </p>
      )}
    </div>
  );
}
