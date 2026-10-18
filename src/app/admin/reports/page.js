"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  ClipboardList,
  CreditCard,
  DollarSign,
  LoaderCircle,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
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
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentLabels = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
};

export default function AdminReportsPage() {
  const [range, setRange] = useState("30");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReports() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/admin/reports?range=${range}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load reports.");
        }

        if (active) setData(result);
      } catch (err) {
        if (active) setError(err.message || "Failed to fetch reports.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, [range]);

  const summary = data?.summary;
  const daily = data?.dailyRevenue || [];
  const maxRevenue = Math.max(...daily.map((item) => item.revenue), 1);

  return (
    <main
      dir="ltr"
      className="min-h-screen bg-[#101010] px-5 py-8 text-[#f0ebe2] sm:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm text-[#c5a46d] transition hover:text-[#e0bd78]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-semibold">Sales Reports</h1>

            <p className="mt-2 text-sm text-neutral-500">
              Analyze revenue, orders, and product performance
            </p>
          </div>

          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-sm outline-none focus:border-[#c5a46d]"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </header>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-72 items-center justify-center gap-3 text-neutral-400">
            <LoaderCircle size={22} className="animate-spin" />
            Generating reports...
          </div>
        ) : data ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric
                title="Paid Revenue"
                value={money(summary.revenue)}
                icon={DollarSign}
              />

              <Metric
                title="Paid Orders"
                value={summary.orders.toLocaleString("en-US")}
                icon={ShoppingBag}
              />

              <Metric
                title="Average Order Value"
                value={money(summary.averageOrderValue)}
                icon={CreditCard}
              />

              <Metric
                title="Revenue Change"
                value={
                  summary.revenueChange === null
                    ? "Insufficient Data"
                    : `${summary.revenueChange >= 0 ? "+" : ""}${summary.revenueChange.toFixed(1)}%`
                }
                icon={
                  summary.revenueChange !== null && summary.revenueChange < 0
                    ? TrendingDown
                    : TrendingUp
                }
                description={`Previous period revenue: ${money(summary.previousRevenue)}`}
              />
            </section>

            <section className="mt-7 rounded-2xl border border-white/[0.08] bg-[#171717] p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-[#c5a46d]" />

                <div>
                  <h2 className="font-medium">Daily Revenue</h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    Paid orders only
                  </p>
                </div>
              </div>

              {daily.length === 0 ? (
                <p className="py-12 text-center text-sm text-neutral-500">
                  No paid revenue recorded during this period.
                </p>
              ) : (
                <div className="mt-8 overflow-x-auto">
                  <div className="flex h-64 min-w-max items-end gap-2">
                    {daily.map((item) => (
                      <div
                        key={item._id}
                        className="flex h-full w-12 flex-col items-center justify-end gap-2"
                        title={`${item._id}: ${money(item.revenue)} | ${item.orders} orders`}
                      >
                        <div className="flex w-full flex-1 items-end">
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-[#4a101b] to-[#c5a46d]"
                            style={{
                              height: `${
                                item.revenue > 0
                                  ? Math.max(
                                      (item.revenue / maxRevenue) * 100,
                                      4
                                    )
                                  : 1
                              }%`,
                            }}
                          />
                        </div>

                        <span className="text-[10px] text-neutral-500">
                          {item._id.slice(5)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="mt-7 grid gap-6 xl:grid-cols-3">
              <Breakdown
                title="Order Status"
                icon={ClipboardList}
                items={data.statusBreakdown}
                labels={statusLabels}
              />

              <Breakdown
                title="Payment Status"
                icon={CreditCard}
                items={data.paymentBreakdown}
                labels={paymentLabels}
              />

              <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5">
                <h2 className="font-medium">Order Count Change</h2>

                <p className="mt-4 text-3xl font-semibold">
                  {summary.orderChange === null
                    ? "—"
                    : `${summary.orderChange >= 0 ? "+" : ""}${summary.orderChange.toFixed(1)}%`}
                </p>

                <p className="mt-2 text-xs text-neutral-500">
                  Compared with the {range} days preceding this period
                </p>

                <p className="mt-5 text-sm text-neutral-400">
                  Previous period orders: {summary.previousOrders}
                </p>
              </div>
            </section>

            <section className="mt-7 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]">
              <div className="border-b border-white/[0.07] p-5">
                <h2 className="font-medium">Top 10 Products</h2>

                <p className="mt-1 text-xs text-neutral-500">
                  Ranked by sales revenue
                </p>
              </div>

              {data.topProducts.length === 0 ? (
                <p className="p-8 text-center text-sm text-neutral-500">
                  No data available to display.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left text-sm">
                    <thead className="text-xs text-neutral-500">
                      <tr>
                        <th className="px-5 py-4 font-normal">Product</th>
                        <th className="px-5 py-4 font-normal">Units Sold</th>
                        <th className="px-5 py-4 font-normal">Revenue</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.topProducts.map((product, index) => (
                        <tr
                          key={`${product.name}-${index}`}
                          className="border-t border-white/[0.06]"
                        >
                          <td className="px-5 py-4">{product.name}</td>
                          <td className="px-5 py-4 text-neutral-400">
                            {product.quantity}
                          </td>
                          <td className="px-5 py-4 text-[#c5a46d]">
                            {money(product.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}

function Metric({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-400">{title}</p>
        <Icon size={19} className="text-[#c5a46d]" />
      </div>

      <p className="mt-5 text-2xl font-semibold">{value}</p>

      {description && (
        <p className="mt-2 text-xs text-neutral-500">{description}</p>
      )}
    </div>
  );
}

function Breakdown({ title, icon: Icon, items = [], labels }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5">
      <div className="flex items-center gap-2">
        <Icon size={19} className="text-[#c5a46d]" />
        <h2 className="font-medium">{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          No data available.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item._id}>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span className="text-neutral-300">
                  {labels[item._id] || item._id}
                </span>

                <span className="text-neutral-500">{item.count}</span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-[#c5a46d]"
                  style={{
                    width: `${total ? (item.count / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
