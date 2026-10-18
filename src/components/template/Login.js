"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setRegistered(searchParams.get("registered") === "1");
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("The email or password is incorrect.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-[#F0EBE2] outline-none transition placeholder:text-white/30 focus:border-[#C5A46D]/70";

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
          Admin Panel Password
          <div className="flex flex-col gap-2 mt-2 text-sm text-gray-500">
            <span>email: daniyaldehghani.2024@gmail.com</span>
            <span>password:12345678</span>
            {/* <p><dasd/p> */}
          </div>
          <div className="mb-8 text-center">
            <p
              className="mb-3 text-4xl font-light tracking-[0.3em] text-[#C5A46D]"
              dir="ltr"
            >
              NOIR
            </p>
            <div className="mx-auto mb-5 h-px w-12 bg-[#C5A46D]/70" />
            <h1 className="mb-2 text-xl font-medium">Login</h1>
            <p className="text-sm text-white/45">
              To continue, log in to your account
            </p>
          </div>
          {registered && (
            <p className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
              Registration was successful; now log in to your account.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/70">Email</label>
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
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

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C5A46D] py-3.5 text-sm font-semibold text-[#101010] transition hover:bg-[#D7BA88] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <LoaderCircle size={17} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign in to account"}
            </button>
          </form>
          <div className="my-6 h-px bg-white/[0.08]" />
          <p className="text-center text-sm text-white/50">
            Don't have an account?
            <Link
              href="/register"
              className="font-medium text-[#C5A46D] transition hover:text-[#E0C99F]"
            >
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
