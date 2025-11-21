"use client";

import ProductsGridView from "@/app/components/Products";
import { useRouter } from "next/navigation";

export default function CategoryProductsView({ title, products, categoryName }) {
  const router = useRouter();

  const handleSearch = (query) => {
    if (categoryName) {
      router.push(`/search?q=${query}&category=${categoryName}`);
    } else {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <ProductsGridView
      title={title}
      products={products}
      handleSearch={handleSearch}
    />
  );
}
