"use client";

import { useEffect, useState } from "react";

const inputClass =
  "w-full min-w-0 rounded-sm border border-white/10 bg-[#101010] px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#c5a46d] focus:ring-1 focus:ring-[#c5a46d]/20";

function Stars({ value = 0, size = "text-lg" }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${size}`}
      aria-label={`${value} از 5 ستاره`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= value ? "text-[#c5a46d]" : "text-white/15"
          }
        >
          ★
        </span>
      ))}
    </span>
  );
}

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `پاسخ سرور معتبر نیست. کد وضعیت: ${response.status}`
    );
  }

  return response.json();
}

export default function ProductReviews({ slug }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    comment: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setLoadError("محصول مشخص نشده است.");
      return;
    }

    const controller = new AbortController();

    async function loadReviews() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await fetch(
          `/api/reviews?slug=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await readResponse(response);

        if (!response.ok) {
          throw new Error(
            data.message || "دریافت نظرات ناموفق بود."
          );
        }

        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setCount(data.count ?? (data.reviews || []).length);
      } catch (err) {
        if (err.name === "AbortError") return;

        setLoadError(
          err.message || "مشکلی در دریافت نظرات پیش آمد."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => controller.abort();
  }, [slug]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!slug) {
      setError("محصول مشخص نشده است.");
      return;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("لطفاً امتیاز خود را انتخاب کنید.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          name: form.name.trim(),
          email: form.email.trim(),
          title: form.title.trim(),
          comment: form.comment.trim(),
          rating,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message || "ثبت نظر انجام نشد."
        );
      }

      setMessage(
        "نظر شما با موفقیت ثبت شد و پس از تأیید مدیریت نمایش داده می‌شود."
      );

      setForm({
        name: "",
        email: "",
        title: "",
        comment: "",
      });

      setRating(5);
      setHoverRating(0);
    } catch (err) {
      setError(
        err.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="product-reviews"
      className="mt-14 border-t border-white/10 pt-10 sm:mt-20 sm:pt-14 lg:mt-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-9 sm:mb-12">
          <p className="text-[10px] font-medium tracking-[0.28em] text-[#c5a46d] sm:text-xs">
            CUSTOMER EXPERIENCES
          </p>

          <h2 className="noir-serif mt-3 text-3xl text-white sm:mt-4 sm:text-4xl md:text-5xl">
            Reviews<span className="text-[#c5a46d]">.</span>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-white/50 sm:mt-4">
            Discover real experiences and share your thoughts about
            this fragrance with the NOIR community.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 xl:gap-16">
          {/* Reviews list */}
          <div className="min-w-0">
            <div className="border border-white/10 bg-[#151515] p-5 sm:p-7">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs tracking-wider text-white/45">
                    CUSTOMER RATING
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="noir-serif text-4xl text-white">
                      {averageRating.toFixed(1)}
                    </span>

                    <div>
                      <Stars value={Math.round(averageRating)} />

                      <p className="mt-1 text-xs text-white/45">
                        Based on {count}{" "}
                        {count === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start border border-[#c5a46d]/25 px-3 py-2 sm:self-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c5a46d]" />
                  <span className="text-[10px] tracking-wider text-[#c5a46d]">
                    VERIFIED PUBLICATION
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-0">
                {loading ? (
                  <div className="space-y-5" aria-label="Loading reviews">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="animate-pulse border-b border-white/10 pb-5 last:border-0"
                      >
                        <div className="h-4 w-28 rounded bg-white/10" />
                        <div className="mt-4 h-3 w-2/3 rounded bg-white/10" />
                        <div className="mt-3 h-3 w-full rounded bg-white/5" />
                        <div className="mt-2 h-3 w-4/5 rounded bg-white/5" />
                      </div>
                    ))}
                  </div>
                ) : loadError ? (
                  <div className="py-8 text-center">
                    <p role="alert" className="text-sm leading-6 text-red-400">
                      {loadError}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setLoadError("");
                        setLoading(true);

                        fetch(
                          `/api/reviews?slug=${encodeURIComponent(slug)}`,
                          { cache: "no-store" }
                        )
                          .then(async (response) => {
                            const data = await readResponse(response);

                            if (!response.ok) {
                              throw new Error(
                                data.message || "دریافت نظرات ناموفق بود."
                              );
                            }

                            setReviews(data.reviews || []);
                            setAverageRating(data.averageRating || 0);
                            setCount(
                              data.count ?? (data.reviews || []).length
                            );
                          })
                          .catch((err) => {
                            setLoadError(
                              err.message || "دریافت نظرات ناموفق بود."
                            );
                          })
                          .finally(() => setLoading(false));
                      }}
                      className="mt-4 border border-white/15 px-4 py-2 text-xs text-white transition hover:border-[#c5a46d] hover:text-[#c5a46d]"
                    >
                      Try again
                    </button>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="px-2 py-10 text-center sm:py-14">
                    <div
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c5a46d]/25 text-xl text-[#c5a46d]"
                      aria-hidden="true"
                    >
                      ★
                    </div>

                    <h3 className="mt-4 text-base text-white">
                      Be the first to review
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/45">
                      No approved reviews yet. Share your experience
                      with this fragrance.
                    </p>

                    <a
                      href="#write-review"
                      className="mt-5 inline-flex min-h-11 items-center justify-center border border-[#c5a46d]/50 px-5 text-xs text-[#c5a46d] transition hover:bg-[#c5a46d] hover:text-black"
                    >
                      Write the first review
                    </a>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <article
                      key={review._id}
                      className="min-w-0 border-b border-white/10 py-6 first:pt-0 last:border-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c5a46d]/25 bg-[#c5a46d]/5 text-sm text-[#c5a46d] sm:h-11 sm:w-11"
                          aria-hidden="true"
                        >
                          {(review.name || "?").charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-medium text-white">
                                {review.name}
                              </p>

                              <p className="mt-1 text-[11px] text-white/40">
                                {formatDate(review.createdAt)}
                              </p>
                            </div>

                            <div className="shrink-0">
                              <Stars value={review.rating} size="text-base" />
                            </div>
                          </div>

                          {review.title && (
                            <h3 className="mt-4 break-words text-sm font-medium leading-6 text-[#c5a46d]">
                              {review.title}
                            </h3>
                          )}

                          <p className="mt-2 break-words whitespace-pre-wrap text-sm leading-7 text-white/60 [overflow-wrap:anywhere]">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Review form */}
          <div
            id="write-review"
            className="min-w-0 scroll-mt-24 border border-white/10 bg-[#171717] p-5 sm:p-8 lg:p-9"
          >
            <p className="text-[10px] tracking-[0.25em] text-[#c5a46d] sm:text-xs">
              YOUR VOICE MATTERS
            </p>

            <h3 className="noir-serif mt-3 text-2xl text-white sm:mt-4 sm:text-3xl">
              Write a review
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/45">
              Tell us what you think about this scent.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5 sm:mt-8 sm:space-y-6"
            >
              {/* Rating */}
              <fieldset>
                <legend className="text-xs text-white/65">
                  Your rating
                </legend>

                <div className="mt-3 flex items-center gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onFocus={() => setHoverRating(star)}
                      onBlur={() => setHoverRating(0)}
                      aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                      aria-pressed={rating === star}
                      className="flex h-11 w-10 touch-manipulation items-center justify-center text-2xl transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#c5a46d] sm:w-11 sm:text-3xl"
                    >
                      <span
                        className={
                          star <= (hoverRating || rating)
                            ? "text-[#c5a46d]"
                            : "text-white/20"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}

                  <span className="ml-2 text-xs text-white/45">
                    {rating} / 5
                  </span>
                </div>
              </fieldset>

              {/* Name */}
              <div className="min-w-0">
                <label
                  htmlFor="review-name"
                  className="mb-2 block text-xs text-white/65"
                >
                  Full name <span className="text-[#c5a46d]">*</span>
                </label>

                <input
                  id="review-name"
                  name="name"
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div className="min-w-0">
                <label
                  htmlFor="review-email"
                  className="mb-2 block text-xs text-white/65"
                >
                  Email address <span className="text-[#c5a46d]">*</span>
                </label>

                <input
                  id="review-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />

                <p className="mt-2 text-[11px] leading-5 text-white/35">
                  Your email address will not be shown publicly.
                </p>
              </div>

              {/* Title */}
              <div className="min-w-0">
                <label
                  htmlFor="review-title"
                  className="mb-2 block text-xs text-white/65"
                >
                  Review title{" "}
                  <span className="text-white/30">(optional)</span>
                </label>

                <input
                  id="review-title"
                  name="title"
                  maxLength={120}
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Summarize your experience"
                  className={inputClass}
                />
              </div>

              {/* Comment */}
              <div className="min-w-0">
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-xs text-white/65"
                >
                  Your review <span className="text-[#c5a46d]">*</span>
                </label>

                <textarea
                  id="review-comment"
                  name="comment"
                  required
                  minLength={5}
                  maxLength={1500}
                  rows={5}
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Describe the scent, longevity, and your overall experience..."
                  className={`${inputClass} min-h-36 resize-y leading-7`}
                />

                <div className="mt-2 flex justify-between gap-3 text-[10px] text-white/35">
                  <span>At least 5 characters</span>
                  <span className="shrink-0 tabular-nums">
                    {form.comment.length}/1500
                  </span>
                </div>
              </div>

              {/* Feedback */}
              {error && (
                <div
                  role="alert"
                  className="border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-300"
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  role="status"
                  className="border border-[#c5a46d]/25 bg-[#c5a46d]/5 px-4 py-3 text-sm leading-6 text-[#d8bd8d]"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-12 w-full items-center justify-center gap-3 bg-[#c5a46d] px-5 py-4 text-[10px] font-semibold tracking-[0.2em] text-[#101010] transition hover:bg-[#e0c79b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a46d] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-14"
              >
                {submitting && (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-black/25 border-t-black"
                    aria-hidden="true"
                  />
                )}

                {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
              </button>

              <p className="text-center text-[11px] leading-5 text-white/35">
                Your review will appear after approval by our team.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}