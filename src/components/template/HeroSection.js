"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpLeft, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85",
    eyebrow: "THE ART OF PERFUMERY",
    title: "Beyond the Ordinary",
    description:
      "Discover exceptional fragrances crafted to turn unforgettable moments into lasting memories.",
    number: "01",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85",
    eyebrow: "DISCOVER YOUR SIGNATURE",
    title: "Define Your Presence",
    description:
      "Find the scent that speaks before you do and lingers long after you leave.",
    number: "02",
  },
  {
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
    eyebrow: "LUXURY IN EVERY DROP",
    title: "Elegance in Every Note",
    description:
      "Experience the perfect balance of sophistication, character, and timeless allure.",
    number: "03",
  },
  {
    image:
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1200&q=85",
    eyebrow: "YOUR NEXT OBSESSION",
    title: "Made to Stand Apart",
    description:
      "For those who appreciate the details and were never meant to blend in.",
    number: "04",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [paused]);

  const slide = slides[activeSlide];

  return (
    <section
      id="fragrances"
      className="relative isolate overflow-hidden bg-[#090909] px-4 py-12 text-white sm:px-8 lg:px-12 lg:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.3em] text-[#c5a46d] sm:text-sm">
              <Sparkles size={15} />
              <span>THE NOIR EXPERIENCE</span>
            </div>

            <h2 className="text-2xl font-light tracking-wide sm:text-4xl lg:text-5xl">
              Exceptional{" "}
              <span className="font-semibold text-[#c5a46d]">Fragrances</span>
            </h2>
          </div>

          <div className="hidden items-center gap-2 text-xs tracking-[0.2em] text-white/50 sm:flex">
            <span>{slide.number}</span>
            <span className="h-px w-10 bg-[#c5a46d]/60" />
            <span>0{slides.length}</span>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-[#111] sm:min-h-[580px] lg:min-h-[620px]">
          {slides.map((item, index) => (
            <div
              key={item.number}
              aria-hidden={index !== activeSlide}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ${
                  index === activeSlide ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

          <div className="pointer-events-none absolute inset-4 rounded-xl border border-[#c5a46d]/25 sm:inset-6" />

          <div
            key={slide.number}
            className="relative z-10 flex min-h-[520px] flex-col justify-center px-8 py-16 sm:min-h-[580px] sm:px-14 lg:min-h-[620px] lg:px-20"
          >
            <div className="animate-noir-fade-in max-w-2xl">
              <p className="mb-5 text-xs tracking-[0.3em] text-[#c5a46d] sm:text-sm">
                {slide.eyebrow}
              </p>

              <h3 className="mb-6 text-3xl font-light leading-tight sm:text-5xl lg:text-6xl">
                {slide.title}
              </h3>

              <p className="mb-9 max-w-lg text-sm leading-8 text-white/70 sm:text-base sm:leading-9">
                {slide.description}
              </p>

              <Link
                href="/product"
                className="group inline-flex items-center gap-4 border border-[#c5a46d]/70 px-6 py-4 text-sm transition-colors duration-300 hover:bg-[#c5a46d] hover:text-black sm:px-8"
              >
                <span>EXPLORE PRODUCTS</span>
                <ArrowUpLeft
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3 sm:bottom-10 sm:right-14 lg:right-20">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 transition hover:border-[#c5a46d] hover:bg-[#c5a46d] hover:text-black"
            >
              <ChevronRight size={20} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 transition hover:border-[#c5a46d] hover:bg-[#c5a46d] hover:text-black"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="absolute bottom-10 left-8 z-20 flex items-center gap-2 sm:left-14 lg:left-20">
            {slides.map((item, index) => (
              <button
                key={item.number}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
                className={`h-1 transition-all duration-500 ${
                  index === activeSlide
                    ? "w-10 bg-[#c5a46d]"
                    : "w-4 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <div className="absolute right-8 top-8 z-10 hidden text-right sm:block lg:right-14 lg:top-12">
            <p className="text-xs tracking-[0.35em] text-white/50">NOIR</p>
            <p className="mt-1 text-[10px] tracking-[0.2em] text-[#c5a46d]">
              LUXURY FRAGRANCES
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-3 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>A scent for every identity. A memory that lasts forever.</p>
          <p className="tracking-[0.2em]">CRAFTED FOR YOUR PRESENCE</p>
        </div>
      </div>
    </section>
  );
}
