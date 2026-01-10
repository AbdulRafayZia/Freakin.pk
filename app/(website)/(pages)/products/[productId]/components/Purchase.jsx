"use client";

import AddToCartButton from "@/app/components/AddToCartButton";
import FavoriteButton from "@/app/components/FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Purchase({ product }) {
  const router = useRouter();

  // State to manage selected color and size
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");

  // Memoize color options based on selected size
  const colors = useMemo(() => {
    return product?.colors?.length > 0
      ? product?.colors
      : [];
  }, [product]);

  // Memoize size options based on selected color
  const sizes = useMemo(() => {
    return product?.sizes?.length > 0
      ? product?.sizes
      : [];
  }, [product]);

  useEffect(() => {
    console.log({ product, selectedColor, selectedSize, colors, sizes });
  }, [product, selectedColor, selectedSize, colors, sizes]);

  // Handle adding to cart or proceeding to checkout
  const handleAddToCart = () => {
    const orderDetails = {
      productId: product?.id,
      selectedColor,
      selectedSize,
      quantity: 1,
    };
    router.push(`/checkout?type=addtocart&color=${selectedColor}&productId=${product?.id}&size=${selectedSize}`);
  };

  // Check if the product is out of stock
  const isOutOfStock = product?.stock <= (product?.orders ?? 0);

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Color selection */}
      {colors?.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-gray-800">Select Color:</h4>
          <div className="flex gap-3 flex-wrap">
            {colors.map((color, index) => (
              <button
                key={index}
                type="button"
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${color === selectedColor
                  ? "border-pink-500 ring-2 ring-pink-200 scale-110"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selection */}
      {sizes?.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-gray-800">Select Size:</h4>
          <div className="flex gap-3 flex-wrap">
            {sizes.map((size, index) => (
              <button
                key={index}
                type="button"
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${size === selectedSize
                  ? "bg-black text-white border-black shadow-md transform -translate-y-0.5"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 items-center w-full mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const orderDetails = {
              productId: product?.id,
              selectedColor,
              selectedSize,
              quantity: 1,
            };
            localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

            let query = `/checkout?type=buynow&productId=${product?.id}`;
            if (selectedColor) query += `&color=${selectedColor}`;
            if (selectedSize) query += `&size=${selectedSize}`;
            router.push(query);
          }}
          className={`flex-1 py-3.5 px-6 rounded-full text-lg font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-pink-500 to-violet-600 text-white hover:shadow-pink-500/30"
            }`}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Out of Stock" : "Buy Now"}
        </button>

        <div className="flex-1">
          <AuthContextProvider>
            <AddToCartButton
              type={"large"}
              productId={product?.id}
              color={selectedColor}
              size={selectedSize}
              outOfStock={isOutOfStock}
            />
          </AuthContextProvider>
        </div>

        <div>
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </div>

      {/* Out of Stock message */}
      {isOutOfStock && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center font-medium">
          Currently unavailable. Please check back later.
        </div>
      )}
    </div>
  );
}
