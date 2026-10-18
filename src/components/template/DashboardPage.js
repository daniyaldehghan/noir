"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  Clock3,
  PackageCheck,
  UserRound,
  ShieldCheck,
  ShoppingCart,
  RefreshCw,
  CalendarDays,
  Sparkles,
  CircleAlert,
} from "lucide-react";
import LogoutButton from "../module/LogoutButton";

const STATUS = {
  pending: {
    label: "Pending",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },
  confirmed: {
    label: "Confirmed",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  },
  processing: {
    label: "Processing",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  },
  shipped: {
    label: "Shipped",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  },
  delivered: {
    label: "Delivered",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-500/20 bg-red-500/10 text-red-300",
  },
};

const PAYMENT_STATUS = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
};

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatPrice(price, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[#111110] p-5 transition duration-300 hover:border-[#c9a96e]/30 hover:bg-[#151512]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-white/50">{label}</span>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9a96e]/15 bg-[#c9a96e]/[0.07] text-[#c9a96e] transition group-hover:bg-[#c9a96e]/15">
          <Icon size={19} />
        </span>
      </div>

      <div className="mt-5 text-3xl font-light tracking-tight text-white">
        {value}
      </div>

      <p className="mt-2 text-xs text-white/35">{description}</p>
    </div>
  );
}

function QuickLink({ href, icon: Icon, title, description }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#111110] p-4 transition duration-300 hover:border-[#c9a96e]/30 hover:bg-[#171714]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-[#c9a96e] transition group-hover:bg-[#c9a96e]/10">
        <Icon size={20} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-white/90">{title}</span>
        <span className="mt-1 block text-xs text-white/40">{description}</span>
      </span>

      <ArrowRight
        size={17}
        className="shrink-0 text-white/25 transition group-hover:-translate-x-1 group-hover:text-[#c9a96e]"
      />
    </Link>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/account", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Please sign in to view your account."
            : result.message || "Could not load your dashboard."
        );
      }

      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] px-4 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-7 w-44 rounded bg-white/10" />
          <div className="h-52 rounded-3xl bg-white/[0.05]" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 rounded-2xl bg-white/[0.05]" />
            ))}
          </div>

          <div className="h-64 rounded-2xl bg-white/[0.05]" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#090909] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111110] p-8 text-center">
          <CircleAlert className="mx-auto mb-4 text-red-400" size={34} />

          <h1 className="text-xl font-medium">Unable to load dashboard</h1>

          <p className="mt-3 text-sm leading-6 text-white/50">{error}</p>

          <button
            type="button"
            onClick={loadDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c9a96e] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#ddc18c]"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  const user = data?.user;
  const orders = data?.orders || [];
  const summary = data?.orderSummary || {};

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">
              NOIR / PERSONAL SPACE
            </p>

            <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
              My Dashboard
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#c9a96e]"
          >
            <LogoutButton />
            Continue shopping
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Welcome banner */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-[#c9a96e]/20 bg-[#11110f] p-6 sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-[#c9a96e]/[0.09] blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 h-64 w-64 rounded-full bg-[#8c6b39]/[0.08] blur-[80px]" />

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/[0.07] px-3 py-1.5 text-xs text-[#d8bd8a]">
                <Sparkles size={13} />
                Welcome to NOIR
              </div>

              <h2 className="text-3xl font-light leading-tight sm:text-4xl">
                Welcome back,{" "}
                <span className="font-normal text-[#d4b77e]">
                  {user?.name || "Guest"}
                </span>
                .
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/45">
                Your personal fragrance collection starts here. Manage your
                orders, update your details, and discover your next signature
                scent.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
                <CalendarDays size={15} className="text-[#c9a96e]" />
                <span>Member since {formatDate(user?.createdAt)}</span>
                <span className="mx-1 text-white/20">/</span>
                <span>{user?.email}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4 sm:p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/[0.07] text-xl text-[#d4b77e]">
                {user?.name?.trim()?.charAt(0)?.toUpperCase() || "N"}
              </div>

              <div>
                <p className="font-medium text-white">{user?.name}</p>
                <p className="mt-1 text-xs text-white/40">NOIR Member</p>

                <Link
                  href="/dashboard/profile"
                  className="mt-2 inline-block text-xs text-[#c9a96e] hover:text-[#e4cfaa]"
                >
                  Edit profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick access — moved above statistics */}
        <section className="mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Quick access</h3>
            <p className="mt-1 text-xs text-white/40">Manage your account</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <QuickLink
              href="/cart"
              icon={ShoppingCart}
              title="Shopping cart"
              description="Review your selected fragrances"
            />

            <QuickLink
              href="/dashboard/profile"
              icon={UserRound}
              title="Personal information"
              description="Update your name and email"
            />

            <QuickLink
              href="/dashboard/security"
              icon={ShieldCheck}
              title="Password & security"
              description="Keep your account secure"
            />

            <QuickLink
              href="/dashboard/orders"
              icon={PackageCheck}
              title="My orders"
              description="View your purchase history"
            />
          </div>
        </section>

        {/* Order statistics */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={ShoppingBag}
            label="Total orders"
            value={summary.total ?? 0}
            description="Your recent order history"
          />

          <StatCard
            icon={Clock3}
            label="Pending"
            value={summary.pending ?? 0}
            description="Awaiting payment or confirmation"
          />

          <StatCard
            icon={ArrowDownRight}
            label="In progress"
            value={summary.processing ?? 0}
            description="Confirmed, processing or shipped"
          />

          <StatCard
            icon={PackageCheck}
            label="Delivered"
            value={summary.delivered ?? 0}
            description="Successfully delivered orders"
          />
        </section>

        {/* Recent orders — full width */}
        <div className="mt-8">
          <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111110]">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
              <div>
                <h3 className="text-lg font-medium">Recent orders</h3>
                <p className="mt-1 text-xs text-white/40">
                  Track your latest purchases
                </p>
              </div>

              <Link
                href="/dashboard/orders"
                className="inline-flex items-center gap-1.5 text-xs text-[#c9a96e] transition hover:text-[#e4cfaa]"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#c9a96e]">
                  <ShoppingBag size={23} />
                </div>

                <h4 className="mt-5 text-base font-medium">No orders yet</h4>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/40">
                  Your orders will appear here after you make your first
                  purchase.
                </p>

                <Link
                  href="/product"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c9a96e] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#ddc18c]"
                >
                  Explore fragrances
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {orders.slice(0, 5).map((order) => {
                  const status = STATUS[order.status] || STATUS.pending;

                  return (
                    <div
                      key={order.id}
                      className="flex flex-col gap-4 px-5 py-5 transition hover:bg-white/[0.015] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white/90">
                          #{order.orderNumber}
                        </p>

                        <p className="mt-2 text-xs text-white/40">
                          {formatDate(order.createdAt)}
                          <span className="mx-2 text-white/20">·</span>
                          {order.items?.length || 0} product types
                        </p>

                        <p className="mt-2 text-xs text-white/40">
                          Payment:{" "}
                          {PAYMENT_STATUS[order.paymentStatus] ||
                            order.paymentStatus}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-medium text-[#d4b77e]">
                            {formatPrice(order.total, order.currency)}
                          </p>

                          <span
                            className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <Link
                          href="/dashboard/orders"
                          aria-label={`View order ${order.orderNumber}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/50 transition hover:border-[#c9a96e]/30 hover:text-[#c9a96e]"
                        >
                          <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/[0.06] pt-5 text-center text-[10px] uppercase tracking-[0.25em] text-white/25">
          NOIR — Discover your signature scent
        </footer>
      </div>
    </main>
  );
}
