"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LoaderCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

const statuses = [
  { value: "pending", label: "Pending Review" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentStatuses = [
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

const money = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

function statusLabel(value) {
  return statuses.find((item) => item.value === value)?.label || value;
}

function paymentLabel(value) {
  return paymentStatuses.find((item) => item.value === value)?.label || value;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const query = filter ? `?status=${filter}` : "";
      const response = await fetch(`/api/admin/orders${query}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function updateOrder(id, updates) {
    setSavingId(id);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save changes.");
      }

      setOrders((current) =>
        current.map((order) => (order._id === id ? data.order : order))
      );
      setMessage("Order updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSavingId("");
    }
  }

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

            <h1 className="mt-4 text-3xl font-semibold">Order Management</h1>

            <p className="mt-2 text-sm text-neutral-500">
              Review orders and update their status
            </p>
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm transition hover:border-[#c5a46d]/50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("")}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              !filter
                ? "bg-[#c5a46d] text-black"
                : "border border-white/10 text-neutral-400 hover:border-white/30"
            }`}
          >
            All Orders
          </button>

          {statuses.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                filter === item.value
                  ? "bg-[#c5a46d] text-black"
                  : "border border-white/10 text-neutral-400 hover:border-white/30"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {message && (
          <p className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#171717]">
          {loading ? (
            <div className="flex min-h-60 items-center justify-center gap-3 text-neutral-400">
              <LoaderCircle className="animate-spin" />
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-neutral-500">
              <ShoppingBag size={30} />
              No orders found for this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-white/[0.03] text-xs text-neutral-500">
                  <tr>
                    <th className="px-5 py-4 font-normal">Order Number</th>
                    <th className="px-5 py-4 font-normal">Customer</th>
                    <th className="px-5 py-4 font-normal">Items</th>
                    <th className="px-5 py-4 font-normal">Amount</th>
                    <th className="px-5 py-4 font-normal">Order Status</th>
                    <th className="px-5 py-4 font-normal">Payment Status</th>
                    <th className="px-5 py-4 font-normal">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-white/[0.06] align-top"
                    >
                      <td className="px-5 py-5 text-[#c5a46d]">
                        {order.orderNumber}
                      </td>

                      <td className="px-5 py-5">
                        <p>{order.customer?.fullName || "—"}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {order.customer?.email}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {order.customer?.phone}
                        </p>
                        <p className="mt-2 max-w-52 text-xs leading-5 text-neutral-400">
                          {order.customer?.city}
                          {order.customer?.city && order.customer?.address
                            ? ", "
                            : ""}
                          {order.customer?.address}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div
                              key={`${item.slug}-${index}`}
                              className="text-neutral-300"
                            >
                              <span>{item.name}</span>
                              <span className="ml-2 text-xs text-neutral-500">
                                × {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5">
                        {money(order.subtotal)}
                      </td>

                      <td className="px-5 py-5">
                        <label className="mb-2 block text-xs text-neutral-500">
                          {statusLabel(order.status)}
                        </label>

                        <select
                          value={order.status}
                          disabled={savingId === order._id}
                          onChange={(event) =>
                            updateOrder(order._id, {
                              status: event.target.value,
                            })
                          }
                          className="max-w-44 rounded-lg border border-white/10 bg-[#101010] px-3 py-2 text-xs outline-none focus:border-[#c5a46d] disabled:opacity-50"
                        >
                          {statuses.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-5">
                        <label className="mb-2 block text-xs text-neutral-500">
                          {paymentLabel(order.paymentStatus)}
                        </label>

                        <select
                          value={order.paymentStatus}
                          disabled={savingId === order._id}
                          onChange={(event) =>
                            updateOrder(order._id, {
                              paymentStatus: event.target.value,
                            })
                          }
                          className="max-w-44 rounded-lg border border-white/10 bg-[#101010] px-3 py-2 text-xs outline-none focus:border-[#c5a46d] disabled:opacity-50"
                        >
                          {paymentStatuses.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US")}
                        <p className="mt-1">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs leading-6 text-neutral-600">
          Order status changes are saved to the database immediately. Only
          update payment status after verifying the actual payment.
        </p>
      </div>
    </main>
  );
}
