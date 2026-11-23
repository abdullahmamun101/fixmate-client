
"use client";

import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
      <div className="p-8 text-foreground">
        {session ? "Loading profile..." : "Loading..."}
      </div>
    );
  }

  const profileImage = preview || profile.image;

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              View and manage your account information.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-8 flex items-center gap-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-20 w-20 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold">
                {profile.name || "User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-medium"
                >
                  Profile Photo
                </label>

                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-foreground"
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum image size: 5MB
                </p>
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft({ ...draft, name: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-muted-foreground"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
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
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="area" className="mb-2 block text-sm font-medium">
                  Area
                </label>
                <input
                  id="area"
                  value={draft.area}
                  onChange={(e) =>
                    setDraft({ ...draft, area: e.target.value })
                  }
                  placeholder="Enter your area"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="bio" className="mb-2 block text-sm font-medium">
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
                  className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
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
                  className="rounded-lg border border-border px-6 py-3 font-medium transition hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="mt-1 font-medium">{profile.name || "Not added"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="mt-1 font-medium">{profile.email}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="mt-1 font-medium">{profile.phone || "Not added"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="mt-1 font-medium">{profile.area || "Not added"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Bio</p>
                <p className="mt-1 whitespace-pre-wrap font-medium">
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



