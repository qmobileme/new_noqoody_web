import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AuthProvider } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { createStaffAccount, listStaffAccounts } from "@/lib/staff.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/signup")({
  head: () => ({
    meta: [
      { title: "Staff Accounts — Noqoody Admin" },
      { name: "description", content: "Create Noqoody staff accounts and assign admin roles." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Accounts — Noqoody Admin" },
      { property: "og:description", content: "Create Noqoody staff accounts and assign admin roles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <AdminSignupPage />
    </AuthProvider>
  ),
});

const ROLES = [
  { value: "editor", label: "Editor — write and edit posts" },
  { value: "admin", label: "Admin — full content and orders access" },
  { value: "superadmin", label: "Superadmin — everything" },
] as const;

function AdminSignupPage() {
  const gate = useAdminGate("staff.manage");
  const createFn = useServerFn(createStaffAccount);
  const listFn = useServerFn(listStaffAccounts);
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("editor");

  const staff = useQuery({
    queryKey: ["staff-accounts"],
    queryFn: () => listFn({}),
    enabled: !gate,
  });

  const create = useMutation({
    mutationFn: () => createFn({ data: { email, password, role: role as "admin" } }),
    onSuccess: (res) => {
      toast.success(`${res.email} added as ${res.role}`);
      setEmail("");
      setPassword("");
      queryClient.invalidateQueries({ queryKey: ["staff-accounts"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (gate) return gate;

  return (
    <AdminShell title="Staff accounts" description="Create staff logins and assign roles.">
      <div className="max-w-3xl space-y-8">
        <form
          className="rounded-xl border border-border bg-card p-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="staff-email">Email</Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="staff-password">Temporary password</Label>
              <Input
                id="staff-password"
                type="text"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="staff-role">Role</Label>
            <select
              id="staff-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Create staff account
          </Button>
        </form>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Existing staff</h2>
          {staff.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : staff.data?.length ? (
            <ul className="divide-y divide-border">
              {staff.data.map((s) => (
                <li key={s.userId} className="flex items-center justify-between py-2 gap-3">
                  <span className="text-sm text-foreground">{s.email}</span>
                  <span className="flex gap-1">
                    {s.roles.map((r) => (
                      <Badge key={r} variant="secondary">
                        {r}
                      </Badge>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No staff accounts yet.</p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
