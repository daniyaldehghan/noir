
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Our Story | NOIR",
  description:
    "Discover the philosophy, inspiration, and craftsmanship behind NOIR fragrances.",
};

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[#101010] text-[#f0ebe2]">
      {/* Hero */}
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden border-b border-white/10 px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,164,109,0.12),transparent_60%)]" />

        <div className="relative mx-auto max-w-4xl">
          <p className="mb-8 text-[10px] tracking-[0.4em] text-[#c5a46d]">
            THE WORLD OF NOIR
          </p>

          <h1 className="noir-serif text-6xl leading-[1.05] tracking-[-0.04em] sm:text-8xl lg:text-[120px]">
            Our
            <span className="block italic text-[#c5a46d]">Story.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-white/55 sm:text-base">
            Some things are remembered without a word.
            We believe fragrance is one of them.
          </p>

          <a
            href="#philosophy"
            className="mt-14 inline-flex items-center gap-3 text-[9px] tracking-[0.25em] text-white/50 transition hover:text-[#c5a46d]"
          >
            DISCOVER OUR PHILOSOPHY
            <ArrowDown size={14} />
          </a>
        </div>

        <span className="absolute bottom-7 left-6 text-[9px] tracking-[0.2em] text-white/25">
          NOIR — EST. MMXXIV
        </span>
      </section>

      {/* Philosophy */}
      <section
        id="philosophy"
        className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:gap-20 md:py-36"
      >
        <div>
          <p className="mb-6 text-[10px] tracking-[0.3em] text-[#c5a46d]">
            01 — OUR PHILOSOPHY
          </p>

          <h2 className="noir-serif text-4xl leading-tight sm:text-6xl">
            Less noise.
            <br />
            <span className="italic text-[#c5a46d]">
              More presence.
            </span>
          </h2>
        </div>

        <div className="space-y-6 text-sm leading-8 text-white/55">
          <p>
            At NOIR, we believe fragrance is more than a finishing touch.
            It is a personal expression, an invisible signature, and a memory
            waiting to happen.
          </p>

          <p>
            Our philosophy is built around thoughtful choices, distinctive
            character, and the beauty of simplicity. Every fragrance should
            feel personal, intentional, and unforgettable.
          </p>
        </div>
      </section>

      {/* Brand statement */}
      <section className="border-y border-white/10 bg-[#171514] px-6 py-24 text-center sm:py-36">
        <p className="mb-8 text-[10px] tracking-[0.35em] text-[#c5a46d]">
          THE ART OF SCENT
        </p>

        <h2 className="noir-serif mx-auto max-w-4xl text-4xl leading-tight sm:text-6xl lg:text-7xl">
          Not just what you wear.
          <br />
          <span className="italic text-[#c5a46d]">
            What you leave behind.
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-lg text-sm leading-8 text-white/50">
          A fragrance can transform a moment into a memory.
          It can speak before you do and remain long after you leave.
          That is the feeling we seek to create.
        </p>
      </section>

      {/* Our values */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 sm:py-32">
        <div className="mb-14 text-center">
          <p className="mb-5 text-[10px] tracking-[0.3em] text-[#c5a46d]">
            02 — WHAT DEFINES US
          </p>

          <h2 className="noir-serif text-4xl sm:text-6xl">
            The NOIR principles<span className="text-[#c5a46d]">.</span>
          </h2>
        </div>

        <div className="grid gap-px bg-white/10 sm:grid-cols-3">
          <article className="bg-[#101010] p-8 sm:p-10">
            <span className="noir-serif text-3xl text-[#c5a46d]">01</span>
            <h3 className="noir-serif mt-8 text-2xl">Individuality</h3>
            <p className="mt-4 text-sm leading-7 text-white/50">
              Fragrance should reflect who you are, not simply follow a trend.
            </p>
          </article>

          <article className="bg-[#101010] p-8 sm:p-10">
            <span className="noir-serif text-3xl text-[#c5a46d]">02</span>
            <h3 className="noir-serif mt-8 text-2xl">Intention</h3>
            <p className="mt-4 text-sm leading-7 text-white/50">
              We value thoughtful selections and character over excess.
            </p>
          </article>

          <article className="bg-[#101010] p-8 sm:p-10">
            <span className="noir-serif text-3xl text-[#c5a46d]">03</span>
            <h3 className="noir-serif mt-8 text-2xl">Memories</h3>
            <p className="mt-4 text-sm leading-7 text-white/50">
              The finest scent is the one that becomes part of your story.
            </p>
          </article>
        </div>
      </section>

      {/* Closing */}
      <section className="relative overflow-hidden bg-[#4a101b] px-6 py-24 text-center sm:py-32">
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-7 text-[10px] tracking-[0.35em] text-[#d9bc8a]">
            YOUR STORY STARTS HERE
          </p>

          <h2 className="noir-serif text-5xl leading-tight sm:text-7xl">
            Find your
            <span className="block italic text-[#c5a46d]">
              signature.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/60">
            Explore fragrances chosen to express a different side of you.
          </p>

          <Link
            href="/products"
            className="mt-10 inline-flex items-center gap-5 bg-[#c5a46d] px-7 py-4 text-[10px] tracking-[0.16em] text-[#101010] transition hover:bg-[#e0c79b]"
          >
            EXPLORE THE COLLECTION
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
