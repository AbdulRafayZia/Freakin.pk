"use client";

import { Button } from "@nextui-org/react";
import { ListFilter, Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const inputVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

export default function SearchBox({ toggleDrawer, showFiltersBtn, handleSubmit }) {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(qParam);
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState([]);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // sync with ?q=
  useEffect(() => { setQuery(qParam); }, [qParam]);

  // load recent searches
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      if (Array.isArray(r)) setRecent(r.slice(0, 6));
    } catch {}
  }, []);

  // global "/" to focus (like many sites)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside closes dropdown
  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const submit = (val) => {
    const term = (val ?? query).trim();
    handleSubmit?.(term);
    if (term) {
      const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
      setRecent(next);
      try { localStorage.setItem("recentSearches", JSON.stringify(next)); } catch {}
    }
    setFocused(false);
  };

  const clear = () => {
    setQuery("");
    handleSubmit?.("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      className="relative w-full max-w-3xl mx-auto"
      ref={wrapRef}
    >
      <motion.div
        variants={inputVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.35 }}
        className="group flex items-center gap-2 rounded-full bg-white border border-zinc-200 pl-4 pr-2 py-2 shadow-sm hover:shadow focus-within:shadow-md focus-within:border-zinc-300"
      >
        <Search size={18} className="text-zinc-500" />

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") handleSubmit?.("");
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              if (query) clear();
              else { setFocused(false); e.currentTarget.blur(); }
            }
          }}
          placeholder="Search products…"
          type="search"
          aria-label="Search products"
          className="w-full bg-transparent outline-none text-sm md:text-base placeholder-zinc-400"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clear}
            className="h-8 w-8 grid place-items-center rounded-full hover:bg-zinc-100 text-zinc-500"
          >
            <X size={16} />
          </button>
        )}

        {/* Filters pill (mobile visible as icon; desktop as pill) */}
        {showFiltersBtn && (
          <button
            type="button"
            onClick={() => toggleDrawer && toggleDrawer()}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-sm"
          >
            <ListFilter size={16} />
            Filters
          </button>
        )}
        {showFiltersBtn && (
          <button
            type="button"
            onClick={() => toggleDrawer && toggleDrawer()}
            className="sm:hidden h-8 w-8 grid place-items-center rounded-full border border-zinc-200 hover:bg-zinc-50"
            aria-label="Open filters"
          >
            <ListFilter size={16} />
          </button>
        )}

        <Button
          type="submit"
          className="rounded-full bg-black text-white text-sm font-medium px-4 py-1.5 h-9"
          radius="full"
        >
          Search
        </Button>
      </motion.div>

      {/* Recent searches dropdown */}
      <AnimatePresence>
        {focused && recent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute z-20 mt-2 w-full rounded-2xl border border-zinc-200 bg-white shadow-lg overflow-hidden"
          >
            <div className="px-3 pt-2 pb-1 text-xs text-zinc-500">Recent searches</div>
            <div className="px-2 pb-2 flex flex-wrap gap-2">
              {recent.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => submit(r)}
                  className="px-3 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-sm"
                  title={r}
                >
                  {r}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setRecent([]); try { localStorage.removeItem("recentSearches"); } catch {} }}
                className="ml-auto text-xs text-zinc-500 hover:underline px-2 py-1"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
