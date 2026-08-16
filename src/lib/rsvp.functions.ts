import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { rsvpSchema } from "./rsvp.schema";
import type { Database } from "@/integrations/supabase/types";

const MIN_FILL_MS = 2500;

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => rsvpSchema.parse(input))
  .handler(async ({ data }) => {
    // Bot traps: hidden honeypot field and impossibly fast form completion.
    // Both respond like a success so scripted bots get no useful signal.
    if ((data.website ?? "") !== "" || (data.elapsedMs ?? MIN_FILL_MS) < MIN_FILL_MS) {
      return { ok: true as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { allowSubmission, fingerprint } = await import("./throttle.server");
    const throttleKey = await fingerprint(getRequest(), data.email);
    if (!(await allowSubmission(supabaseAdmin, throttleKey, "rsvp"))) {
      return {
        ok: false as const,
        duplicate: false as const,
        error: "Too many attempts. Please wait a few minutes and try again.",
      };
    }

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

    const { error } = await supabasePublic.from("event_rsvps").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      event_name: data.event,
      guests: data.guests,
      notes: data.notes || null,
    });

    if (error) {
      if (error.code === "23505") {
        return {
          ok: false as const,
          duplicate: true as const,
          error: "This email is already registered for that event — we'll see you there!",
        };
      }
      console.error("RSVP insert failed:", error.message);
      return { ok: false as const, duplicate: false as const, error: "We couldn't save your RSVP. Please try again." };
    }

    return { ok: true as const };
  });
