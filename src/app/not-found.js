import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#101010] px-6 py-20 text-[#f0ebe2]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="noir-serif select-none text-[15rem] font-light leading-none text-white/[0.025] sm:text-[24rem]">
          NOIR
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="text-[10px] tracking-[0.5em] text-[#c5a46d]">
          NOIR — THE ART OF FRAGRANCE
        </p>

        <h1 className="noir-serif mt-8 text-[8rem] font-light leading-none tracking-tight text-[#c5a46d] sm:text-[12rem]">
          404
        </h1>

        <div className="mx-auto mt-6 h-px w-20 bg-[#c5a46d]/70" />

        <h2 className="noir-serif mt-8 text-3xl sm:text-5xl">
          Lost in the unknown.
        </h2>

        <p className="mx-auto mt-5 max-w-md text-sm leading-8 text-white/50">
          The page you're looking for seems to have disappeared into
          the unknown. Perhaps your next signature scent is waiting
          somewhere else.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#c5a46d] px-8 text-[10px] tracking-[0.2em] text-[#101010] transition hover:bg-[#e0c79b] sm:w-auto"
          >
            <ArrowLeft size={15} />
            BACK TO HOME
          </Link>

          <Link
            href="/products"
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 border border-white/20 px-8 text-[10px] tracking-[0.2em] transition hover:border-[#c5a46d] hover:text-[#c5a46d] sm:w-auto"
          >
            <Search size={15} />
            EXPLORE FRAGRANCES
          </Link>
        </div>

        <p className="mt-16 text-[9px] tracking-[0.4em] text-white/25">
          NOIR · DISCOVER YOUR ESSENCE
        </p>
      </div>
    </main>
  );
}
