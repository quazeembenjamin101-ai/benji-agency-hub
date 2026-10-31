import { streamText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { createGatewayProvider, LOVABLE_MODEL, responsesOptions } from "./ai/gateway.server";
import { getLovableAiGatewayRunId } from "./ai/run-id.server";

const SYS = `You are Benji AI, the assistant for Benji Agency (websites, business apps, AI agents, automation, SEO, email marketing, community platforms). Be concise, accurate and friendly. Never invent prices, timelines or client results; for custom pricing, legal matters or complex scoping say a team member will follow up and use the capture_lead tool after getting the visitor's name and email. If asked to audit a site, ask for the URL and give general best-practice advice, stating you cannot load the live page. Decline sexual content, content involving minors, and illegal requests.`;

export async function handleChat(request: Request) {
  const body = (await request.json()) as { messages?: { role: string; content: string }[] };
  const history = (body.messages ?? [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content).slice(0, 4000) }));
  if (!history.length) return new Response("No messages", { status: 400 });

  const { provider, runIdFetch } = createGatewayProvider(getLovableAiGatewayRunId(request));

  const result = streamText({
    model: provider.responses(LOVABLE_MODEL),
    instructions: SYS,
    messages: history,
    abortSignal: request.signal,
    stopWhen: stepCountIs(5),
    providerOptions: { openai: responsesOptions },
    tools: {
      capture_lead: tool({
        description: "Save a visitor as a CRM lead for the owner to follow up.",
        inputSchema: z.object({
          name: z.string().describe("The visitor's name"),
          email: z.string().describe("The visitor's email address"),
          project: z.string().optional().describe("What they want to build, if they said"),
        }),
        execute: async (i) => {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { error } = await supabaseAdmin.from("leads").insert({
              name: String(i.name).slice(0, 80),
              email: String(i.email).slice(0, 120),
              build: i.project ? String(i.project).slice(0, 300) : null,
              source: "ai-chat",
              status: "New",
            });
            return error ? "Could not save; ask the visitor to use the contact form" : "Lead saved";
          } catch {
            return "Could not save; ask the visitor to use the contact form";
          }
        },
      }),
    },
  });

  return result.toTextStreamResponse({
    headers: { "X-Lovable-AIG-Run-ID": runIdFetch.getRunId() ?? "" },
  });
}
