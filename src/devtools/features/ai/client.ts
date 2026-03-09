import type { AiProvider, AiSettings } from "../core/domain";
import { extractJsonObject } from "../core/helpers";

const PROVIDER_HOST_ALLOWLIST: Record<Exclude<AiProvider, "custom">, string[]> = {
  openai: ["api.openai.com"],
  anthropic: ["api.anthropic.com"],
  groq: ["api.groq.com"]
};

export const isEndpointAllowed = (provider: AiProvider, endpoint: string, allowUnsafe: boolean): boolean => {
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:") return false;
    if (allowUnsafe) return true;
    if (provider === "custom") return false;
    const allowedHosts = PROVIDER_HOST_ALLOWLIST[provider];
    return allowedHosts.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
};

const ensureAiRequestAllowed = (
  settings: AiSettings,
  apiKeyRaw: string
): { apiKey: string; isAnthropic: boolean } => {
  const apiKey = apiKeyRaw.trim();
  if (!settings.endpoint.trim() || !settings.model.trim() || !apiKey) {
    throw new Error("Fill AI endpoint, model, and API key first.");
  }
  if (!isEndpointAllowed(settings.provider, settings.endpoint, settings.allowUnsafeEndpoint)) {
    throw new Error(
      "Endpoint blocked. Use HTTPS and a trusted provider endpoint, or enable unsafe endpoint override."
    );
  }
  return { apiKey, isAnthropic: settings.provider === "anthropic" };
};

export const callAiForJson = async (
  settings: AiSettings,
  apiKeyRaw: string,
  systemPrompt: string,
  userPayload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const { apiKey, isAnthropic } = ensureAiRequestAllowed(settings, apiKeyRaw);
  const userContent = JSON.stringify(userPayload, null, 2);
  const payload = isAnthropic
    ? {
        model: settings.model,
        max_tokens: 1400,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }]
      }
    : {
        model: settings.model,
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ]
      };

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (isAnthropic) {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(settings.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`LLM call failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    content?: Array<{ type?: string; text?: string }>;
  };
  const content = isAnthropic
    ? data.content?.find((item) => item.type === "text")?.text
    : data.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("LLM response does not include message content.");
  }

  return JSON.parse(extractJsonObject(content)) as Record<string, unknown>;
};
