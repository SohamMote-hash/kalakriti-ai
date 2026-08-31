import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart3, ChevronRight, FileText, Handshake, Heart, PackageSearch, Wallet } from "lucide-react-native";
import { Badge, Card } from "@/components/ui";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useAppStore } from "@/store/useAppStore";

export default function InsightsTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const role = useAppStore((s) => s.role);
  const savedProductIds = useAppStore((s) => s.savedProductIds);
  const bulkOrderRequests = useAppStore((s) => s.bulkOrderRequests);
  const products = useAppStore((s) => s.products);

  const items = [
    { key: "market", title: t("insightsHub.marketAnalysisTitle"), body: t("insightsHub.marketAnalysisBody"), icon: BarChart3, color: colors.primary, href: "/market-analysis" as const },
    { key: "financial", title: t("insightsHub.financialPlannerTitle"), body: t("insightsHub.financialPlannerBody"), icon: Wallet, color: colors.info, href: "/financial-planner" as const },
    { key: "plan", title: t("insightsHub.businessPlanTitle"), body: t("insightsHub.businessPlanBody"), icon: FileText, color: colors.accent, href: "/business-plan" as const },
    { key: "b2b", title: t("insightsHub.b2bTitle"), body: t("insightsHub.b2bBody"), icon: Handshake, color: colors.secondary, href: "/b2b-opportunities" as const },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t("insightsHub.title")}</Text>
        <Text style={styles.subtitle}>{t("insightsHub.subtitle")}</Text>

        {role === "artisan" ? (
          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable key={item.key} onPress={() => router.push(item.href)}>
                  <Card style={styles.row}>
                    <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
                      <Icon size={20} color={colors.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{item.title}</Text>
                      <Text style={styles.rowBody}>{item.body}</Text>
                    </View>
                    <ChevronRight size={18} color={colors.foregroundMuted} />
                  </Card>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            <Card style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: colors.danger }]}>
                <Heart size={20} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{t("buyerHome.savedTitle")}</Text>
                <Text style={styles.rowBody}>{savedProductIds.length}</Text>
              </View>
            </Card>

            <Text style={styles.sectionLabel}>{t("buyerHome.bulkOpportunitiesTitle")}</Text>
            {bulkOrderRequests.length === 0 ? (
              <Card>
                <Text style={styles.rowBody}>—</Text>
              </Card>
            ) : (
              bulkOrderRequests.map((req) => {
                const product = products.find((p) => p.id === req.productId);
                return (
                  <Card key={req.id} style={styles.orderRow}>
                    <View style={[styles.iconWrap, { backgroundColor: colors.secondary }]}>
                      <PackageSearch size={18} color={colors.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{product?.name ?? "—"}</Text>
                      <Text style={styles.rowBody}>{req.quantity} units</Text>
                    </View>
                    <Badge label={req.status} tone="info" />
                  </Card>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { fontSize: fontSize.xxl, fontWeight: "700", color: colors.foreground },
  subtitle: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  orderRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWrap: { width: 42, height: 42, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  rowTitle: { fontSize: fontSize.base, fontWeight: "700", color: colors.foreground },
  rowBody: { fontSize: fontSize.sm, color: colors.foregroundMuted, marginTop: 2 },
  sectionLabel: { fontSize: fontSize.sm, fontWeight: "700", color: colors.foreground, marginTop: spacing.sm },
});
