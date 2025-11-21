import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import CategoryProductsView from "./CategoryProductsView";

export default async function Page({ params }) {
  const { categoryId } = params;

  // Fetch data in parallel for better performance
  const [category, products] = await Promise.all([
    getCategory({ id: categoryId }),
    getProductsByCategory({ categoryId: categoryId })
  ]);

  return (
    <CategoryProductsView
      title={category?.name}
      products={products}
      categoryName={category?.name}
    />
  );
}
