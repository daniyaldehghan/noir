"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpLeft,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Fragrances" },
  { value: "men", label: "Men's Fragrances" },
  { value: "women", label: "Women's Fragrances" },
  { value: "unisex", label: "Unisex Fragrances" },
];

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load products.");
      }

      const result = await response.json();
      const list = Array.isArray(result)
        ? result
        : result.products || result.data || [];

      setProducts(list.filter((product) => product.isActive !== false));
    } catch (err) {
      setError(err.message || "Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) =>
        [product.name, product.category, product.description, product.tag]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      );
    }

    if (category !== "all") {
      result = result.filter(
        (product) => String(product.category || "").toLowerCase() === category
      );
    }

    if (sort === "price-asc") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === "price-desc") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sort === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    }

    return result;
  }, [products, search, category, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  function formatPrice(price, currency = "USD") {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 2,
      }).format(Number(price) || 0);
    } catch {
      return new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 2,
      }).format(Number(price) || 0);
    }
  }

  return (
    <main dir="ltr" className="min-h-screen bg-[#101010] text-[#F0EBE2]">
      {/* Page Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#4A101B]/30 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-5 flex items-center gap-2 text-xs tracking-[0.25em] text-[#C5A46D]">
            <Sparkles size={15} />
            THE NOIR COLLECTION
          </div>

          <h1 className="text-4xl font-light leading-relaxed sm:text-6xl">
            Discover{" "}
            <span className="text-[#C5A46D]">Exceptional Fragrances</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-8 text-white/50 sm:text-base">
            Find a fragrance that reflects your personality, from timeless
            classics to bold and distinctive scents.
          </p>

          <div className="mt-8 flex items-center gap-3 text-xs text-white/40">
            <Link href="/" className="transition hover:text-[#C5A46D]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C5A46D]">Products</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search fragrances..."
              aria-label="Search fragrances"
              className="h-12 w-full border border-white/10 bg-[#171717] pl-12 pr-10 text-sm outline-none transition placeholder:text-white/30 focus:border-[#C5A46D]/60"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs text-white/45">
              <SlidersHorizontal size={15} />
              Category
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  className={`border px-4 py-2.5 text-xs transition ${
                    category === item.value
                      ? "border-[#C5A46D] bg-[#C5A46D] text-[#101010]"
                      : "border-white/10 text-white/55 hover:border-[#C5A46D]/50 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
              className="h-11 border border-white/10 bg-[#171717] px-3 text-xs text-white/70 outline-none focus:border-[#C5A46D]/60"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <p className="text-sm text-white/65">Our Collection</p>
          <p className="text-xs text-[#C5A46D]">
            {loading
              ? "Loading products..."
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1 ? "product" : "products"
                }`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 py-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] bg-white/[0.05]" />
                <div className="mt-4 h-4 w-2/3 bg-white/[0.07]" />
                <div className="mt-3 h-3 w-1/3 bg-white/[0.05]" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="py-20 text-center">
            <p className="text-sm text-red-300">{error}</p>

            <button
              type="button"
              onClick={fetchProducts}
              className="mt-5 border border-[#C5A46D]/50 px-5 py-3 text-sm text-[#C5A46D] transition hover:bg-[#C5A46D]/10"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center">
            <Sparkles className="mx-auto text-[#C5A46D]/60" size={30} />

            <h2 className="mt-5 text-xl font-light">No Products Found</h2>

            <p className="mt-3 text-sm text-white/40">
              Try changing your search or category filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSort("featured");
              }}
              className="mt-6 text-sm text-[#C5A46D] transition hover:text-white"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 py-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {currentProducts.map((product) => (
                <Link
                  key={product._id || product.slug}
                  href={`/product/${product.slug}`}
                  className="group block min-w-0"
                >
                  <div className="relative aspect-[4/5] overflow-hidden border border-white/[0.07] bg-[#181818]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || "Fragrance"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#C5A46D]/50">
                        <Sparkles size={36} strokeWidth={1} />
                      </div>
                    )}

                    {product.tag && (
                      <span className="absolute left-3 top-3 border border-[#C5A46D]/30 bg-black/70 px-2.5 py-1.5 text-[10px] text-[#C5A46D]">
                        {product.tag}
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-[#C5A46D] py-3 text-xs text-[#101010] transition-transform duration-300 group-hover:translate-y-0">
                      View Product
                      <ArrowUpLeft size={15} />
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="truncate text-sm font-light text-[#F0EBE2] transition group-hover:text-[#C5A46D] sm:text-base">
                      {product.name}
                    </p>

                    <p className="mt-2 truncate text-xs text-white/40">
                      {product.category || "Fragrance"}
                    </p>

                    <p className="mt-3 text-sm text-[#C5A46D]">
                      {formatPrice(product.price, product.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Product pagination"
                className="flex flex-wrap items-center justify-center gap-3 border-t border-white/[0.08] py-8"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 border border-white/10 px-4 py-3 text-xs transition hover:border-[#C5A46D] hover:text-[#C5A46D] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`h-10 min-w-10 border px-3 text-xs transition ${
                      currentPage === page
                        ? "border-[#C5A46D] bg-[#C5A46D] text-[#101010]"
                        : "border-white/10 text-white/60 hover:border-[#C5A46D] hover:text-[#C5A46D]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 border border-white/10 px-4 py-3 text-xs transition hover:border-[#C5A46D] hover:text-[#C5A46D] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}

            <p className="pb-5 text-center text-xs text-white/35">
              Showing {startIndex + 1}–
              {Math.min(
                startIndex + PRODUCTS_PER_PAGE,
                filteredProducts.length
              )}{" "}
              of {filteredProducts.length} products
            </p>
          </>
        )}
      </section>
    </main>
  );
}
