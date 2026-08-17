import { DEFAULT_EMAIL_SETTINGS, type EmailSettings } from "./email-settings.shared";

let cache: { at: number; value: EmailSettings } | null = null;
const TTL_MS = 30_000;

/** Reads the singleton email settings row; falls back to defaults on any failure. */
export async function loadEmailSettings(force = false): Promise<EmailSettings> {
  if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.value;
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("email_settings")
      .select("*")
      .eq("id", true)
      .maybeSingle();
    const value: EmailSettings = data
      ? { ...DEFAULT_EMAIL_SETTINGS, ...(data as Partial<EmailSettings>) }
      : DEFAULT_EMAIL_SETTINGS;
    cache = { at: Date.now(), value };
    return value;
  } catch {
    return DEFAULT_EMAIL_SETTINGS;
  }
}

export function clearEmailSettingsCache() {
  cache = null;
}

export type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/**
 * Sends through the mailbox's own HTTP email API when one is configured.
 * Returns false when no endpoint is configured so the caller can fall back.
 */
export async function sendViaMailboxApi(
  settings: EmailSettings,
  payload: MailPayload,
): Promise<boolean> {
  if (settings.provider !== "http_api" || !settings.api_endpoint) return false;

  const apiKey = process.env["MAIL_API_KEY"];
  const user = process.env["MAILBOX_USER"];
  const password = process.env["MAILBOX_PASSWORD"];

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  else if (user && password) headers["Authorization"] = `Basic ${btoa(`${user}:${password}`)}`;

  const response = await fetch(settings.api_endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      from: settings.from_email,
      from_name: settings.from_name,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo ?? settings.reply_to ?? settings.from_email,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Mailbox API responded ${response.status}: ${body.slice(0, 300)}`);
  }
  return true;
}
