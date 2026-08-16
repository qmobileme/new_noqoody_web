import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const coverInput = z.object({
  title: z.string().min(1).max(300),
  excerpt: z.string().max(1000).optional().default(""),
  category: z.string().max(120).optional().default(""),
});

/** Generates a blog cover image from the post subject via the Lovable AI gateway. */
export const generateCoverImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => coverInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, error: "Image generation is not configured." };

    const prompt = `Create a modern, professional blog cover illustration (16:9) for a fintech article.
Topic: ${data.title}
${data.category ? `Category: ${data.category}` : ""}
${data.excerpt ? `Summary: ${data.excerpt}` : ""}
Style: clean 3D render, soft light off-white background, warm brand palette of amber #dd8127, deep red #b0161c and gold #f8c960, subtle gradients, elegant depth, plenty of negative space, no text, no words, no letters, no logos.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return { ok: false as const, error: "Rate limited, please try again shortly." };
      if (response.status === 402) return { ok: false as const, error: "AI credits exhausted." };
      console.error("Image gateway error:", response.status, await response.text());
      return { ok: false as const, error: "Image generation failed." };
    }

    const payload = (await response.json()) as { data?: { b64_json?: string }[] };
    const b64 = payload.data?.[0]?.b64_json;
    if (!b64) return { ok: false as const, error: "The model returned no image." };
    return { ok: true as const, b64 };
  });
