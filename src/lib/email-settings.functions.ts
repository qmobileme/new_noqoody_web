import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { emailSettingsSchema, type EmailSettings } from "./email-settings.shared";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "superadmin" }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Forbidden — admins only.");
}

export const getEmailSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EmailSettings & { hasPassword: boolean; hasApiKey: boolean }> => {
    await assertAdmin(context);
    const { loadEmailSettings } = await import("./email-settings.server");
    const settings = await loadEmailSettings(true);
    return {
      ...settings,
      hasPassword: Boolean(process.env["MAILBOX_PASSWORD"]),
      hasApiKey: Boolean(process.env["MAIL_API_KEY"]),
    };
  });

export const updateEmailSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => emailSettingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("email_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", true);
    if (error) throw new Error(error.message);
    const { clearEmailSettingsCache } = await import("./email-settings.server");
    clearEmailSettingsCache();
    return { ok: true as const };
  });

export const sendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ to: z.string().trim().email() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { loadEmailSettings, sendViaMailboxApi } = await import("./email-settings.server");
    const settings = await loadEmailSettings(true);
    const html = `<p>Test email from the Noqoody admin panel.</p><p>Sender: ${settings.from_name} &lt;${settings.from_email}&gt;</p>`;
    try {
      const viaMailbox = await sendViaMailboxApi(settings, {
        to: data.to,
        subject: "Noqoody test email",
        html,
        text: "Test email from the Noqoody admin panel.",
      });
      if (viaMailbox) return { ok: true as const, route: "mailbox-api" as const };
    } catch (error) {
      return {
        ok: false as const,
        route: "mailbox-api" as const,
        error: error instanceof Error ? error.message : "Mailbox API send failed",
      };
    }

    const { sendTemplateEmail } = await import("./email-templates/send-email");
    await sendTemplateEmail("lead-notification", data.to, {
      templateData: {
        formType: "test",
        fullName: "Admin test",
        email: data.to,
        message: "This is a test email sent from the Noqoody admin panel.",
      },
      idempotencyKey: `email-test-${Date.now()}`,
    });
    return { ok: true as const, route: "managed" as const };
  });
