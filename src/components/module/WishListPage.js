"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useWishlist } from "../module/WishlistProvider";
import { useCart } from "../module/CartProvider";

export default function WishlistPage() {
  const { wishlist, loaded, removeFavorite, clearWishlist } = useWishlist();

  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error("Wishlist products error:", err);
        setError("Could not load fragrances. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const favoriteProducts = products.filter((product) =>
    wishlist.includes(String(product._id || product.id || product.slug))
  );

  const formatPrice = (product) => {
    const price = Number(product.price);

    if (!Number.isFinite(price)) return "Price unavailable";

    return `${product.currency === "USD" ? "$" : ""}${price.toFixed(2)}`;
  };

  async function handleAddToCart(product) {
    const id = String(product._id || product.id || product.slug);

    setAddingId(id);

    try {
      const success = await addToCart(product);

      if (success === false) return;

      setAddedId(id);
      setTimeout(() => setAddedId(null), 1500);
    } catch (err) {
      console.error("Could not add product to cart:", err);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#101010] px-5 py-16 text-[#f0ebe2] md:px-10 md:py-24 lg:px-16"
    >
      <div className="mx-auto max-w-[1440px]">
        <Link
          href="/product"
          className="mb-12 inline-flex items-center gap-3 text-[10px] tracking-[0.18em] text-white/50 transition hover:text-[#c5a46d]"
        >
          <ArrowLeft size={15} />
          CONTINUE EXPLORING
        </Link>

        <div className="mb-12 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-8">
          <div>
            <p className="mb-4 text-[10px] tracking-[0.3em] text-[#c5a46d]">
              YOUR PERSONAL SELECTION
            </p>

            <h1 className="noir-serif text-5xl tracking-[-0.04em] sm:text-7xl">
              Wishlist<span className="text-[#c5a46d]">.</span>
            </h1>
          </div>

          {!loading && loaded && favoriteProducts.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-[10px] tracking-[0.15em] text-white/45 transition hover:text-[#c5a46d]"
            >
              CLEAR ALL
            </button>
          )}
        </div>

        {!loaded || loading ? (
          <p className="py-20 text-center text-sm text-white/45">
            Loading your selection...
          </p>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 border border-white/20 px-5 py-3 text-xs hover:border-[#c5a46d]"
            >
              TRY AGAIN
            </button>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Heart size={36} strokeWidth={1} className="mb-6 text-[#c5a46d]" />

            <h2 className="noir-serif text-3xl">Nothing saved. Yet.</h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-white/45">
              Keep the fragrances that speak to you close. Your personal
              collection starts here.
            </p>

            <Link
              href="/product"
              className="mt-8 inline-flex items-center gap-4 bg-[#c5a46d] px-6 py-4 text-[10px] tracking-[0.16em] text-[#101010] transition hover:bg-[#e0c79b]"
            >
              DISCOVER FRAGRANCES
              <ArrowUpRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteProducts.map((product) => {
              const id = String(product._id || product.id || product.slug);

              return (
                <article key={id} className="noir-product-card group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#242222]">
                    <Link
                      href={`/product/${product.slug}`}
                      className="block h-full w-full"
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={product.image || product.images?.[0] || ""}
                        alt={product.name || "Fragrance"}
                        loading="lazy"
                        className="noir-product-image h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFavorite(id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#c5a46d]/50 bg-black/60 text-[#c5a46d] transition hover:bg-[#c5a46d] hover:text-black"
                    >
                      <Trash2 size={16} />
                    </button>

                    <span className="absolute bottom-4 left-4 border border-white/20 bg-black/50 px-3 py-2 text-[8px] tracking-[0.2em] backdrop-blur-sm">
                      {product.tag || product.category}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 py-5">
                    <div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="noir-serif text-2xl tracking-[0.04em] transition hover:text-[#c5a46d]"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-2 text-[10px] text-white/45">
                        {product.subtitle || product.category}
                      </p>

                      <p className="mt-4 text-xs text-[#c5a46d]">
                        {formatPrice(product)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={addingId === id}
                      onClick={() => handleAddToCart(product)}
                      className="mt-1 flex items-center gap-2 border border-white/20 px-3 py-3 text-[9px] tracking-[0.08em] transition hover:border-[#c5a46d] hover:bg-[#c5a46d] hover:text-black disabled:opacity-50"
                    >
                      <ShoppingBag size={14} />
                      {addingId === id
                        ? "ADDING..."
                        : addedId === id
                        ? "ADDED ✓"
                        : "ADD +"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
