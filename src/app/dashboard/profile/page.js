"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  Mail,
  CalendarDays,
  Save,
  LoaderCircle,
  CircleAlert,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    createdAt: "",
  });

  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/account", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not load your profile.");
      }

      const user = result.user;

      setProfile(user);
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (name.length > 100) {
      setError("Name cannot exceed 100 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not update your profile.");
      }

      setProfile((previous) => ({
        ...previous,
        ...result.user,
      }));

      setForm({
        name: result.user.name,
        email: result.user.email,
      });

      setSuccess("Your profile has been updated.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0b0b0a] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#c9a96e]/60";

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#090909] text-white">
        <LoaderCircle className="animate-spin text-[#c9a96e]" size={30} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c9a96e]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <header className="mb-9">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">
            NOIR / ACCOUNT SETTINGS
          </p>

          <h1 className="mt-3 text-3xl font-light sm:text-4xl">
            Personal Information
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Manage the personal details associated with your NOIR account.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-300"
          >
            <CircleAlert size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-300"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-2xl border border-white/[0.07] bg-[#111110] p-5 sm:p-8">
            <div className="mb-8 flex items-center gap-4 border-b border-white/[0.07] pb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c9a96e]/20 bg-[#c9a96e]/[0.07] text-[#c9a96e]">
                <UserRound size={25} />
              </div>

              <div>
                <h2 className="font-medium">Account details</h2>
                <p className="mt-1 text-xs text-white/40">
                  Update your name and email address
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="text-sm text-white/70">
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-sm text-white/70">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`${inputClass} pl-11`}
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Make sure you can access this email address.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a96e] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#ddc18c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      name: profile.name || "",
                      email: profile.email || "",
                    });
                    setError("");
                    setSuccess("");
                  }}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                >
                  Discard changes
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/[0.07] bg-[#111110] p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">
                MEMBERSHIP
              </p>

              <div className="mt-5 flex items-center gap-3">
                <CalendarDays size={20} className="text-[#c9a96e]" />

                <div>
                  <p className="text-sm text-white/80">Member since</p>

                  <p className="mt-1 text-xs text-white/40">
                    {profile.createdAt
                      ? new Intl.DateTimeFormat("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(profile.createdAt))
                      : "—"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#c9a96e]/15 bg-[#c9a96e]/[0.04] p-6">
              <h3 className="text-sm font-medium">Account security</h3>

              <p className="mt-2 text-xs leading-6 text-white/45">
                Keep your account details up to date. You can manage your
                password separately.
              </p>

              <Link
                href="/account/security"
                className="mt-4 inline-flex items-center gap-2 text-xs text-[#c9a96e] transition hover:text-[#e4cfaa]"
              >
                Password & security
                <ArrowLeft size={14} />
              </Link>
            </section>

            <button
              type="button"
              onClick={loadProfile}
              className="inline-flex items-center gap-2 px-1 py-2 text-xs text-white/40 transition hover:text-white/70"
            >
              <RefreshCw size={14} />
              Reload profile
            </button>
          </aside>
        </div>

        <footer className="mt-12 border-t border-white/[0.06] pt-5 text-center text-[10px] uppercase tracking-[0.25em] text-white/25">
          NOIR — Discover your signature scent
        </footer>
      </div>
    </main>
  );
}
