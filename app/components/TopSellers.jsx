"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ProductCard } from "./Products"; // Assuming Products export is named this

export default function ProductRail({ title = "Best Sellers", products = [] }) {
  const wrapRef = useRef(null);
  const headingRef = useRef(null);
  const inView = useInView(headingRef, { once: true, margin: "-10% 0px" });

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = wrapRef.current;
    if (!el) return;

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateArrows]);



  const scrollByCards = (dir = 1) => {
    const el = wrapRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const gap = parseFloat(getComputedStyle(el).columnGap || 0) || 16;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-12 md:py-20 border-t border-pink-100">
      <div className="max-w-[1500px] mx-auto px-4 md:px-10">
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-center mb-10 text-3xl md:text-4xl font-fredoka font-bold text-pink-500 text-shadow-pop"
        >
          {title}
        </motion.h2>

        <div className="relative">
          {/* edge masks - hide on small screens */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent hidden sm:block z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent hidden sm:block z-10" />

          {/* rail */}
          <div
            ref={wrapRef}
            tabIndex={0}
            onKeyDown={(e) => {
              if (window.innerWidth >= 640) {
                if (e.key === "ArrowRight") scrollByCards(1);
                if (e.key === "ArrowLeft") scrollByCards(-1);
              }
            }}
            className={`
              flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory
              focus:outline-none focus:ring-2 focus:ring-pink-200
              [scrollbar-width:none] [-ms-overflow-style:none]
              hidebar py-4 px-2
            `}
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`.hidebar::-webkit-scrollbar{display:none}`}</style>

            {products.map((p, i) => (
              <motion.div
                key={p.id ?? i}
                data-card
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="snap-start shrink-0"
              >
                <div className="rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                  <ProductCard
                    product={p}
                    fromSlider
                    className="w-[82vw] xs:w-[70vw] sm:w-[48vw] md:w-[36vw] lg:w-[28vw] xl:w-[22vw] max-w-[360px] shadow-md border-2 border-pink-50"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* arrows */}
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards(-1)}
            className={`absolute left-0 top-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-100 bg-white text-pink-500 shadow-lg transition z-20 hover:bg-pink-50 ${canLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <svg className="sm:block hidden" width={20} height={20}><polyline points="12 4 6 9 12 14" fill="none" stroke="currentColor" strokeWidth="3" /></svg>
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards(1)}
            className={`absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-100 bg-white text-pink-500 shadow-lg transition z-20 hover:bg-pink-50 ${canRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <svg className="sm:block hidden" width={20} height={20}><polyline points="6 4 12 9 6 14" fill="none" stroke="currentColor" strokeWidth="3" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}