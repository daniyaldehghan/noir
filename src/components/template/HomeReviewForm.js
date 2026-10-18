"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomeReviewForm() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    email: "",
    title: "",
    comment: "",
  });

  const [rating, setRating] = useState(5);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        if (!cancelled) {
          const list = data.products || [];
          setProducts(list);

          if (list.length > 0) {
            setForm((current) => ({
              ...current,
              slug: current.slug || list[0].slug,
            }));
          }
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load fragrances. Please refresh the page.");
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

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

    if (!form.slug) {
      setError("Please select a fragrance.");
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
          ...form,
          rating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit your review.");
      }

      setMessage(
        "Thank you! Your review has been submitted and is awaiting approval."
      );

      setForm((current) => ({
        ...current,
        name: "",
        email: "",
        title: "",
        comment: "",
      }));

      setRating(5);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="product-reviews"
      className="bg-[#101010] px-5 py-20 text-[#f0ebe2] sm:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="text-[10px] tracking-[0.3em] text-[#c5a46d]">
            YOUR VOICE MATTERS
          </p>

          <h2 className="noir-serif mt-6 text-4xl leading-tight sm:text-6xl">
            Share Your
            <br />
            Experience<span className="text-[#c5a46d]">.</span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-8 text-white/50">
            Tell us about the fragrance you discovered. Your experience can help
            someone find their next signature scent.
          </p>

          <p className="mt-8 text-xs text-white/40">
            All reviews are checked before publication.
          </p>
        </div>

        <div className="border border-white/10 bg-[#171717] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs text-white/60">
                Select fragrance
              </label>

              <select
                name="slug"
                required
                value={form.slug}
                onChange={handleChange}
                disabled={loadingProducts || products.length === 0}
                className="w-full border border-white/15 bg-[#101010] px-4 py-3 text-sm text-[#f0ebe2] outline-none focus:border-[#c5a46d] disabled:opacity-50"
              >
                {loadingProducts ? (
                  <option value="">Loading fragrances...</option>
                ) : products.length === 0 ? (
                  <option value="">No fragrances available</option>
                ) : (
                  products.map((product) => (
                    <option
                      key={product._id || product.id || product.slug}
                      value={product.slug}
                    >
                      {product.name}
                    </option>
                  ))
                )}
              </select>

              {form.slug && (
                <Link
                  href={`/products/${form.slug}`}
                  className="mt-2 inline-block text-[10px] text-[#c5a46d] hover:text-[#e0c79b]"
                >
                  View selected fragrance →
                </Link>
              )}
            </div>

            <div>
              <label className="mb-3 block text-xs text-white/60">
                Your rating
              </label>

              <div className="flex gap-2" role="group" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    aria-pressed={rating === star}
                    className={`text-2xl transition ${
                      star <= rating
                        ? "text-[#c5a46d]"
                        : "text-white/20 hover:text-[#c5a46d]"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/60">Name</label>
              <input
                name="name"
                required
                maxLength={80}
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your name"
                className="w-full border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#c5a46d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/60">Email</label>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#c5a46d]"
              />
              <p className="mt-2 text-[10px] text-white/35">
                Your email will not be displayed publicly.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/60">
                Review title (optional)
              </label>
              <input
                name="title"
                maxLength={120}
                value={form.title}
                onChange={handleChange}
                placeholder="Summarize your experience"
                className="w-full border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#c5a46d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-white/60">
                Your review
              </label>
              <textarea
                name="comment"
                required
                minLength={5}
                maxLength={1500}
                rows={5}
                value={form.comment}
                onChange={handleChange}
                placeholder="What do you think about this fragrance?"
                className="w-full resize-y border border-white/15 bg-black/20 px-4 py-3 text-sm leading-7 outline-none focus:border-[#c5a46d]"
              />
              <p className="mt-2 text-right text-[10px] text-white/35">
                {form.comment.length}/1500
              </p>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="text-sm leading-6 text-[#c5a46d]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || loadingProducts || products.length === 0}
              className="min-h-14 w-full bg-[#c5a46d] px-6 text-[10px] tracking-[0.2em] text-[#101010] transition hover:bg-[#e0c79b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
