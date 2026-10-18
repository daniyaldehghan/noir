"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("The password and its confirmation do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/rigister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Your account has been successfully created.");

      router.push("/admin/login?registered=1");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-[#F0EBE2] outline-none transition placeholder:text-white/30 focus:border-[#C5A46D]/70 focus:bg-white/[0.06]";

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#101010] px-4 py-10 text-[#F0EBE2]"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#4A101B]/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#C5A46D]/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs tracking-widest text-white/50 transition hover:text-[#C5A46D]"
        >
          <ArrowLeft size={15} />
          Home
        </Link>

        <section className="rounded-3xl border border-white/10 bg-[#151515]/95 p-6 shadow-2xl shadow-black/40 sm:p-9">
          <div className="mb-8 text-center">
            <p
              className="mb-3 text-4xl font-light tracking-[0.3em] text-[#C5A46D]"
              dir="ltr"
            >
              NOIR
            </p>
            <div className="mx-auto mb-5 h-px w-12 bg-[#C5A46D]/70" />
            <h1 className="mb-2 text-xl font-medium">Create an account</h1>
            <p className="text-sm text-white/45">
              Welcome to the world of NOIR exclusive fragrances.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/70">
                FullName
              </label>
              <input
                className={inputClass}
                name="name"
                type="text"
                placeholder="fullname"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Email</label>
              <input
                className={inputClass}
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                maxLength={254}
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Password
              </label>
              <div className="relative">
                <input
                  className={`${inputClass} pl-12`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#C5A46D]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Repeat password
              </label>
              <input
                className={inputClass}
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter the password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
                dir="ltr"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C5A46D] py-3.5 text-sm font-semibold text-[#101010] transition hover:bg-[#D7BA88] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <LoaderCircle size={17} className="animate-spin" />}
              {loading ? "Creating account..." : "Creating a user account"}
            </button>
          </form>

          <div className="my-6 h-px bg-white/[0.08]" />

          <p className="text-center text-sm text-white/50">
            Have you already registered?
            <Link
              href="/login"
              className="font-medium text-[#C5A46D] transition hover:text-[#E0C99F]"
            >
              Log in
            </Link>
          </p>
        </section>

        <p
          className="mt-6 text-center text-[10px] tracking-[0.25em] text-white/25"
          dir="ltr"
        >
          DISCOVER YOUR SIGNATURE SCENT
        </p>
      </div>
    </main>
  );
}
