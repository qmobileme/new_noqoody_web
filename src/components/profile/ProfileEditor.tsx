import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Trash2, UserRound } from "lucide-react";
import { AvatarCropper } from "./AvatarCropper";

const STORAGE_KEY = "noqoody:my-profile";
const MAX_FILE_MB = 8;

export type ProfileData = {
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
};

const EMPTY: ProfileData = {
  fullName: "",
  jobTitle: "",
  company: "",
  email: "",
  phone: "",
  location: "Doha, Qatar",
  bio: "",
  avatar: "",
};

const FIELDS: { key: keyof ProfileData; label: string; type?: string; placeholder: string; span?: boolean }[] = [
  { key: "fullName", label: "Full name", placeholder: "Ahmed Al-Thani" },
  { key: "jobTitle", label: "Job title", placeholder: "Finance Manager" },
  { key: "company", label: "Company", placeholder: "Your company" },
  { key: "email", label: "Email", type: "email", placeholder: "you@company.qa" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+974 0000 0000" },
  { key: "location", label: "Location", placeholder: "Doha, Qatar" },
];

function load(): ProfileData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<ProfileData>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

/**
 * Editable merchant profile card with Save / Cancel and an avatar
 * upload + crop flow. Values are kept on this device (localStorage) so the
 * form works without an account.
 */
export function ProfileEditor() {
  const [saved, setSaved] = useState<ProfileData>(EMPTY);
  const [draft, setDraft] = useState<ProfileData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = load();
    setSaved(stored);
    setDraft(stored);
  }, []);

  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const set = (key: keyof ProfileData, value: string) => setDraft((d) => ({ ...d, [key]: value }));

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Images must be under ${MAX_FILE_MB} MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPendingImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next: Partial<Record<keyof ProfileData, string>> = {};
    if (!draft.fullName.trim()) next.fullName = "Please enter your name.";
    if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) next.email = "Enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* storage may be unavailable in private mode */
    }
    setSaved(draft);
    toast.success("Profile saved");
  };

  const onCancel = () => {
    setDraft(saved);
    setErrors({});
    toast("Changes discarded");
  };

  return (
    <form
      onSubmit={onSave}
      className="ring-glass mx-auto max-w-3xl rounded-3xl p-fluid-card"
      aria-label="Edit your profile"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:gap-6">
        <div className="relative shrink-0">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-border bg-muted/40 sm:h-28 sm:w-28">
            {draft.avatar ? (
              <img src={draft.avatar} alt="Your profile picture" className="h-full w-full object-cover" />
            ) : (
              <UserRound className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Upload a new profile picture"
            className="absolute -bottom-1 -right-1 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-brand text-white shadow-lg transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Camera className="h-5 w-5" aria-hidden="true" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              onPickFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold sm:text-xl">
            {draft.fullName.trim() || "Your profile"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a picture, crop it, then save your details. Everything stays on this device.
          </p>
          {draft.avatar && (
            <button
              type="button"
              onClick={() => set("avatar", "")}
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove picture
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className="min-w-0">
            <label htmlFor={`profile-${f.key}`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {f.label}
            </label>
            <input
              id={`profile-${f.key}`}
              type={f.type ?? "text"}
              value={draft[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => set(f.key, e.target.value)}
              aria-invalid={errors[f.key] ? true : undefined}
              aria-describedby={errors[f.key] ? `profile-${f.key}-error` : undefined}
              className="min-h-11 w-full rounded-xl border border-border bg-background/60 px-4 text-base outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors[f.key] && (
              <p id={`profile-${f.key}-error`} role="alert" className="mt-1 text-xs text-primary">
                {errors[f.key]}
              </p>
            )}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor="profile-bio" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            About
          </label>
          <textarea
            id="profile-bio"
            rows={3}
            value={draft.bio}
            placeholder="A short line about your business and the payments you accept."
            onChange={(e) => set("bio", e.target.value)}
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-base outline-none transition focus:border-primary focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <p aria-live="polite" className="text-xs text-muted-foreground sm:mr-auto">
          {dirty ? "You have unsaved changes." : "All changes saved."}
        </p>
        <button
          type="button"
          onClick={onCancel}
          disabled={!dirty}
          className="min-h-11 rounded-full border border-border px-6 text-sm font-medium transition hover:bg-muted disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!dirty}
          className="min-h-11 rounded-full bg-gradient-brand px-8 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Save
        </button>
      </div>

      {pendingImage && (
        <AvatarCropper
          src={pendingImage}
          onCancel={() => setPendingImage(null)}
          onApply={(dataUrl) => {
            set("avatar", dataUrl);
            setPendingImage(null);
            toast.success("Picture updated — remember to save.");
          }}
        />
      )}
    </form>
  );
}

export default ProfileEditor;
