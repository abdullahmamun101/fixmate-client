"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded bg-red-600 px-4 py-2 text-white"
    >
      Logout
    </button>
  );
}