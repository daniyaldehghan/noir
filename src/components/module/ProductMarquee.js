"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpLeft, Sparkles } from "lucide-react";

export default function ProductMarquee() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();
        const items = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        if (active) {
          setProducts(items.filter((product) => product.isActive !== false));
        }
      } catch (error) {
        console.error("Product marquee error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const formatPrice = (price, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(price || 0);

  if (loading) {
    return (
      <section className="bg-[#101010] px-6 py-16 text-center text-[#C5A46D]">
        <div className="animate-pulse">Loading the collection...</div>
      </section>
    );
  }

  if (!products.length) return null;

  // تکرار محصولات برای حرکت بی‌وقفه
  const loopProducts = [...products, ...products];

  return (
    <section
      dir="ltr"
      className="overflow-hidden bg-[#101010] py-16 text-[#F0EBE2] sm:py-20"
    >
      <div className="mx-auto mb-10 max-w-7xl px-5 sm:px-8" dir="rtl">
        <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.25em] text-[#C5A46D]">
          <Sparkles size={15} />
          THE NOIR COLLECTION
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-light tracking-wide sm:text-4xl">
            Fragrances Beyond Time
            </h2>
            <p className="mt-3 text-sm text-white/50">
            A collection of unique fragrances for distinctive tastes
            </p>
          </div>

          <Link
            href="/product"
            className="hidden items-center gap-2 text-sm text-[#C5A46D] transition hover:text-white sm:flex"
          >
           View all
            <ArrowUpLeft size={17} />
          </Link>
        </div>
      </div>

      <div className="noir-marquee group relative">
        {/* محو شدن لبه‌ها */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#101010] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#101010] to-transparent sm:w-24" />

        <div className="noir-marquee-track flex w-max">
          {loopProducts.map((product, index) => (
            <Link
              key={`${product._id || product.slug}-${index}`}
              href={`/product/${product.slug}`}
              draggable={false}
              className="group/card mx-3 block w-56 shrink-0 sm:mx-4 sm:w-72"
            >
              <div className="relative aspect-[4/5] overflow-hidden border border-white/[0.08] bg-[#181818]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    draggable={false}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover/card:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#C5A46D]/50">
                    <Sparkles size={40} strokeWidth={1} />
                  </div>
                )}

                {product.tag && (
                  <span className="absolute left-3 top-3 border border-[#C5A46D]/40 bg-black/70 px-3 py-1 text-[10px] tracking-wider text-[#C5A46D]">
                    {product.tag}
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="px-1 pt-4 text-right" dir="rtl">
                <p className="truncate text-base font-light text-[#F0EBE2] transition group-hover/card:text-[#C5A46D]">
                  {product.name}
                </p>

                <p className="mt-2 text-xs text-white/45">{product.category}</p>

                <p className="mt-3 text-sm tracking-wide text-[#C5A46D]">
                  {formatPrice(product.price, product.currency)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 px-5 text-center sm:hidden" dir="rtl">
        <Link
          href="/product"
          className="inline-flex items-center gap-2 text-sm text-[#C5A46D]"
        >
         View all products
          <ArrowUpLeft size={17} />
        </Link>
      </div>
    </section>
  );
}
