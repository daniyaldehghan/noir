"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function SecurityPage() {
  const [form, setForm] = useState(initialForm);
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const passwordRules = [
    {
      label: "حداقل ۸ کاراکتر",
      valid: form.newPassword.length >= 8,
    },
    {
      label: "حداقل یک حرف انگلیسی",
      valid: /[a-zA-Z]/.test(form.newPassword),
    },
    {
      label: "حداقل یک عدد",
      valid: /\d/.test(form.newPassword),
    },
  ];

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  }

  function toggleVisibility(field) {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    if (!form.currentPassword) {
      setMessage({
        type: "error",
        text: "رمز عبور فعلی را وارد کنید.",
      });
      return;
    }

    if (form.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "رمز جدید باید حداقل ۸ کاراکتر باشد.",
      });
      return;
    }

    if (!/[a-zA-Z]/.test(form.newPassword) || !/\d/.test(form.newPassword)) {
      setMessage({
        type: "error",
        text: "رمز جدید باید حداقل یک حرف انگلیسی و یک عدد داشته باشد.",
      });
      return;
    }

    if (form.newPassword === form.currentPassword) {
      setMessage({
        type: "error",
        text: "رمز جدید باید با رمز فعلی متفاوت باشد.",
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMessage({
        type: "error",
        text: "رمز جدید و تکرار آن یکسان نیستند.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/account/security", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تغییر رمز انجام نشد.");
      }

      setForm(initialForm);
      setMessage({
        type: "success",
        text: data.message || "رمز عبور با موفقیت تغییر کرد.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "ارتباط با سرور برقرار نشد.",
      });
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      name: "currentPassword",
      label: "رمز عبور فعلی",
      placeholder: "رمز فعلی خود را وارد کنید",
    },
    {
      name: "newPassword",
      label: "رمز عبور جدید",
      placeholder: "رمز جدید را وارد کنید",
    },
    {
      name: "confirmPassword",
      label: "تکرار رمز عبور جدید",
      placeholder: "رمز جدید را دوباره وارد کنید",
    },
  ];

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#090909] px-4 py-10 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#d4af72]"
        >
          <ArrowRight size={17} />
          بازگشت به حساب کاربری
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4af72]/25 bg-[#d4af72]/10 text-[#d4af72]">
            <ShieldCheck size={27} />
          </div>

          <div>
            <p className="mb-2 text-xs tracking-[0.3em] text-[#d4af72]">
              ACCOUNT SECURITY
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">امنیت حساب</h1>
            <p className="mt-2 text-sm text-white/45">
              رمز عبورت را مدیریت کن و از حساب خود محافظت کن.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-3xl border border-white/10 bg-[#111111] p-5 sm:p-8">
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
              <LockKeyhole className="text-[#d4af72]" size={23} />
              <div>
                <h2 className="font-medium">تغییر رمز عبور</h2>
                <p className="mt-1 text-xs text-white/40">
                  برای ادامه، رمز فعلی خود را تأیید کن.
                </p>
              </div>
            </div>

            {message && (
              <div
                role="status"
                className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                  message.type === "success"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={19} className="shrink-0" />
                ) : (
                  <AlertCircle size={19} className="shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-3 block text-sm text-white/75"
                  >
                    {field.label}
                  </label>

                  <div className="relative">
                    <input
                      id={field.name}
                      type={show[field.name] ? "text" : "password"}
                      value={form[field.name]}
                      onChange={(event) =>
                        updateField(field.name, event.target.value)
                      }
                      placeholder={field.placeholder}
                      autoComplete={
                        field.name === "currentPassword"
                          ? "current-password"
                          : "new-password"
                      }
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 pl-12 text-sm outline-none transition placeholder:text-white/20 focus:border-[#d4af72]/60 disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() => toggleVisibility(field.name)}
                      aria-label={
                        show[field.name] ? "مخفی کردن رمز" : "نمایش رمز"
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-[#d4af72]"
                    >
                      {show[field.name] ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {field.name === "newPassword" && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      {passwordRules.map((rule) => (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-2 text-xs ${
                            rule.valid ? "text-emerald-400" : "text-white/35"
                          }`}
                        >
                          <CheckCircle2 size={14} />
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#d4af72] px-5 py-4 text-sm font-semibold text-black transition hover:bg-[#e4c58e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "در حال ذخیره..." : "تغییر رمز عبور"}
              </button>
            </form>
          </section>

          <aside className="h-fit rounded-3xl border border-[#d4af72]/15 bg-[#111111] p-6">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af72]/10 text-[#d4af72]">
              <ShieldCheck size={22} />
            </div>

            <h2 className="font-medium">رمز عبور امن</h2>

            <p className="mt-3 text-sm leading-7 text-white/45">
              برای محافظت بهتر از حساب NOIR، از رمز عبوری استفاده کن که در
              سایت‌های دیگر استفاده نکرده‌ای.
            </p>

            <div className="my-6 h-px bg-white/10" />

            <ul className="space-y-4 text-sm leading-6 text-white/60">
              <li className="flex gap-3">
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-[#d4af72]"
                />
                حداقل ۸ کاراکتر انتخاب کن.
              </li>
              <li className="flex gap-3">
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-[#d4af72]"
                />
                از حروف و اعداد استفاده کن.
              </li>
              <li className="flex gap-3">
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-[#d4af72]"
                />
                رمزت را با دیگران به اشتراک نگذار.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
