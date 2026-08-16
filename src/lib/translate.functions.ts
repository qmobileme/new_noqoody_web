import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const translateInput = z.object({
  title: z.string().max(500).optional().default(""),
  excerpt: z.string().max(2000).optional().default(""),
  content: z.string().max(60000).optional().default(""),
  metaDescription: z.string().max(500).optional().default(""),
});

export const translateToArabic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => translateInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, error: "Translation is not configured." };

    const systemPrompt = `You are a professional English-to-Arabic translator specializing in fintech, payments, and business content for the Qatar/Gulf market.

Rules:
- Translate naturally into Modern Standard Arabic, suitable for professional blog articles
- Preserve ALL HTML tags exactly as they are (h2, h3, p, img, a, ul, ol, li, blockquote, strong, em, etc.)
- Do NOT translate URLs, brand names, or technical product names
- Keep the same formatting structure
- Use appropriate Arabic fintech terminology
- Return ONLY a JSON object with the translated fields, no extra text`;

    const userPrompt = `Translate the following fields from English to Arabic. Return a JSON object with keys: title_ar, excerpt_ar, content_ar, meta_description_ar.

Title: ${data.title}
Excerpt: ${data.excerpt}
Meta Description: ${data.metaDescription}
Content (HTML):
${data.content}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_translation",
              description: "Return the Arabic translation of the blog post fields",
              parameters: {
                type: "object",
                properties: {
                  title_ar: { type: "string" },
                  excerpt_ar: { type: "string" },
                  content_ar: { type: "string" },
                  meta_description_ar: { type: "string" },
                },
                required: ["title_ar", "content_ar"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_translation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return { ok: false as const, error: "Rate limited, please try again shortly." };
      if (response.status === 402) return { ok: false as const, error: "AI credits exhausted." };
      console.error("AI gateway error:", response.status, await response.text());
      return { ok: false as const, error: "Translation failed." };
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string; tool_calls?: { function?: { arguments?: string } }[] } }[];
    };
    const args = payload.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const raw = args ?? payload.choices?.[0]?.message?.content?.match(/\{[\s\S]*\}/)?.[0];
    if (!raw) return { ok: false as const, error: "Could not parse translation response." };

    try {
      const translation = JSON.parse(raw) as Record<string, string>;
      return { ok: true as const, translation };
    } catch {
      return { ok: false as const, error: "Could not parse translation response." };
    }
  });
