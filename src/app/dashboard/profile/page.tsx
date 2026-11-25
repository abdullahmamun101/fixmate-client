"use client";

import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { User, Pencil, Camera, Mail, Phone, MapPin, FileText } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/25";

type ProfileData = {
  name: string;
  email: string;
  image: string;
  phone: string;
  area: string;
  bio: string;
};

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  area?: string;
  bio?: string;
};

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [savedProfile, setSavedProfile] = useState<ProfileData | null>(null);
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    area: "",
    bio: "",
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const user = session?.user as ProfileUser | undefined;

  const profile: ProfileData | null =
    savedProfile ??
    (user
      ? {
          name: user.name || "",
          email: user.email || "",
          image: user.image || "",
          phone: user.phone || "",
          area: user.area || "",
          bio: user.bio || "",
        }
      : null);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const startEditing = () => {
    if (!profile) return;

    setDraft({
      name: profile.name,
      phone: profile.phone,
      area: profile.area,
      bio: profile.bio,
    });

    setSelectedFile(null);
    setPreview("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setSelectedFile(null);
    setPreview("");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = draft.name.trim();

    if (!name) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Authentication token not available");
      }

      let imageUrl = profile?.image || "";

      if (selectedFile) {
        setUploading(true);

        const uploadData = new FormData();
        uploadData.append("image", selectedFile);

        const uploadResponse = await fetch(
          `${API_URL}/api/upload-image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            body: uploadData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.message || "Image upload failed"
          );
        }

        imageUrl = uploadResult.imageUrl;

        if (!imageUrl) {
          throw new Error("Image URL was not returned");
        }

        setUploading(false);
      }

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          name,
          image: imageUrl,
          phone: draft.phone.trim(),
          area: draft.area.trim(),
          bio: draft.bio.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile update failed");
      }

      const authUpdate = await authClient.updateUser({
        name,
        image: imageUrl,
      });

      if (authUpdate.error) {
        throw new Error(
          authUpdate.error.message || "Profile update failed"
        );
      }

      setSavedProfile({
        name,
        email: profile?.email || "",
        image: imageUrl,
        phone: draft.phone.trim(),
        area: draft.area.trim(),
        bio: draft.bio.trim(),
      });

      setEditing(false);
      setSelectedFile(null);
      setPreview("");

      await authClient.getSession();

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update profile"
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (isPending || !profile) {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-28 animate-pulse rounded-[24px] border border-border bg-card" />
          <div className="h-80 animate-pulse rounded-[24px] border border-border bg-card" />
        </div>
      </div>
    );
  }

  const profileImage = preview || profile.image;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-[26px] border border-brand/30 bg-brand p-6 text-brand-foreground shadow-md sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-foreground/15 blur-2xl"
          />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                <User size={13} />
                Account Settings
              </span>
              <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-brand-foreground/85">
                View and manage your account information.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-xs font-bold text-foreground shadow-sm transition hover:bg-muted"
              >
                <Pencil size={14} className="text-brand" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="rounded-[26px] border border-border bg-card p-6 text-card-foreground shadow-xs sm:p-8">
          {/* Avatar & Identity Strip */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border/80 pb-6">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-20 w-20 rounded-2xl border border-border object-cover shadow-2xs"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10 text-2xl font-extrabold text-brand">
                {profile.name.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {profile.name || "User"}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {profile.email}
              </p>
              {profile.area && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-0.5 text-xs font-semibold text-brand">
                  <MapPin size={12} />
                  {profile.area}
                </span>
              )}
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  <Camera size={14} className="text-brand" />
                  Profile Photo
                </label>

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`${fieldClass} file:mr-4 file:rounded-full file:border-0 file:bg-brand/15 file:px-3.5 file:py-1.5 file:text-xs file:font-bold file:text-brand hover:file:bg-brand/25`}
                />

                <p className="mt-1.5 text-xs text-muted-foreground">
                  Maximum image size: 5MB
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={draft.phone}
                    onChange={(e) =>
                      setDraft({ ...draft, phone: e.target.value })
                    }
                    placeholder="Enter your phone number"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="area"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground"
                  >
                    Area
                  </label>
                  <input
                    id="area"
                    value={draft.area}
                    onChange={(e) =>
                      setDraft({ ...draft, area: e.target.value })
                    }
                    placeholder="Enter your area"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={draft.bio}
                  onChange={(e) =>
                    setDraft({ ...draft, bio: e.target.value })
                  }
                  placeholder="Tell us a little about yourself"
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <div className="flex flex-wrap gap-3 border-t border-border/80 pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-brand px-6 py-3 text-xs font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90 disabled:opacity-50"
                >
                  {uploading
                    ? "Uploading Photo..."
                    : saving
                      ? "Saving..."
                      : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-full border border-border bg-background px-6 py-3 text-xs font-bold text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <User size={13} className="text-brand" />
                  Full Name
                </p>
                <p className="mt-1.5 text-sm font-bold text-foreground">
                  {profile.name || "Not added"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Mail size={13} className="text-brand" />
                  Email Address
                </p>
                <p className="mt-1.5 text-sm font-bold text-foreground">
                  {profile.email}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Phone size={13} className="text-brand" />
                  Phone Number
                </p>
                <p className="mt-1.5 text-sm font-bold text-foreground">
                  {profile.phone || "Not added"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <MapPin size={13} className="text-brand" />
                  Area
                </p>
                <p className="mt-1.5 text-sm font-bold text-foreground">
                  {profile.area || "Not added"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 sm:col-span-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText size={13} className="text-brand" />
                  Bio
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-foreground">
                  {profile.bio || "Not added"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}



