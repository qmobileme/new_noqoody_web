import type { SupabaseClient } from "@supabase/supabase-js";

/** Sliding-window limits per form. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** Stable, non-reversible fingerprint of the caller (IP + UA + email). */
export async function fingerprint(request: Request, email: string): Promise<string> {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  const raw = `${ip}|${ua}|${email.toLowerCase()}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Ad-hoc sliding-window limiter backed by `submission_throttle`.
 * Returns false when the caller has exceeded the allowance for this form.
 */
export async function allowSubmission(
  admin: SupabaseClient<any>,
  key: string,
  formType: string,
): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error } = await admin
    .from("submission_throttle")
    .select("id", { count: "exact", head: true })
    .eq("fingerprint", key)
    .eq("form_type", formType)
    .gte("created_at", since);

  // Fail open on infrastructure errors so genuine submissions are never lost.
  if (error) return true;
  if ((count ?? 0) >= MAX_PER_WINDOW) return false;

  await admin.from("submission_throttle").insert({ fingerprint: key, form_type: formType });

  // Opportunistic cleanup of expired rows.
  if (Math.random() < 0.05) {
    await admin
      .from("submission_throttle")
      .delete()
      .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  }

  return true;
}
