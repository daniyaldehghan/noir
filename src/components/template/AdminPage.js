"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpLeft,
  Box,
  ChartNoAxesCombined,
  Clock3,
  DollarSign,
  ExternalLink,
  LoaderCircle,
  Package,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";

const money = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const statusLabels = {
  pending: "Pending Review",
  confirmed: "Confirmed",
  processing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentLabels = {
  paid: "Paid",
  unpaid: "Unpaid",
  refunded: "Refunded",
};

function StatCard({ title, value, description, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5 transition hover:border-[#c5a46d]/40">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">{title}</p>
        <div className="rounded-xl bg-[#c5a46d]/10 p-3">
          <Icon size={19} className="text-[#c5a46d]" />
        </div>
      </div>

      <p className="mt-5 text-2xl font-semibold tracking-tight text-[#f0ebe2]">
        {value}
      </p>

      <p className="mt-2 text-xs text-neutral-500">{description}</p>

      {accent && <div className="mt-4 h-px bg-[#c5a46d]/20" />}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/admin/stats", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load the dashboard.");
        }

        if (active) setData(result);
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to fetch dashboard data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const stats = data?.stats;
  const chart = data?.salesChart || [];
  const orders = data?.recentOrders || [];
  const bestSellers = data?.bestSellers || [];
  const maxRevenue = Math.max(...chart.map((day) => day.revenue), 1);

  return (
    <main dir="ltr" className="min-h-screen bg-[#101010] text-[#f0ebe2]">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-9 flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center">
          <div>
            <Link href="/" className="text-xs tracking-[0.3em] text-[#c5a46d]">
              NOIR / STORE
            </Link>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              An overview of sales, orders, and product inventory
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:border-[#c5a46d]/50"
            >
              View Store <ExternalLink size={15} />
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:border-[#c5a46d]/50"
            >
              Manage Orders
            </Link>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:border-[#c5a46d]/50"
            >
              <Package size={17} />
              Add Perfume
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:border-[#c5a46d]/50"
            >
              Sales Reports
            </Link>

            <Link
              href="/admin/reviews"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:border-[#c5a46d]/50"
            >
              Reviews
            </Link>

            <Link
              href="/admin/edit"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:border-[#c5a46d]/50"
            >
              Edit Perfumes
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center gap-3 text-neutral-400">
            <LoaderCircle className="animate-spin" size={22} />
            Loading sales data...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-red-400">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm hover:border-[#c5a46d]"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Today's Revenue"
                value={money(stats.todayRevenue)}
                description="From today's paid orders"
                icon={DollarSign}
                accent
              />

              <StatCard
                title="Monthly Revenue"
                value={money(stats.monthRevenue)}
                description="Revenue since the beginning of the month"
                icon={ChartNoAxesCombined}
              />

              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString("en-US")}
                description={`${stats.pendingOrders} orders pending review`}
                icon={ShoppingBag}
              />

              <StatCard
                title="Active Products"
                value={stats.totalProducts.toLocaleString("en-US")}
                description={`${stats.lowStockProducts} products low in stock`}
                icon={Box}
              />
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
              <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium">Weekly Sales Trend</h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Daily revenue from paid orders
                    </p>
                  </div>

                  <span className="rounded-lg border border-[#c5a46d]/20 px-3 py-2 text-xs text-[#c5a46d]">
                    Last 7 Days
                  </span>
                </div>

                <div className="mt-8 flex h-56 items-end gap-2 sm:gap-4">
                  {chart.map((day) => {
                    const height =
                      day.revenue > 0
                        ? Math.max((day.revenue / maxRevenue) * 100, 5)
                        : 2;

                    const date = new Date(`${day.date}T12:00:00`);

                    return (
                      <div
                        key={day.date}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3"
                        title={`${day.date}: ${money(day.revenue)}`}
                      >
                        <div className="flex h-full w-full items-end justify-center">
                          <div
                            className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-[#4a101b] to-[#c5a46d] transition-all duration-500 hover:brightness-125"
                            style={{ height: `${height}%` }}
                          />
                        </div>

                        <span className="text-[10px] text-neutral-500 sm:text-xs">
                          {date.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-5 text-sm text-neutral-400">
                  <span className="h-2 w-2 rounded-full bg-[#c5a46d]" />
                  Total Recorded Revenue:
                  <strong className="text-[#f0ebe2]">
                    {money(chart.reduce((sum, day) => sum + day.revenue, 0))}
                  </strong>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium">Inventory Overview</h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Product stock status
                    </p>
                  </div>

                  <Package className="text-[#c5a46d]" size={22} />
                </div>

                <div className="mt-7 rounded-xl border border-white/[0.07] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-neutral-400">
                      Total Value of Paid Orders
                    </span>
                    <DollarSign className="text-[#c5a46d]" size={18} />
                  </div>

                  <p className="mt-3 text-2xl font-semibold">
                    {money(stats.totalRevenue)}
                  </p>
                </div>

                <div className="mt-4 rounded-xl border border-white/[0.07] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-neutral-400">
                      Low-Stock Products
                    </span>
                    <TriangleAlert className="text-amber-400" size={18} />
                  </div>

                  <p className="mt-3 text-2xl font-semibold">
                    {stats.lowStockProducts}
                  </p>

                  <p className="mt-2 text-xs text-neutral-500">
                    Stock level of 5 items or fewer
                  </p>
                </div>

                <Link
                  href="/admin/products/new"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#c5a46d]/30 px-4 py-3 text-sm text-[#c5a46d] transition hover:bg-[#c5a46d]/10"
                >
                  Add New Product <ArrowDownLeft size={16} />
                </Link>
              </div>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] p-5 sm:px-6">
                  <div>
                    <h2 className="font-medium">Recent Orders</h2>
                    <p className="mt-1 text-xs text-neutral-500">
                      Latest orders placed in the store
                    </p>
                  </div>

                  <Clock3 size={19} className="text-[#c5a46d]" />
                </div>

                {orders.length === 0 ? (
                  <p className="p-8 text-center text-sm text-neutral-500">
                    No orders have been placed yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead className="text-xs text-neutral-500">
                        <tr>
                          <th className="px-5 py-4 font-normal">
                            Order Number
                          </th>
                          <th className="px-5 py-4 font-normal">Customer</th>
                          <th className="px-5 py-4 font-normal">Amount</th>
                          <th className="px-5 py-4 font-normal">Status</th>
                          <th className="px-5 py-4 font-normal">Payment</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.orderNumber}
                            className="border-t border-white/[0.05]"
                          >
                            <td className="px-5 py-4 text-[#c5a46d]">
                              {order.orderNumber}
                            </td>

                            <td className="px-5 py-4 text-neutral-300">
                              {order.customer?.fullName || "—"}
                            </td>

                            <td className="px-5 py-4">
                              {money(order.subtotal)}
                            </td>

                            <td className="px-5 py-4 text-neutral-400">
                              {statusLabels[order.status] || order.status}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={
                                  order.paymentStatus === "paid"
                                    ? "text-emerald-400"
                                    : order.paymentStatus === "refunded"
                                    ? "text-amber-400"
                                    : "text-neutral-500"
                                }
                              >
                                {paymentLabels[order.paymentStatus] ||
                                  order.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-medium">Best-Selling Products</h2>
                    <p className="mt-1 text-xs text-neutral-500">
                      Ranked by paid units sold
                    </p>
                  </div>

                  <ArrowUpLeft size={19} className="text-[#c5a46d]" />
                </div>

                {bestSellers.length === 0 ? (
                  <p className="py-10 text-center text-sm text-neutral-500">
                    No paid sales are available to display yet.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {bestSellers.map((product, index) => (
                      <div
                        key={`${product.name}-${index}`}
                        className="flex items-center gap-3 border-b border-white/[0.06] pb-4 last:border-0"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#c5a46d]/10 text-sm text-[#c5a46d]">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{product.name}</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {product.quantitySold} units sold
                          </p>
                        </div>

                        <p className="shrink-0 text-xs text-neutral-300">
                          {money(product.revenue)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-xs text-neutral-600">
              <span>NOIR — Administration</span>
              <span>Data is retrieved from the store database.</span>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
