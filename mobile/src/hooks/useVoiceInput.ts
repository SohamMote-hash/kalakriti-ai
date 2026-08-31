import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Voice input architecture: mic press -> speech-to-text -> (language is
 * whatever the app's current locale is) -> caller does something with the
 * transcript -> optional text-to-speech response (see utils/speech.ts).
 *
 * Expo Go has no bundled on-device speech-to-text engine, and pulling in a
 * native STT module would require a custom dev client build — not viable
 * for a hackathon prototype that must run in Expo Go. Per the product
 * spec, this ships a clean, demo-safe fallback instead: a realistic
 * "listening" state followed by a localized sample transcript. Swapping
 * in real STT later only means replacing the body of `transcribe()`.
 */
export function useVoiceInput(onResult: (text: string) => void) {
  const { t } = useTranslation();
  const [listening, setListening] = useState(false);
  const timer = useRef<number | NodeJS.Timeout | null>(null);

  const transcribe = useCallback(async (): Promise<string> => {
    await new Promise((resolve) => {
      timer.current = setTimeout(resolve, 1500);
    });
    return t("voice.demoSample");
  }, [t]);

  const start = useCallback(() => {
    if (listening) return;
    setListening(true);
    transcribe().then((text) => {
      setListening(false);
      onResult(text);
    });
  }, [listening, transcribe, onResult]);

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setListening(false);
  }, []);

  return { listening, start, cancel };
}
