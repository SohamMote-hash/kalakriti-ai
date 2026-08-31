import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-5";

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Calls Claude with a system + user prompt and parses the response as JSON.
 * Throws on any failure (missing key, network error, malformed JSON) so
 * callers can fall back to deterministic mock generation — the platform
 * must always work without an API key.
 */
export async function callClaudeJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 2048,
): Promise<T> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content returned by AI provider");
  }

  const raw = textBlock.text.trim();
  const jsonString = extractJson(raw);
  return JSON.parse(jsonString) as T;
}

export async function callClaudeText(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 3000,
): Promise<string> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content returned by AI provider");
  }
  return textBlock.text.trim();
}

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) return fenced[1];
  const firstBrace = raw.indexOf("{");
  const firstBracket = raw.indexOf("[");
  const start =
    firstBrace === -1
      ? firstBracket
      : firstBracket === -1
        ? firstBrace
        : Math.min(firstBrace, firstBracket);
  if (start === -1) return raw;
  return raw.slice(start);
}
