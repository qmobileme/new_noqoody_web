import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const staffRoles = ["admin", "editor", "superadmin"] as const;

const createStaffSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  role: z.enum(staffRoles),
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  const [{ data: isAdmin }, { data: isSuper }] = await Promise.all([
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "superadmin" }),
  ]);
  if (!isAdmin && !isSuper) throw new Error("Forbidden — admins only.");
}

export const listStaffAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRows, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (error) throw new Error(error.message);
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const emailById = new Map((userList?.users ?? []).map((u) => [u.id, u.email ?? ""]));
    const byUser = new Map<string, { userId: string; email: string; roles: string[] }>();
    for (const row of roleRows ?? []) {
      const entry = byUser.get(row.user_id) ?? {
        userId: row.user_id,
        email: emailById.get(row.user_id) ?? "(unknown)",
        roles: [],
      };
      entry.roles.push(row.role as string);
      byUser.set(row.user_id, entry);
    }
    return [...byUser.values()].sort((a, b) => a.email.localeCompare(b.email));
  });

export const createStaffAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createStaffSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let userId: string | null = null;
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

    if (createError) {
      // Existing account — grant the role instead of failing outright.
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const existing = (list?.users ?? []).find(
        (u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase(),
      );
      if (!existing) throw new Error(createError.message);
      userId = existing.id;
    } else {
      userId = created.user?.id ?? null;
    }

    if (!userId) throw new Error("Could not create the staff account.");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: data.role }, { onConflict: "user_id,role" });
    if (roleError) throw new Error(roleError.message);

    return { ok: true as const, userId, email: data.email, role: data.role };
  });
