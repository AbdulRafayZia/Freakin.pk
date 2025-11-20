"use client";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";

// Video extension check
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];
const isVideoUrl = (url = "") => {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
};

export default function Categories({ categories = [] }) {
  if (!categories.length) return null;
  const ref = useRef(null);
  const router = useRouter();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="w-full bg-[#fff5f9] py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-3xl md:text-4xl font-fredoka font-bold text-center mb-10 text-pink-500 text-shadow-pop"
        >
          Explore More Collections
        </motion.h2>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {categories.slice(0, 6).map((c, i) => (
              <motion.div
                key={c.id ?? i}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="relative rounded-3xl overflow-hidden bg-white border-4 border-pink-100 shadow-lg hover:shadow-xl hover:border-pink-300 transition-all duration-300 group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/categories/${c.id}`);
                }}
              >
                <div className="overflow-hidden h-[220px] md:h-[280px]">
                    {isVideoUrl(c.imageURL) ? (
                    <video
                        src={c.imageURL}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                    />
                    ) : (
                    <img
                        src={c.imageURL}
                        alt={c.name ?? ""}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    )}
                </div>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur-sm px-4 py-3 text-center rounded-2xl shadow-sm">
                  <div className="font-fredoka font-bold text-lg text-gray-800 group-hover:text-pink-600 transition-colors">{c.name}</div>
                </div>
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}