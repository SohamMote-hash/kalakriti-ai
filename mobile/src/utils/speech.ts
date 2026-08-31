import * as Speech from "expo-speech";
import type { Language } from "@/types";

const SPEECH_LOCALE: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export function speak(text: string, language: Language) {
  Speech.stop();
  Speech.speak(text, { language: SPEECH_LOCALE[language], pitch: 1, rate: 0.95 });
}

export function stopSpeaking() {
  Speech.stop();
}
