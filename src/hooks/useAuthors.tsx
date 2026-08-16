import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type BlogAuthor = Tables<"blog_authors">;
export type BlogAuthorInsert = TablesInsert<"blog_authors">;
export type BlogAuthorUpdate = TablesUpdate<"blog_authors">;

export function useAuthors() {
  return useQuery({
    queryKey: ["blog-authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_authors")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as BlogAuthor[];
    },
  });
}

export function useSaveAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (author: BlogAuthorInsert & { id?: string }) => {
      if (author.id) {
        const { id, ...updates } = author;
        const { error } = await supabase.from("blog_authors").update(updates).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_authors").insert(author);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-authors"] }),
  });
}

export function useDeleteAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_authors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-authors"] }),
  });
}
