import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "editor" | "user" | "superadmin";

/**
 * Capability map — admin pages are gated on these, never on a raw role string
 * at the call site, so permissions can be re-tuned in one place.
 */
export const CAPABILITIES = {
  "posts.edit": ["admin", "editor", "superadmin"],
  "posts.publish": ["admin", "superadmin"],
  "posts.import": ["admin", "superadmin"],
  "authors.manage": ["admin", "superadmin"],
  "feeds.regenerate": ["admin", "superadmin"],
  "activity.view": ["admin", "editor", "superadmin"],
  "rsvps.view": ["admin", "editor", "superadmin"],
  "submissions.manage": ["admin", "superadmin"],
  "events.manage": ["admin", "superadmin"],
  "pos.manage": ["admin", "superadmin"],
  "orders.manage": ["admin", "superadmin"],
  "staff.manage": ["admin", "superadmin"],
} satisfies Record<string, AppRole[]>;

export type Capability = keyof typeof CAPABILITIES;

interface AuthContext {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  isAdmin: boolean;
  isEditor: boolean;
  /** Signed in with any blog role — the minimum to reach the admin area. */
  isStaff: boolean;
  can: (capability: Capability) => boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Resolve roles BEFORE flipping `loading` off. Otherwise every
  // admin route sees `isAdmin === false` for a tick and bounces back to the
  // login page, which then bounces forward again — a redirect loop.
  const loadRoles = async (userId: string): Promise<AppRole[]> => {
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (!error && data) return data.map((r) => r.role as AppRole);
    // Fallback for the read-own-roles policy being unavailable.
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    return isAdmin ? ["admin"] : [];
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setRoles(session?.user ? await loadRoles(session.user.id) : []);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRoles(session?.user ? await loadRoles(session.user.id) : []);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = roles.includes("admin") || roles.includes("superadmin");
  const isEditor = roles.includes("editor");
  const isStaff = isAdmin || isEditor;
  const can = (capability: Capability) =>
    CAPABILITIES[capability].some((role) => roles.includes(role));

  return (
    <AuthContext.Provider
      value={{ user, session, roles, isAdmin, isEditor, isStaff, can, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
