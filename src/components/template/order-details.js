"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  MapPin,
  Receipt,
} from "lucide-react";

const STATUS = {
  pending: { label: "در انتظار تأیید", icon: Clock3 },
  processing: { label: "در حال آماده‌سازی", icon: Package },
  shipped: { label: "ارسال شده", icon: Truck },
  delivered: { label: "تحویل داده شده", icon: CheckCircle2 },
  cancelled: { label: "لغو شده", icon: XCircle },
};

function money(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}

function date(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function OrderDetailsPage({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/dashbord/orders/${encodeURIComponent(orderId)}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "دریافت سفارش ناموفق بود.");
        }

        if (active) setOrder(data.order);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#090909] p-8 text-white">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-5 h-8 w-48 rounded bg-white/10" />
          <div className="h-64 rounded-3xl bg-white/5" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#090909] px-5 text-white"
      >
        <div className="max-w-md text-center">
          <XCircle className="mx-auto mb-4 text-red-400" size={38} />
          <h1 className="text-xl font-semibold">سفارش در دسترس نیست</h1>
          <p className="mt-3 text-sm leading-7 text-white/50">
            {error || "اطلاعات سفارش پیدا نشد."}
          </p>
          <Link
            href="/account/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d4af72] px-5 py-3 text-sm font-semibold text-black"
          >
            <ArrowRight size={17} />
            بازگشت به سفارش‌ها
          </Link>
        </div>
      </main>
    );
  }

  const status = STATUS[order.status] || {
    label: order.status || "نامشخص",
    icon: Clock3,
  };

  const StatusIcon = status.icon;
  const items = Array.isArray(order.items) ? order.items : [];
  const address = order.shippingAddress;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#090909] px-4 py-10 text-white sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account/orders"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#d4af72]"
        >
          <ArrowRight size={17} />
          بازگشت به سفارش‌ها
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-2 text-xs tracking-[0.3em] text-[#d4af72]">
              ORDER DETAILS
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              جزئیات سفارش
            </h1>
            <p className="mt-3 text-sm text-white/45">
              شماره سفارش: {order.orderNumber}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#d4af72]/20 bg-[#d4af72]/10 px-4 py-3 text-sm text-[#e6c994]">
            <StatusIcon size={18} />
            {status.label}
          </div>
        </div>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <Receipt className="mb-4 text-[#d4af72]" size={22} />
            <p className="text-sm text-white/45">مبلغ سفارش</p>
            <p className="mt-2 text-xl font-semibold">
              {money(order.total, order.currency)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <Clock3 className="mb-4 text-[#d4af72]" size={22} />
            <p className="text-sm text-white/45">تاریخ ثبت</p>
            <p className="mt-2 text-sm leading-6">{date(order.createdAt)}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <CheckCircle2 className="mb-4 text-[#d4af72]" size={22} />
            <p className="text-sm text-white/45">وضعیت پرداخت</p>
            <p className="mt-2 text-sm">
              {order.paymentStatus || "ثبت نشده"}
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-white/10 bg-[#111111] p-5 sm:p-7">
          <h2 className="mb-6 flex items-center gap-3 font-semibold">
            <Package className="text-[#d4af72]" size={21} />
            محصولات سفارش
          </h2>

          {items.length === 0 ? (
            <p className="text-sm text-white/45">
              اطلاعات محصولات این سفارش ثبت نشده است.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {items.map((item, index) => (
                <div
                  key={item.productId || item._id || index}
                  className="flex items-center justify-between gap-4 py-5"
                >
                  <div>
                    <p className="font-medium">
                      {item.name || item.title || "محصول NOIR"}
                    </p>
                    <p className="mt-2 text-sm text-white/40">
                      تعداد: {item.quantity || 1}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm text-[#d4af72]">
                    {money(
                      (Number(item.price) || 0) * (Number(item.quantity) || 1),
                      item.currency || order.currency
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111111] p-5 sm:p-7">
          <h2 className="mb-5 flex items-center gap-3 font-semibold">
            <MapPin className="text-[#d4af72]" size={21} />
            اطلاعات ارسال
          </h2>

          {address && typeof address === "object" ? (
            <div className="space-y-3 text-sm leading-7 text-white/60">
              {address.fullName && <p>{address.fullName}</p>}
              {address.phone && <p dir="ltr">{address.phone}</p>}
              {address.address && <p>{address.address}</p>}
              {address.city && (
                <p>
                  {address.city}
                  {address.postalCode ? ` — ${address.postalCode}` : ""}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm leading-7 text-white/45">
              اطلاعات آدرس ارسال برای این سفارش ثبت نشده است.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}