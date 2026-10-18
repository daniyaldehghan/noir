"use client";

import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  X,
  CircleUserRound,
  LogOut,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useWishlist } from "../module/WishlistProvider";
import { useCart } from "../module/CartProvider";
import { useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { wishlistCount } = useWishlist();
  const { totalItems } = useCart();
  const cartCount = totalItems;
  const searchRef = useRef(null);

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const response = await fetch(
          `/api/products?search=${encodeURIComponent(query)}`,
          { cache: "no-store" }
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();

        if (!cancelled) {
          setSearchResults(
            (data.products || [])
              .filter((product) => product.isActive !== false)
              .slice(0, 6)
          );
        }
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.querySelector("input")?.focus();
    }
  }, [searchOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  const navLinks = [
    { href: "/product", label: "PRODUCTS" },
    { href: "/our-story", label: "OUR STORY" },
    { href: "/about-us", label: "ABOUT US" },
    { href: "/#product-reviews", label: "COMMENTS" },
  ];

  return (
    <div className="relative z-40">
      {/* Announcement bar */}
      <div className="flex min-h-8 items-center justify-center bg-[#4a101b] px-3 py-2 text-center text-[8px] tracking-[0.12em] text-[#f0ebe2] sm:text-[10px] sm:tracking-[0.2em]">
        COMPLIMENTARY SHIPPING ON ORDERS OVER $150
      </div>

      <header className="relative border-b border-white/10 bg-[#101010]">
        <nav
          className="mx-auto grid h-[68px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:h-[76px] sm:px-6 lg:px-10 xl:px-14"
          aria-label="Main navigation"
        >
          {/* Left side: mobile menu / desktop links */}
          <div className="flex min-w-0 items-center justify-start">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex min-h-10 items-center justify-center gap-2 text-[10px] tracking-wider text-white/75 transition hover:text-[#c5a46d] lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="hidden xs:inline">MENU</span>
            </button>

            <div className="hidden  items-center gap-3 whitespace-nowrap  text-[10px] tracking-[0.1em] text-white/65 lg:flex xl:gap-6 xl:texst-[10px] xl:trackisng-[0.13em]">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-4 transition  hover:text-[#c5a46d]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center logo */}
          <Link
            href="/"
            className="noir-serif justify-self-center text-[25px] tracking-[0.16em] text-white sm:text-[32px] sm:tracking-[0.24em]"
            aria-label="NOIR home"
          >
            NOIR<span className="text-[#c5a46d]">.</span>
          </Link>

          {/* Right actions */}
          <div className="flex min-w-0 items-center justify-center max-lg:gap-1 gap-3 text-white/75 sm:gap-4 lg:gap-5">
            <Link
              href="/wishlist"
              className="relative inline-flex h-10 w-8 shrink-0 items-center justify-center transition hover:text-[#c5a46d]"
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart
                size={20}
                strokeWidth={1.4}
                className={
                  wishlistCount > 0 ? "fill-[#c5a46d] text-[#c5a46d]" : ""
                }
              />

              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 -translate-y-0.5 translate-x-0.5 items-center justify-center rounded-full bg-[#c5a46d] px-1 text-[9px] font-semibold leading-none text-black">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => {
                setSearchOpen((open) => !open);
                setMenuOpen(false);
              }}
              className="inline-flex h-10 w-8 shrink-0 items-center justify-center transition hover:text-[#c5a46d]"
              aria-label={searchOpen ? "Close search" : "Search products"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? (
                <X size={20} strokeWidth={1.4} />
              ) : (
                <Search size={20} strokeWidth={1.4} />
              )}
            </button>

            <Link
              href="/cart"
              className="relative inline-flex h-10 w-8 shrink-0 items-center justify-center transition hover:text-[#c5a46d]"
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <ShoppingBag size={20} strokeWidth={1.4} />

              <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] -translate-y-0.5 translate-x-0.5 items-center justify-center rounded-full bg-[#c5a46d] px-1 text-[9px] font-semibold leading-none text-black ring-2 ring-[#101010]">
                {cartCount}
              </span>
            </Link>

            <div className="hidden items-center gap-4 lg:flex">
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="text-[10px] tracking-widest text-[#c5a46d] transition hover:text-white"
                >
                  ADMIN
                </Link>
              ) : null}
            </div>
            <div className="hiddsen items-center gap-4 lg:flex">
              {session ? (
                <Link
                  href="/dashboard"
                  className="  tracking-widest text-[#c5a46d] transition hover:text-white"
                >
                  <CircleUserRound size={21} strokeWidth={1.4} />
                  <p></p>
                </Link>
              ) : (
                <div className="text-xs ">
                  <Link
                    href="/login"
                    className="inline-flex lg:h-10 h-8 items-center justify-center gap-2 border border-[#c5a46d]/40 lg:px-3 px-1 text-[10px] font-medium tracking-[0.15em] text-[#c5a46d] transition-all duration-300 hover:border-[#c5a46d] hover:bg-[#c5a46d] hover:text-[#101010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a46d]/60 sm:px-4"
                  >
                    <span className="hidden md:inline">LOGIN / SIGN UP</span>
                    <span className="hidden max-md:inline ">LOGIN</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="absolute left-0 top-full z-50 w-full border-b border-white/10 bg-[#101010] shadow-2xl lg:hidden"
          >
            <div className="mx-auto max-w-[600px] px-5 py-3 sm:px-7">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex min-h-12 items-center justify-between border-b border-white/[0.07] py-3 text-xs tracking-[0.15em] text-white/75 transition last:border-0 hover:text-[#c5a46d]"
                >
                  {item.label}
                  <span className="text-[#c5a46d]">↗</span>
                </Link>
              ))}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/10 pt-4">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="text-[10px] tracking-widest text-[#c5a46d] transition hover:text-white"
                  >
                    ADMIN
                  </Link>
                ) : null}
                {/* <div className="text-xs text-white/75">
                  <LogoutButton />
                </div> */}
              </div>
            </div>
          </div>
        )}

        {/* Search panel */}
        {searchOpen && (
          <div
            ref={searchRef}
            className="absolute left-0 top-full z-50 w-full border-b border-white/10 bg-[#101010] shadow-2xl"
          >
            <div className="mx-auto max-w-[900px] px-4 py-5 sm:px-6 md:px-10">
              <div className="flex min-w-0 items-center gap-3 border-b border-white/20 pb-3">
                <Search size={18} className="shrink-0 text-[#c5a46d]" />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search fragrances..."
                  aria-label="Search fragrances"
                  className="w-full min-w-0 bg-transparent py-2 text-sm text-[#f0ebe2] outline-none placeholder:text-white/35"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="shrink-0 text-white/50 hover:text-[#c5a46d]"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              {searchQuery.trim() && (
                <div className="mt-3 max-h-[min(360px,60vh)] overflow-y-auto">
                  {searchLoading ? (
                    <p className="py-6 text-center text-xs text-white/50">
                      Searching fragrances...
                    </p>
                  ) : searchResults.length === 0 ? (
                    <p className="py-6 text-center text-xs text-white/50">
                      No fragrances found.
                    </p>
                  ) : (
                    searchResults.map((product) => (
                      <Link
                        key={product._id || product.id || product.slug}
                        href={`/product/${product.slug}`}
                        onClick={closeSearch}
                        className="flex min-w-0 items-center gap-3 border-b border-white/5 px-2 py-3 transition hover:bg-white/5 sm:gap-4"
                      >
                        <div className="h-14 w-12 shrink-0 overflow-hidden bg-[#242222] sm:h-16 sm:w-14">
                          {product.image || product.images?.[0] ? (
                            <img
                              src={product.image || product.images?.[0]}
                              alt={product.name || "Fragrance"}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-[#f0ebe2]">
                            {product.name}
                          </p>
                          <p className="mt-1 truncate text-[10px] text-white/40">
                            {product.category}
                          </p>
                        </div>

                        <p className="shrink-0 text-xs text-[#c5a46d]">
                          {product.currency === "USD" ? "$" : ""}
                          {product.price}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default Header;
