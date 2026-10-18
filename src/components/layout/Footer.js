"use client";
import React from "react";

function Footer() {
  return (
    <div>
      {" "}
      <footer className="px-6 pb-8 pt-16 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1440px] gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <a href="#home" className="noir-serif text-4xl tracking-[0.2em]">
              NOIR<span className="text-[#c5a46d]">.</span>
            </a>
            <p className="mt-5 max-w-[280px] text-xs leading-6 text-white/45">
              The art of scent. A signature that stays with you.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[9px] tracking-[0.2em] text-[#c5a46d]">
              EXPLORE
            </p>
            <div className="flex flex-col gap-4 text-xs text-white/55">
              <a className="hover:text-white" href="/product">
                PRODUCTS
              </a>
              <a className="hover:text-white" href="/our-story">
                Our Story
              </a>
              <a className="hover:text-white" href="/about-us">
                ABOUT US
              </a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[9px] tracking-[0.2em] text-[#c5a46d]">
              THE NOIR JOURNAL
            </p>
            <p className="text-xs leading-6 text-white/45">
              Notes on fragrance, craftsmanship and the art of living well.
            </p>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 pt-7 text-[9px] tracking-[0.1em] text-white/35">
          <span>© 2026 NOIR FRAGRANCE HOUSE</span>
          <span>CRAFTED WITH INTENTION.</span>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
