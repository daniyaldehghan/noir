"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiCheck,
  FiTrash2,
  FiStar,
  FiMessageSquare,
  FiRefreshCw,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function loadReviews() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/reviews", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load reviews.");
      }

      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function updateReview(id, action) {
    const deleting = action === "delete";

    if (
      deleting &&
      !window.confirm("Are you sure you want to permanently delete this review?")
    ) {
      return;
    }

    setBusyId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: deleting ? "DELETE" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        ...(deleting
          ? {}
          : {
              body: JSON.stringify({ isApproved: true }),
            }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Unexpected API response:", text.slice(0, 500));

        throw new Error(
          `Invalid API response (HTTP ${response.status}). Check the API route and server logs.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "The operation failed.");
      }

      await loadReviews();
    } catch (err) {
      console.error("Update review error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === "pending") return !review.isApproved;
    if (filter === "approved") return review.isApproved;
    return true;
  });

  const pendingCount = reviews.filter((review) => !review.isApproved).length;
  const approvedCount = reviews.filter((review) => review.isApproved).length;

  function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  return (
    <main
      dir="ltr"
      className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs tracking-[0.3em] text-[#c9a45c]">
              NOIR / ADMINISTRATION
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Review Management
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Review and manage customer feedback
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm transition hover:border-[#c9a45c] hover:text-[#c9a45c]"
            >
              <FiArrowLeft />
              Back to Dashboard
            </Link>

            <button
              onClick={loadReviews}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm transition hover:border-[#c9a45c] disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Reviews"
            value={reviews.length}
            icon={<FiMessageSquare />}
          />
          <StatCard
            label="Pending Reviews"
            value={pendingCount}
            icon={<FiClock />}
          />
          <StatCard
            label="Approved Reviews"
            value={approvedCount}
            icon={<FiCheck />}
          />
        </section>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Approved" },
            { id: "all", label: "All Reviews" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-xl px-4 py-2.5 text-sm transition ${
                filter === item.id
                  ? "bg-[#c9a45c] text-black"
                  : "border border-white/10 text-white/65 hover:border-white/30"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 p-12 text-center text-white/50">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-12 text-center">
            <FiMessageSquare className="mx-auto mb-4 text-3xl text-[#c9a45c]" />
            <p className="text-white/70">
              No reviews found in this section.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{review.name}</h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          review.isApproved
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>

                    <p className="text-sm text-[#c9a45c]">
                      Product:{" "}
                      {review.productId?.name ||
                        review.productId?.title ||
                        review.productId?.slug ||
                        "Product deleted"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[#c9a45c]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FiStar
                        key={index}
                        className={
                          index < review.rating
                            ? "fill-[#c9a45c]"
                            : "text-white/20"
                        }
                      />
                    ))}
                    <span className="ml-1 text-sm text-white/60">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                {review.title && (
                  <h3 className="mt-5 font-medium">{review.title}</h3>
                )}

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/70">
                  {review.comment}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span className="text-xs text-white/40">
                    {formatDate(review.createdAt)}
                  </span>

                  <div className="flex gap-2">
                    {!review.isApproved && (
                      <button
                        onClick={() => updateReview(review._id, "approve")}
                        disabled={busyId === review._id}
                        className="flex items-center gap-2 rounded-lg bg-[#c9a45c] px-3 py-2 text-xs font-semibold text-black transition hover:bg-[#e0bd78] disabled:opacity-50"
                      >
                        <FiCheck />
                        Approve Review
                      </button>
                    )}

                    <button
                      onClick={() => updateReview(review._id, "delete")}
                      disabled={busyId === review._id}
                      className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101010] p-5">
      <div className="mb-4 flex items-center justify-between text-sm text-white/50">
        {label}
        <span className="text-xl text-[#c9a45c]">{icon}</span>
      </div>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
