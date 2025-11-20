"use client"
import { Suspense } from "react";
import FiltersSidebar from "@/app/components/FiltersSidebar";
import ProductsGridView from "@/app/components/Products";
import { searchAndFilterProducts } from "@/lib/firestore/products/read_server";
import { Drawer } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CircularProgress } from "@nextui-org/react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          params[key].push(value);
        } else {
          params[key] = [params[key], value];
        }
      } else {
        params[key] = value;
      }
    });
    return params;
  }, [searchParams]);

  const [products, setProducts] = useState([]);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    async function fetchProducts(params) {
      const products = await searchAndFilterProducts(params);
      setProducts(products);
    }
    fetchProducts(params);
  }, [params]);

  const handleSearch = useCallback((query) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('q', query);
    router.push(`/search?${currentParams.toString()}`);
  }, [searchParams, router]);

  function toggleDrawer() {
    setDrawer(state => !state);
  }

  return (
    <main className="flex relative min-h-[calc(100vh-100px)]">
      <Drawer anchor={"bottom"} open={drawer} onClose={toggleDrawer}>
        <FiltersSidebar position="bottom" />
      </Drawer>
      <div className="hidden sm:block">
        <FiltersSidebar position="left" />
      </div>
      <div className="flex-1">
        <ProductsGridView
          toggleDrawer={toggleDrawer}
          showFiltersBtn={true}
          products={products}
          handleSearch={handleSearch}
        />
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-5"><CircularProgress /></div>}>
      <SearchContent />
    </Suspense>
  );
}