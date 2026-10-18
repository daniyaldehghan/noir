"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Play, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=2400&q=90",
    eyebrow: "EXTRAORDINARY BY NATURE",
    firstLine: "Own the",
    secondLine: "unforgettable.",
    description:
      "Discover a world of distinctive fragrances. Crafted for those who leave an impression without saying a word.",
    signature: "SCENT. IDENTITY. LEGACY.",
    sideLabel: "LUXURY IS AN ATTITUDE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=2400&q=90",
    eyebrow: "THE ART OF PERFUMERY",
    firstLine: "Make it",
    secondLine: "personal.",
    description:
      "Find the fragrance that reflects your character, your confidence, and your unmistakable presence.",
    signature: "YOUR SCENT. YOUR STORY.",
    sideLabel: "DEFINED BY YOU",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=2400&q=90",
    eyebrow: "A NEW STANDARD OF LUXURY",
    firstLine: "Leave a",
    secondLine: "legacy.",
    description:
      "Discover captivating compositions designed to turn fleeting moments into lasting memories.",
    signature: "CRAFTED FOR YOUR PRESENCE.",
    sideLabel: "BEYOND THE ORDINARY",
  },
];

export default function CinematicHero() {
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
      className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-[#090909] text-white md:min-h-[780px] lg:min-h-[850px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      <div className="absolute inset-0 -z-20">
        {slides.map((item, index) => (
          <div
            key={item.image}
            aria-hidden={index !== activeSlide}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={item.image}
              alt=""
              fetchPriority={index === 0 ? "high" : "auto"}
              className={`h-full w-full object-cover object-center transition-transform duration-[5000ms] ${
                index === activeSlide ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 -z-10 bg-black/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-transparent to-black/30" />

      {/* Decorative frame */}
      <div className="pointer-events-none absolute inset-5 border border-white/10 md:inset-8" />

      {/* Main content */}
      <div className="mx-auto w-full max-w-[1600px] px-8 py-28 md:px-16 lg:px-24">
        <div key={slide.image} className="max-w-4xl animate-noir-fade-in">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 bg-[#c5a46d]" />
            <span className="text-[10px] tracking-[0.4em] text-[#d8bc8b] sm:text-xs">
              {slide.eyebrow}
            </span>
          </div>

          <h1 className="noir-serif text-6xl font-light uppercase leading-[0.9] tracking-[-0.055em] sm:text-8xl lg:text-[130px]">
            {slide.firstLine}
            <br />
            <span className="mt-3 inline-block italic text-[#c5a46d]">
              {slide.secondLine}
            </span>
          </h1>

          <p className="mt-9 max-w-md text-sm leading-8 text-white/70 sm:text-base">
            {slide.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/product"
              className="group inline-flex min-h-[54px] items-center gap-7 bg-[#c5a46d] px-6 text-[10px] tracking-[0.18em] text-black transition-colors duration-300 hover:bg-[#e0c79b]"
            >
              DISCOVER NOIR
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#story"
              className="group inline-flex items-center gap-3 text-[10px] tracking-[0.18em] text-white/80 transition hover:text-[#c5a46d]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition group-hover:border-[#c5a46d]">
                <Play size={14} className="ml-0.5" />
              </span>
              DISCOVER OUR STORY
            </a>
          </div>
        </div>

        {/* Bottom signature */}
        <div className="mt-20 flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-5">
          <div>
            <p className="text-[9px] tracking-[0.3em] text-white/40">
              THE NOIR PHILOSOPHY
            </p>
            <p className="mt-2 text-xs tracking-[0.12em] text-white/80">
              {slide.signature}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.2em] text-white/50">
              0{activeSlide + 1} / 0{slides.length}
            </span>

            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center border border-white/25 transition hover:border-[#c5a46d] hover:bg-[#c5a46d] hover:text-black"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center border border-white/25 transition hover:border-[#c5a46d] hover:bg-[#c5a46d] hover:text-black"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-8 z-10 flex items-center gap-2 md:left-16 lg:left-24">
        {slides.map((item, index) => (
          <button
            key={item.image}
            type="button"
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
            className={`h-1 transition-all duration-500 ${
              index === activeSlide
                ? "w-12 bg-[#c5a46d]"
                : "w-5 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Side label */}
      <div
        key={slide.sideLabel}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] text-[9px] tracking-[0.4em] text-white/40 xl:block"
      >
        {slide.sideLabel}
      </div>
    </section>
  );
}
