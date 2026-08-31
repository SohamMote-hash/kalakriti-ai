import React, { useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CheckCircle2, ImagePlus, Pencil, Upload } from "lucide-react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AIBadge, Badge, Button, Card, TextAreaField, TextField } from "@/components/ui";
import { SelectField } from "@/components/SelectField";
import { StepProgressBar } from "@/components/Progress";
import { ProcessingChecklist } from "@/components/ProcessingChecklist";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { ProductImage } from "@/components/ProductImage";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useAppStore } from "@/store/useAppStore";
import { currentArtisan } from "@/data/seedArtisans";
import { MARKETPLACE_CATEGORIES } from "@/constants/categories";
import { generateProductListing } from "@/services/ai";
import { formatCurrency, generateId } from "@/utils/format";
import type { AIProductListingOutput, CraftCategory, Product } from "@/types";

type Step = 1 | 2 | 3 | 4;

interface EditableListing {
  title: string;
  description: string;
  category: CraftCategory;
  materials: string[];
  tags: string[];
  craftTechnique: string;
  price: number;
}

export default function ProductStudioScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const addProduct = useAppStore((s) => s.addProduct);
  const { imageUri, pickFromCamera, pickFromGallery, reset } = useImagePicker();

  const [step, setStep] = useState<Step>(1);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState<CraftCategory | "">("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [listing, setListing] = useState<EditableListing | null>(null);
  const [source, setSource] = useState<"ai" | "mock">("mock");
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const pendingResult = useRef<Promise<{ output: AIProductListingOutput; source: "ai" | "mock" }> | null>(null);

  const canContinue = Boolean(productName && category && material);

  function handleGenerate() {
    if (!category) return;
    pendingResult.current = generateProductListing({ productName, category, material, shortDescription: description });
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
    setSource(result.source);
    setStep(3);
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
      shortDescription: description || l.description.slice(0, 120),
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

  function resetAll() {
    setStep(1);
    setProductName("");
    setCategory("");
    setMaterial("");
    setDescription("");
    setListing(null);
    setPublishedId(null);
    reset();
  }

  function handleSaveDraft() {
    addProduct(buildProduct("draft"));
    router.replace("/(tabs)");
  }

  function handlePublish() {
    const product = buildProduct("published");
    addProduct(product);
    setPublishedId(product.id);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScreenHeader title={t("nav.create")} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {step < 4 && (
          <StepProgressBar step={step} total={3} label={t("productStudio.stepOf", { step, total: 3 })} />
        )}

        {step === 1 && (
          <View style={{ gap: spacing.lg, marginTop: spacing.lg }}>
            <Text style={styles.stepTitle}>{t("productStudio.step1Title")}</Text>

            {imageUri ? (
              <View>
                <Image source={{ uri: imageUri }} style={styles.photoPreview} alt="" />
                <Button label={t("productStudio.retakePhoto")} variant="outline" size="sm" onPress={reset} style={{ marginTop: spacing.sm }} />
              </View>
            ) : (
              <View style={styles.photoRow}>
                <Button label={t("productStudio.takePhoto")} variant="soft" icon={<Camera size={16} color={colors.primaryHover} />} onPress={pickFromCamera} style={{ flex: 1 }} />
                <Button label={t("productStudio.uploadGallery")} variant="outline" icon={<ImagePlus size={16} color={colors.foreground} />} onPress={pickFromGallery} style={{ flex: 1 }} />
              </View>
            )}

            <TextField
              label={t("productStudio.productName")}
              placeholder={t("productStudio.productNamePlaceholder")}
              value={productName}
              onChangeText={setProductName}
            />
            <SelectField
              label={t("productStudio.craftCategory")}
              value={category}
              onChange={(v) => setCategory(v as CraftCategory)}
              placeholder={t("productStudio.selectCategory")}
              options={MARKETPLACE_CATEGORIES.map((c) => ({ label: t(`categories.${c}`), value: c }))}
            />
            <TextField
              label={t("productStudio.material")}
              placeholder={t("productStudio.materialPlaceholder")}
              value={material}
              onChangeText={setMaterial}
            />
            <View>
              <View style={styles.descHeader}>
                <Text style={styles.label}>{t("productStudio.description")}</Text>
                <VoiceInputButton compact onResult={(text) => setDescription((d) => (d ? `${d} ${text}` : text))} />
              </View>
              <TextAreaField
                placeholder={t("productStudio.descriptionPlaceholder")}
                value={description}
                onChangeText={setDescription}
              />
              <Text style={styles.voiceHint}>{t("productStudio.voiceHint")}</Text>
            </View>

            <Button label={t("common.continue")} size="lg" disabled={!canContinue} onPress={handleGenerate} />
            {!canContinue && <Text style={styles.hint}>{t("productStudio.fillRequiredHint")}</Text>}
          </View>
        )}

        {step === 2 && (
          <ProcessingChecklist
            title={t("productStudio.processingTitle")}
            subtitle={t("productStudio.processingSubtitle")}
            steps={[
              t("productStudio.processingStep1"),
              t("productStudio.processingStep2"),
              t("productStudio.processingStep3"),
              t("productStudio.processingStep4"),
              t("productStudio.processingStep5"),
            ]}
            onDone={handleProcessingDone}
          />
        )}

        {step === 3 && listing && (
          <View style={{ gap: spacing.lg, marginTop: spacing.lg }}>
            <View style={styles.rowBetween}>
              <Text style={styles.stepTitle}>{t("productStudio.listingTitle")}</Text>
              <AIBadge label={source === "ai" ? t("common.aiGenerated") : t("productStudio.aiGeneratedMock")} />
            </View>

            <TextField label={t("productStudio.fieldTitle")} value={listing.title} onChangeText={(v) => setListing({ ...listing, title: v })} />
            <TextAreaField
              label={t("productStudio.fieldDescription")}
              value={listing.description}
              onChangeText={(v) => setListing({ ...listing, description: v })}
              style={{ minHeight: 120 }}
            />
            <TextField
              label={t("productStudio.fieldMaterials")}
              value={listing.materials.join(", ")}
              onChangeText={(v) => setListing({ ...listing, materials: v.split(",").map((m) => m.trim()).filter(Boolean) })}
            />
            <TextField
              label={t("productStudio.fieldPriceRange")}
              keyboardType="number-pad"
              value={String(listing.price)}
              onChangeText={(v) => setListing({ ...listing, price: Number(v) || 0 })}
            />
            <View>
              <Text style={styles.label}>{t("productStudio.fieldTags")}</Text>
              <View style={styles.tagsRow}>
                {listing.tags.map((tag) => (
                  <Badge key={tag} label={`#${tag}`} tone="primary" />
                ))}
              </View>
            </View>

            <Button label={t("productStudio.acceptContinue")} size="lg" onPress={() => setStep(4)} />
          </View>
        )}

        {step === 4 && listing && !publishedId && (
          <View style={{ gap: spacing.lg, marginTop: spacing.lg }}>
            <Text style={styles.stepTitle}>{t("productStudio.publishTitle")}</Text>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.photoPreview} alt="" />
              ) : (
                <ProductImage category={listing.category} size={200} radius={0} fullWidth />
              )}
              <View style={{ padding: spacing.lg, gap: 6 }}>
                <Badge label={t(`categories.${listing.category}`)} tone="secondary" />
                <Text style={styles.previewTitle}>{listing.title}</Text>
                <Text style={styles.previewPrice}>{formatCurrency(listing.price)}</Text>
                <Text style={styles.previewDesc} numberOfLines={4}>
                  {listing.description}
                </Text>
              </View>
            </Card>
            <Button label={t("productStudio.publish")} size="lg" icon={<Upload size={16} color={colors.primaryForeground} />} onPress={handlePublish} />
            <Button label={t("productStudio.saveDraft")} variant="outline" onPress={handleSaveDraft} />
            <Button label={t("common.edit")} variant="ghost" icon={<Pencil size={14} color={colors.foreground} />} onPress={() => setStep(3)} />
          </View>
        )}

        {step === 4 && publishedId && (
          <View style={styles.successState}>
            <View style={styles.successIcon}>
              <CheckCircle2 size={36} color={colors.success} />
            </View>
            <Text style={styles.stepTitle}>{t("productStudio.publishedTitle")}</Text>
            <Text style={styles.previewDesc}>{t("productStudio.publishedBody", { title: listing?.title })}</Text>
            <View style={{ gap: spacing.sm, width: "100%", marginTop: spacing.md }}>
              <Button label={t("productStudio.runMarketAnalysis")} onPress={() => router.replace("/market-analysis")} />
              <Button label={t("productStudio.viewListing")} variant="outline" onPress={() => router.replace(`/product/${publishedId}`)} />
              <Button label={t("productStudio.addAnother")} variant="ghost" onPress={resetAll} />
              <Button label={t("productStudio.backToHome")} variant="ghost" onPress={() => router.replace("/(tabs)")} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  stepTitle: { fontSize: fontSize.xl, fontWeight: "700", color: colors.foreground },
  photoRow: { flexDirection: "row", gap: spacing.sm },
  photoPreview: { width: "100%", height: 200, borderRadius: radius.md },
  label: { fontSize: fontSize.sm, fontWeight: "600", color: colors.foreground, marginBottom: 6 },
  descHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  voiceHint: { fontSize: 11, color: colors.foregroundMuted, marginTop: 4 },
  hint: { fontSize: 12, color: colors.foregroundMuted, textAlign: "center" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  previewTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  previewPrice: { fontSize: fontSize.xl, fontWeight: "700", color: colors.primary },
  previewDesc: { fontSize: fontSize.sm, color: colors.foregroundMuted, lineHeight: 20, textAlign: "center" },
  successState: { alignItems: "center", gap: spacing.sm, paddingTop: spacing.xxxl },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
});
