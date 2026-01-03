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
    <div className="p-5">
      {/* Color selection */}
      {colors?.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          <h4 className="font-semibold text-sm text-gray-700">Select Color:</h4>
          <div className="flex gap-4 flex-wrap">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-full cursor-pointer transition-transform duration-300 ${
                  color === selectedColor ? "transform scale-110 border-2 border-gray-800" : "border"
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: color === selectedColor ? "0px 0px 8px rgba(0, 0, 0, 0.15)" : "none",
                }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selection */}
      {sizes?.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          <h4 className="font-semibold text-sm text-gray-700">Select Size:</h4>
          <div className="flex gap-4 flex-wrap">
            {sizes.map((size, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                  size === selectedSize
                    ? "bg-gray-800 text-white border-2 border-gray-800"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-6 items-center">
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

            // Build query string only if color/size is set
            let query = `/checkout?type=buynow&productId=${product?.id}`;
            if (selectedColor) {
              query += `&color=${selectedColor}`;
            }
            if (selectedSize) {
              query += `&size=${selectedSize}`;
            }
            router.push(query);
          }}
          className={`w-full md:w-40 p-4 rounded-lg text-medium transition-colors duration-300 ${
            isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
          }`}
          disabled={isOutOfStock}
        >
          Buy Now
        </button>

        {/* Add to Cart Button */}
    

          <AuthContextProvider>
            <AddToCartButton type={"cute"} productId={product?.id} color={selectedColor} size={selectedSize} outOfStock={isOutOfStock} />
          </AuthContextProvider>
        

        {/* Favorite Button */}
        <AuthContextProvider>
          <FavoriteButton productId={product?.id} />
        </AuthContextProvider>
      </div>

      {/* Out of Stock message */}
      {isOutOfStock && (
        <div className="mt-3 text-center py-3 bg-red-100 text-red-600 rounded-lg">
          <h3 className="text-sm font-semibold">Out Of Stock</h3>
        </div>
      )}
    </div>
  );
}
