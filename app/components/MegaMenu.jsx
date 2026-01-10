"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCategories } from "@/lib/firestore/categories/read";
import { motion, AnimatePresence } from "framer-motion";

export default function MegaMenu() {
    const pathname = usePathname();
    const { data: categories } = useCategories();
    const [hoveredCategory, setHoveredCategory] = useState(null);

    if (!categories) return null;

    // Filter root categories (where parentId is null or empty)
    const rootCategories = categories.filter((c) => !c.parentId);

    // Helper to get children of a category
    const getChildren = (parentId) => {
        return categories.filter((c) => c.parentId === parentId);
    };

    return (
        <div className="hidden md:flex items-center justify-center gap-2 w-full px-4 relative z-40">
            {/* Dynamic Categories */}
            {rootCategories.map((category) => {
                const isActive = pathname === `/categories/${category.id}`;
                const children = getChildren(category.id);
                const hasChildren = children.length > 0;
                const isHovered = hoveredCategory === category.id;

                return (
                    <div
                        key={category.id}
                        className="relative group px-4 py-3"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        {/* Accessibilty Link */}
                        <Link href={`/categories/${category.id}`} className="relative z-10 block">
                            <span
                                className={[
                                    "text-lg font-semibold transition-colors font-fredoka uppercase whitespace-nowrap tracking-wide",
                                    isActive ? "text-pink-600" : "text-gray-800",
                                    isHovered && !isActive ? "text-pink-500" : ""
                                ].join(" ")}
                            >
                                {category.name}
                            </span>
                        </Link>

                        {/* Sliding Hover Highlight - Background Pill */}
                        {isHovered && (
                            <motion.div
                                layoutId="nav-pill"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                className="absolute inset-0 bg-pink-50 rounded-full -z-0"
                            />
                        )}

                        {/* Active Underline Dot (Persistent) */}
                        {isActive && (
                            <motion.span
                                layoutId="nav-dot"
                                className="pointer-events-none absolute left-1/2 bottom-1 h-1.5 w-1.5 rounded-full bg-pink-500 transform -translate-x-1/2 z-20"
                            />
                        )}

                        {/* Mega Menu / Dropdown */}
                        <AnimatePresence>
                            {hasChildren && isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-max min-w-[200px]"
                                >
                                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 p-3 flex flex-col gap-1 overflow-hidden">
                                        {children.map((child, index) => (
                                            <motion.div
                                                key={child.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Link
                                                    href={`/categories/${child.id}`}
                                                    className="block text-center text-sm font-quicksand font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50 px-6 py-2.5 rounded-xl transition-all"
                                                >
                                                    {child.name}
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
