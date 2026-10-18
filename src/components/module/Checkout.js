"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/components/module/CartProvider";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    loaded,
    error: cartError,
    totalItems,
    refreshCart,
  } = useCart();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const currency = items[0]?.currency || "USD";
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountRates = {
    NOIR10: 10,
    WELCOME15: 15,
  };

  const discountRate = appliedCode ? discountRates[appliedCode] || 0 : 0;

  const discountAmount = Number(((subtotal * discountRate) / 100).toFixed(2));

  const total = Number((subtotal - discountAmount).toFixed(2));

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discountCode: appliedCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not place your order.");
      }

      setSuccessOrder(data.order);
      await refreshCart();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#101010] px-6 py-32 text-center text-[#c5a46d]">
        Loading checkout...
      </main>
    );
  }

  if (successOrder) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101010] px-5 py-20 text-[#f0ebe2]">
        <div className="w-full max-w-xl border border-white/10 bg-[#151515] p-8 text-center sm:p-12">
          <CheckCircle2
            size={52}
            strokeWidth={1}
            className="mx-auto text-[#c5a46d]"
          />
          <p className="mt-7 text-xs uppercase tracking-[0.35em] text-[#c5a46d]">
            NOIR Fragrances
          </p>
          <h1 className="mt-4 text-3xl font-light">Order Received</h1>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Your order has been created successfully. Payment has not been
            collected.
          </p>

          <div className="mt-8 border-y border-white/10 py-5">
            <p className="text-xs text-white/50">Order Number</p>
            <p className="mt-2 break-all text-lg text-[#c5a46d]">
              {successOrder.orderNumber}
            </p>
            <p className="mt-3 text-sm text-white/60">
              Total: {formatPrice(successOrder.total ?? successOrder.subtotal)}
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-white/40">
              Payment: {successOrder.paymentStatus}
            </p>
          </div>

          <Link
            href="/collections"
            className="mt-8 inline-flex items-center justify-center gap-2 border border-[#c5a46d] px-7 py-4 text-xs uppercase tracking-[0.2em] text-[#c5a46d] transition hover:bg-[#c5a46d] hover:text-[#101010]"
          >
            Continue shopping
            <ArrowLeft size={15} />
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#101010] px-5 py-24 text-center text-[#f0ebe2]">
        <ShoppingBag
          size={42}
          strokeWidth={1}
          className="mx-auto text-[#c5a46d]"
        />
        <h1 className="mt-6 text-3xl font-light">Your bag is empty</h1>
        <Link
          href="/collections"
          className="mt-8 inline-block border border-[#c5a46d] px-7 py-4 text-xs uppercase tracking-widest text-[#c5a46d]"
        >
          Explore fragrances
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101010] px-5 py-16 text-[#f0ebe2] md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/cart"
          className="mb-10 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#c5a46d]"
        >
          <ArrowLeft size={16} />
          Back to bag
        </Link>

        <div className="mb-12 border-b border-white/10 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#c5a46d]">
            Almost yours
          </p>
          <h1 className="text-4xl font-light md:text-5xl">Checkout</h1>
          <p className="mt-4 text-sm text-white/50">
            Complete your details to place your order.
          </p>
        </div>

        {(error || cartError) && (
          <p className="mb-6 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            {error || cartError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="space-y-10">
            <section>
              <h2 className="mb-6 text-xl font-light">Contact Information</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  maxLength={120}
                />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  maxLength={254}
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 ..."
                  required
                  maxLength={30}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-xl font-light">Delivery Address</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  maxLength={100}
                />
                <Field
                  label="Postal Code"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Postal code"
                  required
                  maxLength={20}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Street Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Street, building, apartment..."
                    required
                    maxLength={1000}
                  />
                </div>
              </div>
            </section>

            <section>
              <label
                htmlFor="notes"
                className="mb-3 block text-xs uppercase tracking-[0.18em] text-white/60"
              >
                Order Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                placeholder="Any special delivery instructions..."
                className="w-full resize-y border border-white/15 bg-[#151515] px-4 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#c5a46d]"
              />
            </section>

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="flex w-full items-center justify-center gap-3 bg-[#c5a46d] px-6 py-5 text-xs uppercase tracking-[0.2em] text-[#101010] transition hover:bg-[#d6b984] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-64"
            >
              <LockKeyhole size={15} />
              {submitting ? "Placing Order..." : "Place Order"}
            </button>

            <p className="text-xs leading-6 text-white/40">
              This creates an unpaid order. No payment will be processed.
            </p>
          </form>

          <aside className="h-fit border border-white/10 bg-[#151515] p-6 sm:p-8">
            <h2 className="text-xl font-light">Order Summary</h2>
            <p className="mt-2 text-xs text-white/40">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>

            <div className="mt-6">
              <label
                htmlFor="discountCode"
                className="mb-3 block text-xs uppercase tracking-[0.18em] text-white/60"
              >
                Discount Code
              </label>

              <div className="flex gap-2">
                <input
                  id="discountCode"
                  type="text"
                  value={discountCode}
                  onChange={(event) =>
                    setDiscountCode(event.target.value.toUpperCase())
                  }
                  placeholder="Enter code"
                  maxLength={50}
                  disabled={Boolean(appliedCode)}
                  className="min-w-0 flex-1 border border-white/15 bg-[#101010] px-3 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#c5a46d] disabled:opacity-50"
                />

                {appliedCode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCode("");
                      setDiscountCode("");
                      setDiscountError("");
                    }}
                    className="border border-white/20 px-4 text-xs text-white/70 hover:border-[#c5a46d] hover:text-[#c5a46d]"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const code = discountCode.trim().toUpperCase();

                      if (!code) {
                        setDiscountError("Please enter a discount code.");
                        return;
                      }

                      if (!["NOIR10", "WELCOME15"].includes(code)) {
                        setDiscountError("Invalid discount code.");
                        return;
                      }

                      setAppliedCode(code);
                      setDiscountCode(code);
                      setDiscountError("");
                    }}
                    className="bg-[#c5a46d] px-4 text-xs text-[#101010] transition hover:bg-[#d6b984]"
                  >
                    Apply
                  </button>
                )}
              </div>

              {discountError && (
                <p className="mt-3 text-xs text-red-400">{discountError}</p>
              )}

              {appliedCode && (
                <p className="mt-3 text-xs text-green-400">
                  {appliedCode} applied
                </p>
              )}
            </div>

            <div className="mt-6 divide-y divide-white/10">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 py-5 first:pt-0"
                >
                  <div className="h-20 w-16 shrink-0 bg-[#202020]">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="mt-2 text-xs text-white/40">
                      Qty: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm text-[#c5a46d]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 space-y-4 border-t border-white/10 pt-6">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-white/50">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {appliedCode && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-green-400">
                    Discount ({discountRate}%)
                  </span>
                  <span className="text-green-400">
                    -{formatPrice(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 border-t border-white/10 pt-4">
                <span className="text-sm text-white/50">Total</span>
                <span className="text-xl text-[#c5a46d]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-white/40">
              Delivery charges, if applicable, will be confirmed separately.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-3 block text-xs uppercase tracking-[0.18em] text-white/60"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        autoComplete={
          name === "fullName"
            ? "name"
            : name === "email"
            ? "email"
            : name === "phone"
            ? "tel"
            : name === "address"
            ? "street-address"
            : name === "city"
            ? "address-level2"
            : name === "postalCode"
            ? "postal-code"
            : "off"
        }
        className="w-full border border-white/15 bg-[#151515] px-4 py-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#c5a46d]"
      />
    </div>
  );
}
