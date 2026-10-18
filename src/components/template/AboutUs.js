"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Sparkles,
  Gem,
  Flower2,
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#101010] text-[#f0ebe2]">
      {/* Hero */}
      <section className="relative flex min-h-[75vh] items-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=2000&q=90"
            alt="Luxury perfume collection"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101010] via-[#101010]/75 to-[#101010]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-[#101010]/30" />
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-6 py-24 sm:px-10 lg:px-20">
          <p className="text-[10px] tracking-[0.45em] text-[#c5a46d]">
            THE WORLD OF NOIR
          </p>

          <h1 className="noir-serif mt-8 max-w-3xl text-6xl leading-[1.1] sm:text-8xl lg:text-9xl">
            More than
            <br />
            <span className="italic text-[#c5a46d]">a fragrance.</span>
          </h1>

          <p className="mt-8 max-w-lg text-sm leading-8 text-white/65 sm:text-base">
            Some things are remembered long after they are gone.
            A feeling. A moment. A scent.
            Welcome to NOIR — where fragrance becomes part of your story.
          </p>

          <Link
            href="/products"
            className="mt-10 inline-flex items-center gap-4 border border-[#c5a46d]/70 px-7 py-4 text-[10px] tracking-[0.2em] transition hover:bg-[#c5a46d] hover:text-[#101010]"
          >
            EXPLORE OUR COLLECTION
            <ArrowRight size={15} />
          </Link>

          <div className="mt-20 flex items-center gap-3 text-[9px] tracking-[0.25em] text-white/40">
            <ArrowDown size={14} className="text-[#c5a46d]" />
            DISCOVER OUR STORY
          </div>
        </div>
      </section>

      {/* Brand introduction */}
      <section className="mx-auto grid max-w-[1440px] gap-12 px-6 py-24 sm:px-10 lg:grid-cols-2 lg:gap-24 lg:px-20 lg:py-36">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-[#c5a46d]">
            OUR STORY
          </p>

          <h2 className="noir-serif mt-7 text-5xl leading-tight sm:text-6xl">
            A signature is
            <br />
            <span className="italic text-[#c5a46d]">never ordinary.</span>
          </h2>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm leading-8 text-white/65 sm:text-base">
            At NOIR, we believe fragrance is more than something you wear.
            It is an expression of individuality, a quiet statement of
            confidence, and an invisible detail that makes every moment
            unforgettable.
          </p>

          <p className="mt-6 text-sm leading-8 text-white/50 sm:text-base">
            Our world is built around character, atmosphere, and the
            beauty of the unexpected. We bring together distinctive
            fragrances for those who choose their own path and leave
            their own impression.
          </p>

          <div className="mt-10 h-px w-20 bg-[#c5a46d]" />
          <p className="noir-serif mt-5 text-2xl italic text-[#c5a46d]">
            Wear your identity.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-y border-white/10 bg-[#151515]">
        <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-20 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] tracking-[0.35em] text-[#c5a46d]">
              WHAT DEFINES US
            </p>

            <h2 className="noir-serif mt-6 text-4xl sm:text-6xl">
              The NOIR Philosophy
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/50">
              Three principles behind the experience we want to create.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Sparkles,
                title: "Individuality",
                description:
                  "Your fragrance should feel like you. Explore scents that express your character, your mood, and your own sense of style.",
              },
              {
                number: "02",
                icon: Gem,
                title: "Timeless Elegance",
                description:
                  "We are drawn to thoughtful details, distinctive character, and an aesthetic that remains beautiful beyond passing trends.",
              },
              {
                number: "03",
                icon: Flower2,
                title: "The Art of Scent",
                description:
                  "From the first impression to the final lingering notes, every fragrance offers an opportunity to discover something new.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.number}
                  className="group border border-white/10 p-8 transition duration-300 hover:border-[#c5a46d]/60 sm:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-[0.2em] text-[#c5a46d]">
                      {item.number}
                    </span>
                    <Icon
                      size={23}
                      strokeWidth={1.2}
                      className="text-[#c5a46d] transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <h3 className="noir-serif mt-10 text-3xl">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-white/50">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual statement */}
      <section className="relative overflow-hidden">
        <div className="grid min-h-[560px] lg:grid-cols-2">
          <div className="relative min-h-[360px]">
            <img
              src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=85"
              alt="Perfume and fragrance details"
              className="absolute inset-0 h-full w-full object-cover opacity-75"
              loading="lazy"
            />
          </div>

          <div className="flex items-center bg-[#191817] px-8 py-16 sm:px-14 lg:px-20">
            <div className="max-w-xl">
              <p className="text-[10px] tracking-[0.35em] text-[#c5a46d]">
                YOUR STORY, YOUR SCENT
              </p>

              <h2 className="noir-serif mt-7 text-5xl leading-tight sm:text-6xl">
                Leave a little
                <br />
                <span className="italic text-[#c5a46d]">
                  mystery behind.
                </span>
              </h2>

              <p className="mt-7 text-sm leading-8 text-white/55">
                The right scent does not need to speak loudly.
                It simply stays with you — and with the people
                who remember you.
              </p>

              <Link
                href="/products"
                className="mt-9 inline-flex items-center gap-3 text-[10px] tracking-[0.2em] text-[#c5a46d] transition hover:text-white"
              >
                FIND YOUR SIGNATURE SCENT
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-white/10 px-6 py-24 text-center sm:py-32">
        <p className="text-[10px] tracking-[0.4em] text-[#c5a46d]">
          DISCOVER NOIR
        </p>

        <h2 className="noir-serif mt-7 text-5xl sm:text-7xl">
          Find your <span className="italic text-[#c5a46d]">essence.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/50">
          Explore our fragrance collection and discover a scent
          that feels unmistakably yours.
        </p>

        <Link
          href="/products"
          className="mt-9 inline-flex items-center gap-4 bg-[#c5a46d] px-8 py-5 text-[10px] tracking-[0.2em] text-[#101010] transition hover:bg-[#e0c79b]"
        >
          SHOP ALL FRAGRANCES
          <ArrowRight size={15} />
        </Link>
      </section>
    </main>
  );
}
