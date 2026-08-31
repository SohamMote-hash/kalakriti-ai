import { Redirect } from "expo-router";
import { useAppStore } from "@/store/useAppStore";

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const role = useAppStore((s) => s.role);

  if (!onboardingComplete) return <Redirect href="/onboarding" />;
  if (!role) return <Redirect href="/role" />;
  return <Redirect href="/(tabs)" />;
}
