import { createServerFn } from "@tanstack/react-start";

export const runWebsiteAudit = createServerFn({ method: "POST" })
  .inputValidator((input: { url: string }) => input)
  .handler(async ({ data }) => {
    const { generateAudit } = await import("./tools.server");
    return { text: await generateAudit(data.url) };
  });

export const runProposal = createServerFn({ method: "POST" })
  .inputValidator((input: { idea: string }) => input)
  .handler(async ({ data }) => {
    const { generateProposal } = await import("./tools.server");
    return { text: await generateProposal(data.idea) };
  });

export const runPrototype = createServerFn({ method: "POST" })
  .inputValidator((input: { idea: string }) => input)
  .handler(async ({ data }) => {
    const { generatePrototype } = await import("./tools.server");
    return { html: await generatePrototype(data.idea) };
  });
