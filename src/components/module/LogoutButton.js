"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, LoaderCircle } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await signOut({
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex w-fuسll items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
    >
      {loading ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : (
        <LogOut size={18} />
      )}

      {loading ? "Exiting..." : "Log out"}
    </button>
  );
}
