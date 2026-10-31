import { createOpenAI } from "@ai-sdk/openai";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export const LOVABLE_MODEL = "openai/gpt-6-astra";
export const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";

/** Builds a request-scoped gateway provider. Never share between requests. */
export function createGatewayProvider(initialRunId?: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");
  const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
  const provider = createOpenAI({
    apiKey,
    baseURL: GATEWAY_URL,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });
  return { provider, runIdFetch };
}

export const responsesOptions = {
  forceReasoning: true,
  reasoningEffort: "low" as const,
  reasoningSummary: "auto" as const,
  store: false,
  include: ["reasoning.encrypted_content"],
};
