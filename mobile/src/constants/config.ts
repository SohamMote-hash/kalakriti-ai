import { Platform } from "react-native";

/**
 * Base URL of the Kalakriti backend (the existing Next.js app's
 * /api/ai/* routes). Override by setting EXPO_PUBLIC_API_URL before
 * running `expo start` (e.g. EXPO_PUBLIC_API_URL=http://192.168.1.5:3000
 * so a physical device on the same network can reach your dev machine).
 *
 * If the backend is unreachable, every AI feature falls back to the
 * deterministic mock generators in services/mockAi.ts — the app never
 * hard-fails without a server or API key.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (Platform.OS === "android") return "http://10.0.2.2:3000";
  return "http://localhost:3000";
}

export const API_TIMEOUT_MS = 6000;
