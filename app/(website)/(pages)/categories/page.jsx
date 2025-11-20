import { getCategoriesWithCounts } from "@/lib/firestore/categories/read_server";
import CategoriesPageClient from "./CategoriesPageClient";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return <CategoriesPageClient categories={categories} />;
}
