import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { leadSchema } from "./leads.schema";
import type { Database } from "@/integrations/supabase/types";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

    const supabasePublic = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabasePublic.from("leads").insert({
      form_type: data.formType,
      full_name: data.fullName || data.email.split("@")[0] || "Subscriber",
      email: data.email,
      phone: "phone" in data ? data.phone || null : null,
      company: "company" in data ? data.company || null : null,
      industry: "industry" in data ? data.industry : null,
      monthly_volume: "monthlyVolume" in data ? data.monthlyVolume : null,
      message: "message" in data ? data.message || null : null,
    });

    if (error) {
      console.error("Lead insert failed:", error.message);
      return { ok: false as const, error: "We couldn't save your request. Please try again." };
    }

    return { ok: true as const };
  });