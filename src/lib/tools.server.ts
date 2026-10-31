import { streamText } from "ai";
import { createGatewayProvider, LOVABLE_MODEL, responsesOptions } from "./ai/gateway.server";

async function complete(prompt: string, system: string, maxOutputTokens?: number) {
  const { provider } = createGatewayProvider();
  const result = streamText({
    model: provider.responses(LOVABLE_MODEL),
    instructions: system,
    prompt,
    providerOptions: { openai: responsesOptions },
    maxOutputTokens,
  });
  return await result.text;
}

export async function generateAudit(url: string) {
  const clean = url.replace(/^https?:\/\//, "").replace(/\/$/, "").slice(0, 200);
  return complete(
    `A business owner wants a first-pass website audit for ${clean}. You cannot load the page. Give: (1) a score out of 100 for likely speed, (2) a score for likely SEO, (3) a score for conversion readiness, each with a one-line reason, then (4) five prioritised improvement areas with one-sentence actions. Be specific to the industry if the domain suggests one. Keep it under 300 words. Use short markdown headings.`,
    "You are Benji Agency's website auditor. Give practical, honest advice. Never invent facts about the site you cannot know; frame findings as likely patterns to verify.",
    1200,
  );
}

export async function generateProposal(idea: string) {
  return complete(
    `Create a project proposal outline for: ${idea.slice(0, 800)}. Include: scope summary, three package options (Starter, Growth, Full) each with deliverables and an indicative timeline range, and next steps. Do not invent exact prices; use timeline ranges and 'quoted after a free call'. Keep under 350 words with short markdown headings.`,
    "You are Benji Agency's proposal writer. Be concrete and honest; never invent prices.",
    1400,
  );
}

export async function generatePrototype(idea: string) {
  const html = await complete(
    `Create a single-file responsive HTML website prototype (inline CSS and minimal JS, no external resources, no images from the web, use emoji or CSS shapes) for this idea: ${idea.slice(0, 500)}\nUse a clean modern design with a hero, 3 sections and a working call-to-action. Return only the full HTML, starting with <!DOCTYPE html>.`,
    "You generate complete, working single-file HTML website prototypes. Output only the HTML document, no commentary, no markdown fences.",
    12000,
  );
  return html.replace(/^```html\n?/, "").replace(/```\n?$/, "");
}
