"use client";
import { ArrowDown, ArrowUpRight, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCart } from "../module/CartProvider";
import { useWishlist } from "../module/WishlistProvider";
import ProductMarquee from "../module/ProductMarquee";
import HeroSection from "./HeroSection";
import HomeReviewForm from "./HomeReviewForm";
import CinematicHero from "./CinematicHero";
function HomePage() {
  //   const [addedId, setAddedId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;
  const [productsLoading, setProductsLoading] = useState(true);

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
        setProducts(data.products || []);
      } catch (error) {
        console.error("Home products error:", error);
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, []);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);
  return (
    <div>
      <CinematicHero />
      {/* <section
        id="home"
        className="noir-hero relative flex min-h-[650px] items-center md:min-h-[720px] lg:min-h-[790px]"
      >
        <div className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10 lg:px-16">
          <div className="max-w-[650px]">
            <div className="noir-reveal mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c5a46d]" />
              <span className="text-[9px] tracking-[0.32em] text-[#c5a46d] sm:text-[10px]">
                THE ART OF SCENT
              </span>
            </div>

            <h1 className="noir-serif noir-reveal noir-delay-1 text-[66px] leading-[0.94] tracking-[-0.045em] sm:text-8xl lg:text-[116px]">
              Beyond
              <br />
              <span className="italic text-[#c5a46d]">the</span> ordinary.
            </h1>

            <p className="noir-reveal noir-delay-2 mt-8 max-w-[360px] text-[12px] leading-7 text-white/60 sm:text-sm">
              Fragrances that leave a mark long after you have left the room.
              Discover a different kind of presence.
            </p>

            <div className="noir-reveal noir-delay-3 mt-10 flex flex-wrap items-center gap-6">
              <a
                href="#collections"
                className="group flex h-[52px] items-center gap-8 bg-[#c5a46d] px-6 text-[10px] tracking-[0.17em] text-[#101010] transition-colors hover:bg-[#e0c79b]"
              >
                DISCOVER THE COLLECTION
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
              <span className="text-[9px] tracking-[0.2em] text-white/45">
                EST. MMXXIV
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 flex items-center gap-3 text-[9px] tracking-[0.2em] text-white/45 md:left-10 lg:left-16">
          <span>SCROLL TO DISCOVER</span>
          <ArrowDown size={13} className="animate-bounce" />
        </div>

        <div className="absolute bottom-8 right-6 hidden text-[9px] tracking-[0.2em] text-white/40 sm:block md:right-10 lg:right-16">
          01 — THE SIGNATURE COLLECTION
        </div>
      </section> */}
      {/* Intro */}
      <section
        id="story"
        className="mx-auto grid max-w-[1440px] gap-8 px-6 py-24 md:grid-cols-2 md:items-end md:px-10 md:py-32 lg:px-16"
      >
        <div>
          <p className="mb-5 text-[10px] tracking-[0.28em] text-[#c5a46d]">
            MORE THAN A FRAGRANCE
          </p>
          <h2 className="noir-serif max-w-[560px] text-4xl leading-tight tracking-[-0.035em] sm:text-6xl">
            A scent is a memory
            <span className="italic text-[#c5a46d]"> in the making.</span>
          </h2>
        </div>

        <div className="max-w-[410px] md:ml-auto">
          <p className="text-sm leading-7 text-white/55">
            We believe the most unforgettable things are never the loudest. NOIR
            brings together rare ingredients, unexpected contrasts and the quiet
            confidence of true craftsmanship.
          </p>
          <a
            href="#collections"
            className="noir-link mt-7 inline-flex items-center gap-3 pb-1 text-[10px] tracking-[0.18em]"
          >
            EXPLORE OUR WORLD <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
      <HeroSection />
      <ProductMarquee />
      {/* Collection */}
      <section
        id="collections"
        className="border-t border-white/10 px-5 py-20 md:px-10 md:py-28 lg:px-16"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-4 text-[9px] tracking-[0.28em] text-[#c5a46d]">
                CURATED FOR THE UNFORGETTABLE
              </p>
              <h2 className="noir-serif text-4xl sm:text-6xl">
                The collection<span className="text-[#c5a46d]">.</span>
              </h2>
            </div>

            <p className="max-w-[240px] text-xs leading-6 text-white/45">
              Three signatures. Three different worlds. Find the one that feels
              like you.
            </p>
          </div>

          {productsLoading ? (
            <p className="py-12 text-center text-sm text-white/50">
              Loading fragrances...
            </p>
          ) : products.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/50">
              No fragrances available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {currentProducts.map((product, index) => {
                const id = product._id || product.id || product.slug;

                return (
                  <article key={id} className="noir-product-card group">
                    <a
                      href={`/product/${product.slug}`}
                      className="relative block aspect-[4/5] overflow-hidden"
                      style={{ backgroundColor: product.bg || "#242222" }}
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={product.image || product.images?.[0] || ""}
                        alt={product.name}
                        loading="lazy"
                        className="noir-product-image h-full w-full object-cover opacity-85"
                      />
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleFavorite(id);
                        }}
                        aria-label={
                          isFavorite(id)
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        aria-pressed={isFavorite(id)}
                        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:border-[#c5a46d] hover:text-[#c5a46d]"
                      >
                        <Heart
                          size={19}
                          className={
                            isFavorite(id)
                              ? "fill-[#c5a46d] text-[#c5a46d]"
                              : "text-white"
                          }
                        />
                      </button>
                      <span className="absolute left-4 top-4 border border-white/20 bg-black/25 px-3 py-2 text-[8px] tracking-[0.2em] backdrop-blur-sm">
                        {product.tag || product.category}
                      </span>

                      <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#f0ebe2] text-black opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight size={18} />
                      </span>
                    </a>

                    <div className="flex items-start justify-between gap-3 py-5">
                      <div>
                        <p className="noir-serif text-2xl tracking-[0.06em]">
                          {product.name}
                        </p>
                        <p className="mt-2 text-[10px] text-white/45">
                          {product.subtitle || product.category}
                        </p>
                        <p className="mt-4 text-xs text-[#c5a46d]">
                          {product.currency === "USD" ? "$" : ""}
                          {product.price}
                        </p>
                      </div>

                      <button
                        disabled={addingId === id}
                        onClick={async () => {
                          setAddingId(id);

                          try {
                            const success = await addToCart(product);

                            if (success) {
                              setAddedId(id);
                              setTimeout(() => setAddedId(null), 1500);
                            }
                          } finally {
                            setAddingId(null);
                          }
                        }}
                        className="mt-1 border border-white/20 px-3 py-3 text-[9px] tracking-[0.1em] transition hover:border-[#c5a46d] hover:bg-[#c5a46d] hover:text-black disabled:cursor-wait disabled:opacity-50"
                      >
                        {addingId === id
                          ? "ADDING..."
                          : addedId === id
                          ? "ADDED ✓"
                          : "ADD +"}
                      </button>
                    </div>

                    <span className="sr-only">Product {index + 1}</span>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <a
              href="/product"
              className="group flex items-center gap-5 border border-white/20 px-7 py-4 text-[10px] tracking-[0.17em] transition hover:border-[#c5a46d] hover:text-[#c5a46d]"
            >
              VIEW ALL FRAGRANCES
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>
      {/* Brand statement */}
      <section className="relative overflow-hidden bg-[#4a101b] px-6 py-28 text-center sm:py-36">
        <p className="mb-7 text-[9px] tracking-[0.35em] text-[#d9bc8a]">
          LESS, BUT BETTER
        </p>
        <h2 className="noir-serif mx-auto max-w-[850px] text-5xl leading-[1.1] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
          Not made to be
          <br />
          <span className="italic text-[#c5a46d]">forgotten.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-[340px] text-xs leading-6 text-white/60">
          Discover fragrance as an expression of identity, not an accessory.
        </p>
        <a
          href="/product"
          className="mt-9 inline-flex items-center gap-4 border-b border-[#c5a46d] pb-3 text-[10px] tracking-[0.2em] transition hover:text-[#c5a46d]"
        >
          FIND YOUR SIGNATURE <ArrowUpRight size={15} />
        </a>
      </section>
      <HomeReviewForm />
    </div>
  );
}

export default HomePage;
