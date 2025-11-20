"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/* ---------- media helpers ---------- */
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];
const isVideoUrl = (url = "") => {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
};
const resolveMedia = (product) => {
  if (product?.media?.url && product?.media?.type) {
    return {
      url: product.media.url,
      type: product.media.type,
      posterUrl: product.media.posterUrl,
    };
  }
  const url = product?.featureImageURL || product?.imageUrl || "";
  return { url, type: isVideoUrl(url) ? "video" : "image", posterUrl: product?.featurePosterURL };
};

/* ---------- Animation Variants ---------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 }
  },
};

export default function FeaturedProductSlider({ featuredProducts = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef({}); 

  // Auto-rotate slides
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  // Handle Video Playback
  useEffect(() => {
    featuredProducts.forEach((p, i) => {
      const v = videoRefs.current[p.id];
      if (!v) return;
      if (i === activeIndex) {
        v.currentTime = 0;
        v.play?.().catch(() => {});
      } else {
        v.pause?.();
      }
    });
  }, [activeIndex, featuredProducts]);

  if (!featuredProducts.length) return null;

  return (
    <section className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden bg-black">
      {featuredProducts.map((product, index) => {
        const media = resolveMedia(product);
        const isActive = index === activeIndex;

        return (
          <div
            key={product.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* 1. BACKGROUND MEDIA */}
            <div className="absolute inset-0 z-0">
              {media.type === "video" ? (
                <video
                  ref={(el) => (videoRefs.current[product.id] = el)}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={media.url}
                  poster={media.posterUrl}
                  playsInline
                  muted
                  loop
                  preload="metadata"
                />
              ) : (
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  src={media.url}
                  alt={product?.title || ""}
                />
              )}
            </div>

            {/* 2. MODERN GRADIENT OVERLAY (Pink/Purple Tint) */}
            {/* This ensures text pop without a white box */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-purple-900/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/20 z-10" /> 

            {/* 3. CONTENT LAYER */}
            <div className="relative z-20 h-full w-full flex items-end md:items-center justify-center md:justify-start px-6 md:px-16 pb-20 md:pb-0">
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    key={`content-${product.id}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="max-w-2xl w-full text-center md:text-left"
                  >
                    {/* Tag / Kicker */}
                    <motion.div variants={itemVariants} className="mb-4">
                        <span className="inline-block px-4 py-1 rounded-full border border-pink-300/50 bg-pink-500/20 backdrop-blur-md text-pink-100 text-sm font-bold tracking-widest uppercase font-quicksand">
                            New Collection
                        </span>
                    </motion.div>

                    {/* Title - Fredoka but Clean */}
                    <motion.div variants={itemVariants}>
                      <h1 className="font-fredoka font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-tight drop-shadow-lg">
                        {product?.title}
                      </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={itemVariants} className="mt-6 mb-10">
                      <p className="font-quicksand font-medium text-lg md:text-xl text-pink-50/90 leading-relaxed max-w-lg mx-auto md:mx-0">
                        {product?.shortDescription}
                      </p>
                    </motion.div>

                    {/* Modern Button */}
                    <motion.div 
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                      <a href={`/products/${product?.id}`}>
                        <button className="group relative overflow-hidden bg-white text-pink-600 px-8 py-4 rounded-2xl font-fredoka font-bold text-lg shadow-xl transition-all hover:shadow-pink-500/30 hover:bg-pink-50">
                          <span className="relative z-10 flex items-center gap-3">
                            Shop Now 
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </button>
                      </a>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center md:justify-start md:left-16 md:right-auto gap-3">
        {featuredProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === activeIndex 
                ? "bg-pink-500 w-8 shadow-[0_0_10px_#ec4899]" 
                : "bg-white/30 w-2 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}