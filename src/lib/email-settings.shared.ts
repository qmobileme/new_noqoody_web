import { z } from "zod";

export const emailSettingsSchema = z.object({
  provider: z.enum(["managed", "http_api"]),
  api_endpoint: z.string().trim().url().max(500).nullable().or(z.literal("")).transform((v) => (v ? v : null)),
  from_email: z.string().trim().email().max(255),
  from_name: z.string().trim().min(1).max(120),
  reply_to: z.string().trim().email().max(255).nullable().or(z.literal("")).transform((v) => (v ? v : null)),
  notification_recipient: z.string().trim().email().max(255),
  smtp_host: z.string().trim().min(1).max(255),
  smtp_port_ssl: z.coerce.number().int().min(1).max(65535),
  smtp_port_starttls: z.coerce.number().int().min(1).max(65535),
  imap_host: z.string().trim().min(1).max(255),
  imap_port: z.coerce.number().int().min(1).max(65535),
  pop3_port: z.coerce.number().int().min(1).max(65535),
  quota: z.string().trim().min(1).max(60),
});

export type EmailSettings = z.infer<typeof emailSettingsSchema>;

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  provider: "managed",
  api_endpoint: null,
  from_email: "no-reply@sub.noqoody.com",
  from_name: "No Reply",
  reply_to: "no-reply@sub.noqoody.com",
  notification_recipient: "info@noqoody.com",
  smtp_host: "mail.noqoodypay.com",
  smtp_port_ssl: 465,
  smtp_port_starttls: 587,
  imap_host: "mail.noqoodypay.com",
  imap_port: 993,
  pop3_port: 995,
  quota: "1 GB",
};
