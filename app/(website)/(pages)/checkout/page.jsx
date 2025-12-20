"use client";

import { useState, useEffect, useLayoutEffect, Suspense } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useLocalCart } from "@/app/hooks/useLocalCart";
import Checkout from "./components/Checkout";

function CheckoutContent() {
  const auth = useAuth();
  const user = auth?.user;
  const { data: userData, isLoading: isUserLoading } = useUser({ uid: user?.uid });
  const { cart } = useLocalCart();

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  const [loading, setLoading] = useState(true);

  const productIdsList = type === "buynow"
    ? [productId]
    : user ? userData?.carts?.map((item) => item?.id) : cart.map(item => item.id);

  const {
    data: products,
    error,
    isLoading: isProductsLoading,
  } = useProductsByIds({
    idsList: productIdsList,
  });

  useLayoutEffect(() => {
    if (!user) setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) setLoading(isUserLoading || isProductsLoading);
  }, [isUserLoading, isProductsLoading, user]);

  if (loading) {
    return <div><CircularProgress /></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productIdsList || productIdsList.length === 0) {
    return <div><h1>Products Not Found</h1></div>;
  }

  // Prevent TypeError: Cannot read properties of undefined (reading '0')
  // If products is not loaded or empty, show not found
  if (!products || (Array.isArray(products) && products.length === 0)) {
    return <div><h1>Products Not Found</h1></div>;
  }

  let productList;
  if (type === "buynow") {
    let orderDetails = {};
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      try {
        orderDetails = JSON.parse(localStorage.getItem("orderDetails")) || {};
      } catch (e) {
        orderDetails = {};
      }
    }

    // Defensive: products[0] must exist
    if (!products[0]) {
      return <div><h1>Product Not Found</h1></div>;
    }

    productList = [
      {
        id: productId,
        quantity: 1,
        product: products[0],
        ...(orderDetails.productId === productId
          ? {
              color: orderDetails.selectedColor,
              size: orderDetails.selectedSize,
            }
          : {}),
      },
    ];
  } else {
    // Defensive: products must be an array
    if (!Array.isArray(products)) {
      return <div><h1>Products Not Found</h1></div>;
    }
    productList = (user ? userData?.carts : cart)?.map((item) => ({
      ...item,
      product: products?.find((e) => e?.id === item?.id),
    }));
  }

  return (
    <main className="p-5 flex flex-col gap-4">
      <h1 className="text-xl">Checkout</h1>
      <Checkout productList={productList} />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div><CircularProgress /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}