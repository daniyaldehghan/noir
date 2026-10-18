"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useCart } from "../module/CartProvider";
import ProductReviews from "./ProductReviews";

export default function ProductPage({ slug }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const stock = Math.max(0, Number(product?.stock) || 0);
  const maxQuantity = Math.min(stock, 20);

  const [selectedImage, setSelectedImage] = useState(0);

  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { addToCart } = useCart();
  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          `/api/products?slug=${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Could not load this fragrance.");
        }

        const data = await response.json();

        if (!cancelled) {
          const products = data.products || [];
          const found =
            data.product ||
            products.find((item) => item.slug === slug || item.id === slug);

          setProduct(found || null);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#101010] text-sm tracking-widest text-[#c5a46d]">
        LOADING FRAGRANCE...
      </main>
    );
  }

  if (loadError || !product) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#101010] px-6 text-center text-[#f0ebe2]">
        <p className="text-[10px] tracking-[0.3em] text-[#c5a46d]">
          NOIR — COLLECTION
        </p>
        <h1 className="noir-serif mt-6 text-4xl">
          {loadError ? "Unable to load fragrance." : "Fragrance not found."}
        </h1>
        {loadError && <p className="mt-4 text-sm text-white/50">{loadError}</p>}
        <Link
          href="/collections"
          className="mt-8 border border-white/20 px-6 py-4 text-[10px] tracking-widest transition hover:border-[#c5a46d] hover:text-[#c5a46d]"
        >
          BACK TO COLLECTION
        </Link>
      </main>
    );
  }

  async function handleAddToCart() {
    setCartError("");

    const success = await addToCart(product, quantity);

    if (success) {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1500);
    } else {
      setCartError("Could not add this fragrance to your bag.");
    }
  }

  const productImages = [
    ...new Set([product?.image, ...(product?.images || [])].filter(Boolean)),
  ];

  const price =
    typeof product.price === "number"
      ? `${product.currency === "USD" ? "$" : ""}${product.price}`
      : product.price;

  return (
    <main className="min-h-screen bg-[#101010] text-[#f0ebe2]">
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-10 lg:px-16">
        <Link
          href="/collections"
          className="inline-flex items-center gap-3 text-[9px] tracking-[0.2em] text-white/50 transition hover:text-[#c5a46d]"
        >
          <ArrowLeft size={14} />
          BACK TO COLLECTION
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Product image gallery */}
          <div>
            <div className="relative overflow-hidden bg-[#242222]">
              <div className="aspect-[4/5]">
                {productImages.length > 0 ? (
                  <img
                    key={productImages[selectedImage]}
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs tracking-widest text-white/40">
                    NO IMAGE AVAILABLE
                  </div>
                )}
              </div>

              {product.tag && (
                <span className="absolute left-5 top-5 border border-white/20 bg-black/30 px-4 py-3 text-[9px] tracking-[0.2em] backdrop-blur-sm">
                  {product.tag}
                </span>
              )}

              <span className="absolute bottom-5 right-5 text-[9px] tracking-[0.2em] text-white/60">
                NOIR / SIGNATURE COLLECTION
              </span>

              {productImages.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setSelectedImage(
                        (current) =>
                          (current - 1 + productImages.length) %
                          productImages.length
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-white transition hover:border-[#c5a46d] hover:text-[#c5a46d]"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() =>
                      setSelectedImage(
                        (current) => (current + 1) % productImages.length
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/40 text-white transition hover:border-[#c5a46d] hover:text-[#c5a46d]"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                    className={`aspect-square overflow-hidden border transition ${
                      selectedImage === index
                        ? "border-[#c5a46d]"
                        : "border-white/10 opacity-60 hover:border-white/40 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="flex flex-col justify-center py-4 lg:py-10">
            <p className="text-[10px] tracking-[0.3em] text-[#c5a46d]">
              {product.category || "EAU DE PARFUM"}
            </p>

            <h1 className="noir-serif mt-6 text-5xl leading-tight sm:text-7xl">
              {product.name}
              <span className="text-[#c5a46d]">.</span>
            </h1>

            <p className="mt-6 text-lg text-[#c5a46d]">{price}</p>

            <div className="my-8 h-px w-full bg-white/10" />

            <p className="max-w-lg text-sm leading-8 text-white/55">
              {product.description ||
                `An expressive fragrance from the NOIR collection. Discover a distinctive scent crafted to become part of your signature.`}
            </p>

            {/* Fragrance specifications */}
            {(product.volume ||
              product.fragranceFamily ||
              product.scentNotes?.top?.length ||
              product.scentNotes?.heart?.length ||
              product.scentNotes?.base?.length ||
              product.longevity ||
              product.sillage ||
              product.gender ||
              product.season?.length > 0) && (
              <section className="mt-8 border-y border-white/10 py-7">
                <p className="text-[9px] tracking-[0.25em] text-[#c5a46d]">
                  FRAGRANCE PROFILE
                </p>

                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
                  {[
                    ["VOLUME", product.volume],
                    ["FRAGRANCE FAMILY", product.fragranceFamily],
                    ["LONGEVITY", product.longevity],
                    ["SILLAGE", product.sillage],
                    ["GENDER", product.gender],
                    [
                      "SEASON",
                      Array.isArray(product.season)
                        ? product.season.join(" / ")
                        : "",
                    ],
                  ]
                    .filter(([, value]) => value)
                    .map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[9px] tracking-[0.15em] text-white/35">
                          {label}
                        </p>
                        <p className="mt-2 text-sm text-[#f0ebe2]/80">
                          {value}
                        </p>
                      </div>
                    ))}
                </div>

                {[
                  ["TOP NOTES", product.scentNotes?.top],
                  ["HEART NOTES", product.scentNotes?.heart],
                  ["BASE NOTES", product.scentNotes?.base],
                ].map(([label, notes]) =>
                  Array.isArray(notes) && notes.length > 0 ? (
                    <div
                      key={label}
                      className="mt-6 border-t border-white/10 pt-5"
                    >
                      <p className="text-[9px] tracking-[0.18em] text-[#c5a46d]">
                        {label}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {notes.map((note, index) => (
                          <span
                            key={`${note}-${index}`}
                            className="border border-white/10 px-3 py-2 text-xs text-white/65"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </section>
            )}

            <div className="mt-9">
              <p
                className={`mt-5 text-xs ${
                  stock > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {stock > 0 ? `IN STOCK — ${stock} AVAILABLE` : "OUT OF STOCK"}
              </p>
              <p className="mb-4 text-[9px] tracking-[0.2em] text-white/50">
                QUANTITY
              </p>

              <div className="flex w-fit items-center border border-white/20">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="p-4 transition hover:text-[#c5a46d] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>

                <span className="min-w-10 text-center text-xs tabular-nums">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= maxQuantity}
                  onClick={() =>
                    setQuantity((value) => Math.min(maxQuantity, value + 1))
                  }
                  className="p-4 transition hover:text-[#c5a46d] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-7 flex min-h-14 w-full items-center justify-center gap-4 bg-[#c5a46d] px-6 text-[10px] tracking-[0.18em] text-[#101010] transition hover:bg-[#e0c79b] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={stock < 1 || quantity > stock}
            >
              <ShoppingBag size={17} />
              {added
                ? "ADDED TO BAG ✓"
                : `ADD TO BAG — ${
                    typeof product.price === "number"
                      ? `$${product.price * quantity}`
                      : price
                  }`}
            </button>
            {cartError && (
              <p className="mt-3 text-sm text-red-400">{cartError}</p>
            )}
            <div className="mt-10 grid grid-cols-2 gap-5 border-t border-white/10 pt-6">
              <div>
                <p className="text-[9px] tracking-[0.18em] text-[#c5a46d]">
                  THE EXPERIENCE
                </p>
                <p className="mt-3 text-xs leading-6 text-white/50">
                  A signature scent for unforgettable moments.
                </p>
              </div>

              <div>
                <p className="text-[9px] tracking-[0.18em] text-[#c5a46d]">
                  THE COLLECTION
                </p>
                <Link
                  href="/collections"
                  className="mt-3 inline-flex items-center gap-2 text-xs text-white/50 transition hover:text-white"
                >
                  Explore NOIR <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductReviews slug={slug} />
    </main>
  );
}
