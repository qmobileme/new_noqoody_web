import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import {
  getEmailSettings,
  updateEmailSettings,
  sendTestEmail,
} from "@/lib/email-settings.functions";
import { DEFAULT_EMAIL_SETTINGS, type EmailSettings } from "@/lib/email-settings.shared";

export const Route = createFileRoute("/admin/email")({
  head: () => ({
    meta: [
      { title: "Email settings — Noqoody Admin" },
      { name: "description", content: "Control the Noqoody sending mailbox and mail server settings." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Email settings — Noqoody Admin" },
      { property: "og:description", content: "Control the Noqoody sending mailbox and mail server settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <EmailSettingsPage />
    </AuthProvider>
  ),
});

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function EmailSettingsPage() {
  const gate = useAdminGate("staff.manage");
  const load = useServerFn(getEmailSettings);
  const save = useServerFn(updateEmailSettings);
  const test = useServerFn(sendTestEmail);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["email-settings"],
    queryFn: () => load({ data: undefined }),
    enabled: !gate,
  });

  const [form, setForm] = useState<EmailSettings>(DEFAULT_EMAIL_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testTo, setTestTo] = useState("");

  useEffect(() => {
    if (data) {
      const { hasPassword: _p, hasApiKey: _k, ...rest } = data;
      setForm(rest as EmailSettings);
      setTestTo(rest.notification_recipient);
    }
  }, [data]);

  if (gate) return gate;

  const set = (key: keyof EmailSettings) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }) as EmailSettings);

  const handleSave = async () => {
    setSaving(true);
    try {
      await save({ data: form });
      toast.success("Email settings saved");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const result = await test({ data: { to: testTo } });
      if (result.ok) toast.success(`Test email sent via ${result.route}`);
      else toast.error(result.error ?? "Test send failed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Test send failed");
    } finally {
      setTesting(false);
    }
  };

  return (
    <AdminShell
      title="Email settings"
      description="Mailbox, sender identity and mail server details used for all outgoing email."
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
        </div>
      ) : (
        <div className="max-w-3xl space-y-8">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold">Mailbox</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="from_email" label="Email / Username" value={form.from_email} onChange={set("from_email")} hint="Full email address is the username." />
              <Field id="from_name" label="Display name" value={form.from_name} onChange={set("from_name")} />
              <Field id="reply_to" label="Reply-to (optional)" value={form.reply_to ?? ""} onChange={set("reply_to")} />
              <Field id="notification_recipient" label="Internal notifications go to" value={form.notification_recipient} onChange={set("notification_recipient")} />
              <Field id="quota" label="Quota" value={form.quota} onChange={set("quota")} />
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value="••••••••••••" readOnly />
                <p className="text-xs text-muted-foreground">
                  {data?.hasPassword ? "Stored securely as a secret." : "Not configured."}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-1 text-lg font-semibold">Sending route</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Direct SMTP cannot be dialled from the app runtime. Choose the managed route, or point at
              an HTTP send API on your mail host to send from this mailbox.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="provider">Method</Label>
                <select
                  id="provider"
                  value={form.provider}
                  onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value as EmailSettings["provider"] }))}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  <option value="managed">Managed sending (default)</option>
                  <option value="http_api">Mailbox HTTP API</option>
                </select>
              </div>
              <Field
                id="api_endpoint"
                label="HTTP API endpoint"
                value={form.api_endpoint ?? ""}
                onChange={set("api_endpoint")}
                hint={data?.hasApiKey ? "Authenticated with MAIL_API_KEY." : "Falls back to mailbox username/password auth."}
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold">Server settings</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="smtp_host" label="Outgoing SMTP host" value={form.smtp_host} onChange={set("smtp_host")} />
              <Field id="smtp_port_ssl" label="SMTP port (SSL/TLS)" type="number" value={form.smtp_port_ssl} onChange={set("smtp_port_ssl")} />
              <Field id="smtp_port_starttls" label="SMTP port (STARTTLS)" type="number" value={form.smtp_port_starttls} onChange={set("smtp_port_starttls")} />
              <Field id="imap_host" label="Incoming host" value={form.imap_host} onChange={set("imap_host")} />
              <Field id="imap_port" label="IMAP port (SSL/TLS)" type="number" value={form.imap_port} onChange={set("imap_port")} />
              <Field id="pop3_port" label="POP3 port (SSL/TLS)" type="number" value={form.pop3_port} onChange={set("pop3_port")} />
            </div>
          </section>

          <div className="flex flex-wrap items-end gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
              Save settings
            </Button>
            <div className="flex items-end gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="test_to">Test recipient</Label>
                <Input id="test_to" value={testTo} onChange={(e) => setTestTo(e.target.value)} className="w-64" />
              </div>
              <Button variant="outline" onClick={handleTest} disabled={testing}>
                {testing ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Send className="mr-1 h-4 w-4" />}
                Send test
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
