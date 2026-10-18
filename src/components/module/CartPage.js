"use client";

import Link from "next/link";
import { useCart } from "@/components/module/CartProvider";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

export default function CartPage() {
  const {
    items,
    loaded,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const formatPrice = (price, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(price);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#101010] px-6 py-32 text-center text-[#c5a46d]">
        Loading your bag...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101010] px-5 py-16 text-[#f0ebe2] md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-12 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#c5a46d]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mb-12 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-8">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#c5a46d]">
              Your selection
            </p>
            <h1 className="text-4xl font-light tracking-wide md:text-5xl">
              Shopping Bag
            </h1>
            <p className="mt-3 text-sm text-white/50">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your bag
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs uppercase tracking-widest text-white/50 transition hover:text-red-400"
            >
              Clear bag
            </button>
          )}
        </div>

        {error && (
          <p className="mb-6 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <ShoppingBag size={42} strokeWidth={1} className="text-[#c5a46d]" />
            <h2 className="mt-7 text-2xl font-light">Your bag is empty</h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-white/50">
              Discover a fragrance that expresses your signature.
            </p>
            <Link
              href="/product"
              className="mt-8 border border-[#c5a46d] px-8 py-4 text-xs uppercase tracking-[0.2em] text-[#c5a46d] transition hover:bg-[#c5a46d] hover:text-[#101010]"
            >
              Explore fragrances
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
            <div className="divide-y divide-white/10">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="flex gap-5 py-7 first:pt-0 sm:gap-8"
                >
                  <Link
                    href={item.slug ? `/products/${item.slug}` : "/collections"}
                    className="flex h-36 w-28 shrink-0 items-center justify-center bg-[#191817] sm:h-44 sm:w-36"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingBag
                        size={30}
                        strokeWidth={1}
                        className="text-[#c5a46d]/50"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#c5a46d]">
                        {item.category || "NOIR FRAGRANCE"}
                      </p>
                      <Link
                        href={
                          item.slug ? `/products/${item.slug}` : "/collections"
                        }
                        className="text-lg font-light transition hover:text-[#c5a46d] sm:text-xl"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-2 text-sm text-white/60">
                        {formatPrice(item.price, item.currency)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center border border-white/15">
                        <button
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="p-2.5 text-white/70 transition hover:text-[#c5a46d] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          aria-label="Increase quantity"
                          disabled={item.quantity >= 20}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="p-2.5 text-white/70 transition hover:text-[#c5a46d] disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-red-400"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit border border-white/10 bg-[#151515] p-6 sm:p-8">
              <h2 className="text-xl font-light">Order Summary</h2>

              <div className="mt-7 space-y-4 border-b border-white/10 pb-6 text-sm">
                <div className="flex justify-between gap-4 text-white/60">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between gap-4 text-white/60">
                  <span>Shipping</span>
                  <span className="text-[#c5a46d]">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-sm text-white/60">Subtotal</span>
                <span className="text-xl font-light text-[#c5a46d]">
                  {formatPrice(totalPrice, items[0]?.currency || "USD")}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-8 block w-full bg-[#c5a46d] px-5 py-4 text-center text-xs uppercase tracking-[0.2em] text-[#101010] transition hover:bg-[#d6b984]"
              >
                Proceed to Checkout
              </Link>

              <p className="mt-4 text-center text-xs leading-6 text-white/40">
                Shipping and payment options will be available soon.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
