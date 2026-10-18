"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Package,
  PackageCheck,
  Clock3,
  Truck,
  XCircle,
  RefreshCw,
  ShoppingBag,
  CircleAlert,
} from "lucide-react";

const STATUSES = {
  pending: {
    label: "Pending",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    icon: Clock3,
  },
  confirmed: {
    label: "Confirmed",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    icon: PackageCheck,
  },
  processing: {
    label: "Processing",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    icon: PackageCheck,
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-500/20 bg-red-500/10 text-red-300",
    icon: XCircle,
  },
};

const FILTERS = [
  { value: "all", label: "All orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "In progress" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

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

function getStatus(status) {
  return STATUSES[status] || STATUSES.pending;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadOrders() {
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
            ? "Please sign in to view your orders."
            : result.message || "Could not load your orders."
        );
      }

      setOrders(result.orders || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : filter === "processing"
      ? orders.filter((order) =>
          ["confirmed", "processing"].includes(order.status)
        )
      : orders.filter((order) => order.status === filter);

  const totalSpent = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((total, order) => total + (Number(order.total) || 0), 0);

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-[#c9a96e]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]">
              NOIR / YOUR PURCHASES
            </p>

            <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
              Keep track of your fragrance purchases and order status.
            </p>
          </div>

          <Link
            href="/collection"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#c9a96e] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#ddc18c]"
          >
            Discover fragrances
            <ArrowUpRight size={16} />
          </Link>
        </header>

        {error ? (
          <div className="rounded-2xl border border-white/10 bg-[#111110] px-6 py-12 text-center">
            <CircleAlert size={32} className="mx-auto mb-4 text-red-400" />
            <h2 className="text-lg font-medium">Unable to load orders</h2>
            <p className="mt-2 text-sm text-white/45">{error}</p>

            <button
              type="button"
              onClick={loadOrders}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#c9a96e] px-4 py-3 text-sm font-medium text-black hover:bg-[#ddc18c]"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="animate-pulse space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 rounded-2xl bg-white/[0.05]" />
              ))}
            </div>

            <div className="h-20 rounded-2xl bg-white/[0.05]" />
            <div className="h-72 rounded-2xl bg-white/[0.05]" />
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.07] bg-[#111110] p-5">
                <p className="text-sm text-white/45">Total orders</p>
                <p className="mt-4 text-3xl font-light">{orders.length}</p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#111110] p-5">
                <p className="text-sm text-white/45">In progress</p>
                <p className="mt-4 text-3xl font-light">
                  {
                    orders.filter((order) =>
                      [
                        "pending",
                        "confirmed",
                        "processing",
                        "shipped",
                      ].includes(order.status)
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#111110] p-5">
                <p className="text-sm text-white/45">Paid orders total</p>
                <p className="mt-4 text-3xl font-light text-[#d4b77e]">
                  {formatPrice(totalSpent)}
                </p>
                <p className="mt-2 text-xs text-white/30">
                  Sum of paid orders in USD
                </p>
              </div>
            </section>

            <section className="mt-8">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium">Order history</h2>
                  <p className="mt-1 text-xs text-white/40">
                    {filteredOrders.length} orders shown
                  </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {FILTERS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setFilter(item.value)}
                      className={`shrink-0 rounded-xl border px-3 py-2 text-xs transition ${
                        filter === item.value
                          ? "border-[#c9a96e]/40 bg-[#c9a96e]/10 text-[#d4b77e]"
                          : "border-white/[0.08] bg-[#111110] text-white/45 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.07] bg-[#111110] px-6 py-16 text-center">
                  <ShoppingBag
                    size={30}
                    className="mx-auto mb-4 text-[#c9a96e]"
                  />

                  <h3 className="text-lg font-medium">
                    {orders.length === 0
                      ? "No orders yet"
                      : "No orders in this category"}
                  </h3>

                  <p className="mt-2 text-sm text-white/40">
                    {orders.length === 0
                      ? "Your purchases will appear here."
                      : "Try selecting a different status filter."}
                  </p>

                  {orders.length === 0 && (
                    <Link
                      href="/collection"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c9a96e] px-5 py-3 text-sm font-medium text-black hover:bg-[#ddc18c]"
                    >
                      Browse collection
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const status = getStatus(order.status);
                    const StatusIcon = status.icon;

                    return (
                      <article
                        key={order.id}
                        className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111110] transition hover:border-[#c9a96e]/20"
                      >
                        <div className="flex flex-col gap-4 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                              Order number
                            </p>

                            <h3 className="mt-2 text-base font-medium">
                              #{order.orderNumber}
                            </h3>

                            <p className="mt-2 text-xs text-white/40">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${status.className}`}
                            >
                              <StatusIcon size={14} />
                              {status.label}
                            </span>

                            <div className="text-right">
                              <p className="text-[10px] text-white/35">
                                Order total
                              </p>
                              <p className="mt-1 font-medium text-[#d4b77e]">
                                {formatPrice(order.total, order.currency)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                          <div>
                            <p className="text-sm text-white/75">
                              {order.items?.length || 0} product types
                            </p>

                            <p className="mt-2 text-xs text-white/40">
                              Payment:{" "}
                              <span className="text-white/65">
                                {order.paymentStatus || "Unknown"}
                              </span>
                            </p>
                          </div>

                          <Link
                            href="/dashboard/orders"
                            className="inline-flex items-center gap-2 text-sm text-[#c9a96e] transition hover:text-[#e4cfaa]"
                          >
                            Order information
                            <ArrowUpRight size={16} />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        <footer className="mt-12 border-t border-white/[0.06] pt-5 text-center text-[10px] uppercase tracking-[0.25em] text-white/25">
          NOIR — Discover your signature scent
        </footer>
      </div>
    </main>
  );
}
