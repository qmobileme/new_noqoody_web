import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { useCreatePost, useUpdatePost, useAllPosts } from "@/hooks/useBlogPosts";
import type { BlogPostInsert } from "@/hooks/useBlogPosts";
import { supabase } from "@/integrations/supabase/client";
import { translateToArabic } from "@/lib/translate.functions";
import { generateCoverImage } from "@/lib/cover-image.functions";
import { getPostPreviewToken } from "@/lib/preview-token.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import { SeoPreviewPanel } from "@/components/blog/SeoPreviewPanel";
import { SeoValidation, runSeoChecks } from "@/components/blog/SeoValidation";
import { PostRevisions } from "@/components/blog/PostRevisions";
import { useAuthors } from "@/hooks/useAuthors";
import {
  ArrowLeft,
  Loader2,
  Save,
  Image as ImageIcon,
  X,
  Languages,
  CalendarClock,
  Copy,
  Eye,
  Users,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const SITE = "https://noqoody.lovable.app";

export const Route = createFileRoute("/admin/posts/$id")({
  head: () => ({
    meta: [
      { title: "Post Editor — Noqoody Blog Admin" },
      { name: "description", content: "Write and publish bilingual Noqoody blog articles." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Post Editor — Noqoody Blog Admin" },
      { property: "og:description", content: "Write and publish bilingual Noqoody blog articles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <PostEditor />
    </AuthProvider>
  ),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/** Converts an ISO timestamp to the value a datetime-local input expects (local time). */
function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Appends/refreshes a cache-busting token so OG thumbnails pick up a new cover. */
function withCacheBuster(url: string): string {
  if (!url) return url;
  try {
    const parsed = new URL(url, "https://noqoody.lovable.app");
    parsed.searchParams.set("v", String(Date.now()));
    return url.startsWith("http") ? parsed.toString() : `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function PostEditor() {
  const { can } = useAuth();
  const canPublish = can("posts.publish");
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const { data: allPosts } = useAllPosts();
  const { data: authors } = useAuthors();
  // Accept either the post UUID or its slug in the URL, so copied posts can be
  // opened directly at /admin/posts/<slug>.
  const existingPost = allPosts?.find((p) => p.id === id || p.slug === id);

  // The draft preview token is server-only; verified staff fetch it on demand.
  const { data: previewTokenData } = useQuery({
    queryKey: ["post-preview-token", existingPost?.id],
    queryFn: () => getPostPreviewToken({ data: { postId: existingPost!.id } }),
    enabled: !isNew && !!existingPost?.id,
    staleTime: Infinity,
  });
  const previewToken = previewTokenData?.token;

  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    slug: "",
    excerpt_en: "",
    excerpt_ar: "",
    content_en: "",
    content_ar: "",
    featured_image: "",
    meta_description_en: "",
    meta_description_ar: "",
    keywords: "",
    category: "",
    author: "Noqoody Team",
    published: false,
    scheduled_at: "",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [draggingFeatured, setDraggingFeatured] = useState(false);

  const gate = useAdminGate("posts.edit");

  useEffect(() => {
    if (existingPost) {
      setForm({
        title_en: existingPost.title_en || "",
        title_ar: existingPost.title_ar || "",
        slug: existingPost.slug || "",
        excerpt_en: existingPost.excerpt_en || "",
        excerpt_ar: existingPost.excerpt_ar || "",
        content_en: existingPost.content_en || "",
        content_ar: existingPost.content_ar || "",
        featured_image: existingPost.featured_image || "",
        meta_description_en: existingPost.meta_description_en || "",
        meta_description_ar: existingPost.meta_description_ar || "",
        keywords: existingPost.keywords?.join(", ") || "",
        category: existingPost.category || "",
        author: existingPost.author || "Noqoody Team",
        published: !!existingPost.published,
        scheduled_at: toLocalInput(existingPost.scheduled_at),
      });
    }
  }, [existingPost]);

  if (gate) return gate;

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title_en" && isNew) updated.slug = slugify(value as string);
      return updated;
    });
  };

  const uploadFeaturedImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = await supabase.storage
      .from("blog-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    setForm((prev) => ({
      ...prev,
      featured_image: urlData?.signedUrl ? withCacheBuster(urlData.signedUrl) : prev.featured_image,
    }));
    setUploading(false);
    toast.success("Cover image updated — social thumbnails will refresh");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFeaturedImage(file);
  };

  const handleFeaturedDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingFeatured(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) await uploadFeaturedImage(file);
  };

  /** Generates a cover image from the post subject and stores it as the featured image. */
  const handleGenerateCover = async () => {
    if (!form.title_en.trim()) {
      toast.error("Add an English title first — it's the image subject");
      return;
    }
    setGeneratingCover(true);
    try {
      const result = await generateCoverImage({
        data: { title: form.title_en, excerpt: form.excerpt_en, category: form.category },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const bytes = Uint8Array.from(atob(result.b64), (c) => c.charCodeAt(0));
      const file = new File([bytes], `cover-${Date.now()}.png`, { type: "image/png" });
      await uploadFeaturedImage(file);
    } catch (err) {
      console.error(err);
      toast.error("Image generation failed");
    } finally {
      setGeneratingCover(false);
    }
  };

  const handleTranslate = async () => {
    if (!form.title_en.trim() && !form.content_en.trim()) {
      toast.error("Please write English content first before translating");
      return;
    }
    setTranslating(true);
    try {
      const result = await translateToArabic({
        data: {
          title: form.title_en,
          excerpt: form.excerpt_en,
          content: form.content_en,
          metaDescription: form.meta_description_en,
        },
      });
      if (!result.ok) {
        toast.error(result.error);
      } else {
        const tr = result.translation;
        setForm((prev) => ({
          ...prev,
          title_ar: tr["title_ar"] || prev.title_ar,
          excerpt_ar: tr["excerpt_ar"] || prev.excerpt_ar,
          content_ar: tr["content_ar"] || prev.content_ar,
          meta_description_ar: tr["meta_description_ar"] || prev.meta_description_ar,
        }));
        toast.success("Arabic translation completed!");
      }
    } catch {
      toast.error("Translation failed");
    }
    setTranslating(false);
  };

  const handleSave = async () => {
    if (!form.title_en.trim() || !form.content_en.trim()) {
      toast.error("Title and content (English) are required");
      return;
    }
    const blocking = runSeoChecks(form).filter((i) => i.level === "error");
    if (form.published && blocking.length > 0) {
      const ok = confirm(
        `This post has ${blocking.length} unresolved SEO issue(s):\n\n` +
          blocking.map((i) => `• ${i.message}`).join("\n") +
          "\n\nPublish anyway?",
      );
      if (!ok) return;
    }
    setSaving(true);
    const keywords = form.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const postData: BlogPostInsert = {
      title_en: form.title_en,
      title_ar: form.title_ar || null,
      slug: form.slug || slugify(form.title_en),
      excerpt_en: form.excerpt_en || null,
      excerpt_ar: form.excerpt_ar || null,
      content_en: form.content_en,
      content_ar: form.content_ar || null,
      featured_image: form.featured_image || null,
      meta_description_en: form.meta_description_en || null,
      meta_description_ar: form.meta_description_ar || null,
      keywords,
      category: form.category || "general",
      author: form.author || "Noqoody Team",
      published: form.published,
      published_at: form.published
        ? (existingPost?.published_at ?? new Date().toISOString())
        : null,
      scheduled_at:
        !form.published && form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
    };

    try {
      if (isNew) {
        await createPost.mutateAsync(postData);
        toast.success("Post created!");
      } else {
        await updatePost.mutateAsync({ id: existingPost?.id ?? id, ...postData });
        toast.success("Post updated!");
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin" aria-label="Back to admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="font-semibold text-foreground">{isNew ? "New Post" : "Edit Post"}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="published" className="text-sm text-muted-foreground">
                {form.published
                  ? "Published"
                  : form.scheduled_at
                    ? "Scheduled"
                    : "Draft"}
              </Label>
              <Switch
                id="published"
                checked={form.published}
                disabled={!canPublish}
                onCheckedChange={(v) => handleChange("published", v)}
                aria-label={
                  canPublish
                    ? form.published
                      ? "Unpublish this post"
                      : "Publish this post"
                    : "Publishing is restricted to admins"
                }
                title={canPublish ? undefined : "Only admins can publish or unpublish posts"}
              />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="ml-1">{isNew ? "Create" : "Save"}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <section className="space-y-4 p-6 rounded-xl border border-border bg-card">
              <h1 className="font-semibold text-foreground">English Content</h1>
              <div>
                <Label htmlFor="title-en">Title *</Label>
                <Input
                  id="title-en"
                  value={form.title_en}
                  onChange={(e) => handleChange("title_en", e.target.value)}
                  placeholder="Article title in English"
                />
              </div>
              <div>
                <Label htmlFor="excerpt-en">Excerpt</Label>
                <Textarea
                  id="excerpt-en"
                  value={form.excerpt_en}
                  onChange={(e) => handleChange("excerpt_en", e.target.value)}
                  placeholder="Short summary..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Content *</Label>
                <RichTextEditor
                  content={form.content_en}
                  onChange={(html) => handleChange("content_en", html)}
                  placeholder="Write your article content here..."
                />
              </div>
              <div>
                <Label htmlFor="meta-en">Meta Description</Label>
                <Textarea
                  id="meta-en"
                  value={form.meta_description_en}
                  onChange={(e) => handleChange("meta_description_en", e.target.value)}
                  placeholder="SEO description (max 160 chars)"
                  rows={2}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.meta_description_en.length}/160 characters
                </p>
              </div>
            </section>

            <section className="space-y-4 p-6 rounded-xl border border-border bg-card" dir="rtl">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">المحتوى العربي</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTranslate}
                  disabled={translating}
                  className="flex items-center gap-2"
                  dir="ltr"
                >
                  {translating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Languages className="h-4 w-4" />
                  )}
                  {translating ? "Translating..." : "Auto Translate from English"}
                </Button>
              </div>
              <div>
                <Label htmlFor="title-ar">العنوان</Label>
                <Input
                  id="title-ar"
                  value={form.title_ar}
                  onChange={(e) => handleChange("title_ar", e.target.value)}
                  placeholder="عنوان المقال بالعربية"
                />
              </div>
              <div>
                <Label htmlFor="excerpt-ar">المقتطف</Label>
                <Textarea
                  id="excerpt-ar"
                  value={form.excerpt_ar}
                  onChange={(e) => handleChange("excerpt_ar", e.target.value)}
                  placeholder="ملخص قصير..."
                  rows={2}
                />
              </div>
              <div>
                <Label>المحتوى</Label>
                <RichTextEditor
                  content={form.content_ar}
                  onChange={(html) => handleChange("content_ar", html)}
                  placeholder="اكتب محتوى مقالك هنا..."
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="meta-ar">وصف السيو</Label>
                <Textarea
                  id="meta-ar"
                  value={form.meta_description_ar}
                  onChange={(e) => handleChange("meta_description_ar", e.target.value)}
                  placeholder="وصف محرك البحث"
                  rows={2}
                  maxLength={160}
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="p-6 rounded-xl border border-border bg-card space-y-4">
              <h2 className="font-semibold text-foreground">Featured Image</h2>
              {form.featured_image ? (
                <div className="relative">
                  <img
                    src={form.featured_image}
                    alt="Featured"
                    className="w-full rounded-lg object-cover aspect-video"
                  />
                  <button
                    type="button"
                    aria-label="Remove featured image"
                    onClick={() => handleChange("featured_image", "")}
                    className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center gap-2 p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    draggingFeatured ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggingFeatured(true);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDraggingFeatured(true);
                  }}
                  onDragLeave={() => setDraggingFeatured(false)}
                  onDrop={handleFeaturedDrop}
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Drag & drop or click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
              <div>
                <Label htmlFor="featured-url">Or paste image URL</Label>
                <Input
                  id="featured-url"
                  value={form.featured_image}
                  onChange={(e) => handleChange("featured_image", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGenerateCover}
                disabled={generatingCover || uploading}
              >
                {generatingCover ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generatingCover ? "Generating image..." : "Generate image from post subject"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Uses the English title, excerpt and category as the subject.
              </p>
            </section>

            <section className="p-6 rounded-xl border border-border bg-card space-y-4">
              <h2 className="font-semibold text-foreground">SEO &amp; Meta</h2>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="article-url-slug"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="e.g., payments, fintech, guides"
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  value={form.keywords}
                  onChange={(e) => handleChange("keywords", e.target.value)}
                  placeholder="payment, Qatar, fintech"
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="author"
                    list="author-options"
                    value={form.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                    placeholder="Author name"
                  />
                  <Button variant="outline" size="icon" asChild title="Manage authors">
                    <Link to="/admin/authors" aria-label="Manage authors">
                      <Users className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <datalist id="author-options">
                  {authors?.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.title_en ?? ""}
                    </option>
                  ))}
                </datalist>
                {authors && authors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {authors.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => handleChange("author", a.name)}
                        aria-pressed={form.author === a.name}
                        className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                          form.author === a.name
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {!isNew && previewToken && (
              <section className="p-6 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Draft preview link</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share this secret link to review the post before publishing. It works while the post is
                  still a draft and is never indexed by search engines.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    aria-label="Draft preview URL"
                    value={`${SITE}/blog/preview/${previewToken}`}
                    onFocus={(e) => e.currentTarget.select()}
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Copy preview link"
                    onClick={async () => {
                      await navigator.clipboard.writeText(`${SITE}/blog/preview/${previewToken}`);
                      toast.success("Preview link copied");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/blog/preview/$token"
                    params={{ token: previewToken }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open preview
                  </Link>
                </Button>
              </section>
            )}

            <section className="p-6 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">Publishing</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {form.published
                  ? "Live on the blog, RSS feed and sitemap."
                  : form.scheduled_at
                    ? `Draft — goes live automatically on ${new Date(form.scheduled_at).toLocaleString()}.`
                    : "Draft — hidden from the public blog until published."}
              </p>
              <div>
                <Label htmlFor="scheduled-at">Schedule publish (optional)</Label>
                <Input
                  id="scheduled-at"
                  type="datetime-local"
                  value={form.scheduled_at}
                  disabled={form.published}
                  onChange={(e) => handleChange("scheduled_at", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.published
                    ? "Unpublish the post to schedule it for a later date."
                    : "Leave empty to keep it a manual draft. Scheduled posts publish within 5 minutes of the chosen time."}
                </p>
              </div>
              {!!form.scheduled_at && !form.published && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange("scheduled_at", "")}
                >
                  Clear schedule
                </Button>
              )}
            </section>

            <SeoPreviewPanel post={form} />

            <SeoValidation post={form} />

            <PostRevisions
              postId={existingPost?.id}
              onRestore={(snapshot) => {
                setForm((prev) => ({
                  ...prev,
                  title_en: (snapshot["title_en"] as string) ?? prev.title_en,
                  title_ar: (snapshot["title_ar"] as string) ?? "",
                  slug: (snapshot["slug"] as string) ?? prev.slug,
                  excerpt_en: (snapshot["excerpt_en"] as string) ?? "",
                  excerpt_ar: (snapshot["excerpt_ar"] as string) ?? "",
                  content_en: (snapshot["content_en"] as string) ?? prev.content_en,
                  content_ar: (snapshot["content_ar"] as string) ?? "",
                  featured_image: (snapshot["featured_image"] as string) ?? "",
                  meta_description_en: (snapshot["meta_description_en"] as string) ?? "",
                  meta_description_ar: (snapshot["meta_description_ar"] as string) ?? "",
                  keywords: ((snapshot["keywords"] as string[]) ?? []).join(", "),
                  category: (snapshot["category"] as string) ?? prev.category,
                  author: (snapshot["author"] as string) ?? prev.author,
                }));
                toast.success("Version loaded — review it, then save to restore");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
