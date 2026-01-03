"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Home, Grid3x3, Sparkles } from "lucide-react";
import { useState } from "react";

// Video extension check
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];
const isVideoUrl = (url = "") => {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
};

export default function CategoriesPageClient({ categories = [] }) {
  const ref = useRef(null);
  const router = useRouter();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  // Organize categories into parent-child structure
  const mainCategories = categories.filter((cat) => !cat.parentId);
  const subCategoriesMap = categories
    .filter((cat) => cat.parentId)
    .reduce((acc, cat) => {
      if (!acc[cat.parentId]) acc[cat.parentId] = [];
      acc[cat.parentId].push(cat);
      return acc;
    }, {});

  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section with Home Button */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-50 to-pink-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-fredoka font-bold text-pink-600 text-shadow-pop"
            >
              All Categories
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/">
                <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-pink-50 text-pink-600 font-quicksand font-bold rounded-full border-2 border-pink-200 hover:border-pink-400 transition-all hover:scale-105 shadow-md">
                  <Home size={20} />
                  <span className="hidden sm:inline">Home</span>
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 font-quicksand"
          >
            Explore our complete collection of amazing categories
          </motion.p>
        </div>
      </div>

      {/* Modern Categories Layout */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {mainCategories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 font-quicksand">
                No categories available at the moment.
              </p>
            </div>
          ) : (
            <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mainCategories.map((mainCat, mainIndex) => {
                const subCats = subCategoriesMap[mainCat.id] || [];

                return (
                  <motion.div
                    key={mainCat.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: mainIndex * 0.1 }}
                    className="group"
                    onMouseEnter={() => subCats.length > 0 && setHoveredCategory(mainCat.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {/* Modern Card Container */}
                    <div className="relative bg-gradient-to-br from-white to-pink-50/30 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-pink-100/50">

                      {/* Main Category Header with Image */}
                      <div
                        className="relative cursor-pointer"
                        onClick={() => window.location.href = `/categories/${mainCat.id}`}
                      >
                        {/* Image Section */}
                        <div className="relative rounded-2xl overflow-hidden h-[220px] md:h-[260px] mb-5">
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

                          {isVideoUrl(mainCat.imageURL) ? (
                            <video
                              src={mainCat.imageURL}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                            />
                          ) : (
                            <img
                              src={mainCat.imageURL}
                              alt={mainCat.name ?? ""}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          )}

                          {/* Category Badge on Image */}
                          <div className="absolute top-4 right-4 z-20">
                            <div className="backdrop-blur-md bg-white/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                              <Sparkles size={16} className="text-pink-500" />
                              <span className="text-xs font-quicksand font-bold text-gray-700">
                                {mainCat.productCount || 0} Products
                              </span>
                            </div>
                          </div>

                          {/* Category Title on Image */}
                          <div className="absolute bottom-4 left-4 right-4 z-20">
                            <h3 className="font-fredoka font-bold text-2xl md:text-3xl text-white drop-shadow-lg">
                              {mainCat.name}
                            </h3>
                          </div>
                        </div>

                        {/* View All Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/categories/${mainCat.id}`);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          View All Products
                        </button>
                      </div>

                      {/* Hover Popup for Subcategories */}
                      <AnimatePresence>
                        {hoveredCategory === mainCat.id && subCats.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 right-0 top-full mt-2 z-50 pointer-events-none"
                            onMouseEnter={() => setHoveredCategory(mainCat.id)}
                          >
                            <div className="bg-white rounded-2xl shadow-2xl border-2 border-pink-200 p-5 pointer-events-auto backdrop-blur-xl">
                              {/* Popup Header */}
                              {/* <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-100">
                                <div className="flex items-center gap-2">
                                  <Grid3x3 size={18} className="text-pink-500" />
                                  <h4 className="font-fredoka font-bold text-lg text-gray-800">
                                    {mainCat.name} Categories
                                  </h4>
                                </div>
                                <span className="text-xs font-quicksand text-gray-500 bg-pink-50 px-3 py-1 rounded-full">
                                  {subCats.length} options
                                </span>
                              </div> */}

                              {/* Quick View All Button */}
                                {/* <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/categories/${mainCat.id}`);
                                    setHoveredCategory(null);
                                  }}
                                  className="w-full mb-3 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                >
                                  View All {mainCat.name}
                                </button> */}

                              {/* Subcategories Grid in Popup */}
                              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {subCats.map((subCat, subIndex) => (
                                  <motion.div
                                    key={subCat.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: subIndex * 0.03 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/categories/${subCat.id}`);
                                      setHoveredCategory(null);
                                    }}
                                    className="group/popup relative cursor-pointer rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                                  >
                                    {/* Mini Image */}
                                    <div className="relative h-[90px] overflow-hidden">
                                      {isVideoUrl(subCat.imageURL) ? (
                                        <video
                                          src={subCat.imageURL}
                                          className="w-full h-full object-cover group-hover/popup:scale-110 transition-transform duration-500"
                                          autoPlay
                                          loop
                                          muted
                                          playsInline
                                          preload="metadata"
                                        />
                                      ) : (
                                        <img
                                          src={subCat.imageURL}
                                          alt={subCat.name ?? ""}
                                          className="w-full h-full object-cover group-hover/popup:scale-110 transition-transform duration-500"
                                        />
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                      {/* Name Overlay on Image */}
                                      <div className="absolute bottom-1.5 left-2 right-2 z-10">
                                        <h5 className="font-fredoka font-bold text-xs text-white drop-shadow-lg line-clamp-2">
                                          {subCat.name}
                                        </h5>
                                      </div>
                                    </div>

                                    {/* Info Bar */}
                                    <div className="px-2 py-1.5 bg-white">
                                      {subCat.productCount !== undefined && (
                                        <div className="flex items-center justify-center gap-1">
                                          <Sparkles size={10} className="text-blue-400" />
                                          <span className="text-[10px] text-gray-600 font-quicksand font-semibold">
                                            {subCat.productCount} {subCat.productCount === 1 ? 'item' : 'items'}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 border-2 border-blue-400 rounded-xl opacity-0 group-hover/popup:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
