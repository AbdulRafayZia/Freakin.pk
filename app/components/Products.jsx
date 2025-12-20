"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import MyRating from "./MyRating";
import { useRouter } from "next/navigation";
import SearchBox from "./SearchBox";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];
const isVideoUrl = (url = "") => {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
};
const resolveMedia = (product, imageUrl) => {
  if (product?.media?.url && product?.media?.type) {
    return {
      url: product.media.url,
      type: product.media.type,
      posterUrl: product.media.posterUrl,
    };
  }
  const url = imageUrl || product?.featureImageURL || product?.imageUrl || "";
  return {
    url,
    type: isVideoUrl(url) ? "video" : "image",
    posterUrl: product?.featurePosterURL,
  };
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductsGridView({
  title,
  toggleDrawer,
  showFiltersBtn = false,
  showSearchBar = true,
  handleSearch,
  products,
}) {
  const router = useRouter();

  return (
    <section className="w-full flex justify-center bg-[#fff5f9] py-10">
      <div className="flex flex-col gap-8 max-w-[1500px] p-5 w-full">
        {title && (
          <motion.h1
            className="text-center mb-4 text-3xl md:text-4xl font-fredoka font-bold text-pink-500 text-shadow-pop"
            variants={headingVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
        )}

        {showSearchBar && (
          <div className="max-w-xl mx-auto w-full mb-4">
            <SearchBox
                toggleDrawer={toggleDrawer}
                showFiltersBtn={showFiltersBtn}
                handleSubmit={(query) => {
                if (handleSearch) {
                    handleSearch(query);
                } else {
                    router.push(`/search?q=${query}`);
                    router.refresh();
                }
                }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-[20px] justify-center">
          {products?.map?.((item) => (
            <ProductCard
              product={item}
              key={item?.id}
              className="w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] xl:w-[calc(25%-15px)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product, className, fromSlider }) {
  const router = useRouter();
  const [currentMedia, setCurrentMedia] = useState(() =>
    resolveMedia(product, product.featureImageURL)
  );
  const colorways = (product.imageList ?? []).slice(0, 3);
  const sizes = product.sizes ?? product.availableSizes ?? [];

  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");

  const colors = useMemo(() => {
    return product?.colors?.length > 0 ? product?.colors : [];
  }, [product]);

  const selectableSizes = useMemo(() => {
    return product?.sizes?.length > 0 ? product?.sizes : sizes;
  }, [product, sizes]);

  const isOutOfStock = (product?.stock ?? 0) <= (product?.orders ?? 0);

  useEffect(() => {
    setCurrentMedia(resolveMedia(product, product.featureImageURL));
  }, [product]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/products/${product.id}`);
      }}
      className={`flex flex-col gap-3 border-2 border-pink-50 bg-white rounded-3xl overflow-hidden hover:shadow-xl hover:border-pink-200 transition-all duration-300 ${className}`}
    >
      {/* Media area */}
      <div className="relative w-full bg-pink-50 aspect-[4/3]">
        {currentMedia.type === "video" ? (
          <motion.video
            src={currentMedia.url}
            poster={currentMedia.posterUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => {
              if (colorways.length > 0)
                setCurrentMedia(resolveMedia(product, colorways[0]));
            }}
            onMouseLeave={() =>
              setCurrentMedia(resolveMedia(product, product.featureImageURL))
            }
          />
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative flex items-center justify-center"
          >
              <Image
                src={currentMedia.url}
                alt={product?.title}
                fill
                className="object-cover"
                onMouseEnter={() => {
                  if (colorways.length > 0)
                    setCurrentMedia(resolveMedia(product, colorways[0]));
                }}
                onMouseLeave={() =>
                  setCurrentMedia(
                    resolveMedia(product, product.featureImageURL)
                  )
                }
                sizes="(max-width: 768px) 100vw, 300px"
                priority={false}
              />
          </motion.div>
        )}
        
        {/* Badge if sale */}
        {product?.salePrice < product?.price && (
            <div className="absolute top-3 left-3 bg-yellow-300 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-md font-fredoka z-10">
                SALE
            </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col justify-between flex-grow gap-2 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-fredoka font-bold text-lg text-gray-800 line-clamp-2 leading-tight">
            {product?.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-pink-600 text-lg font-bold font-quicksand">
              Rs {product?.salePrice}
            </span>
            {product?.salePrice < product?.price && (
              <span className="line-through text-sm text-gray-400 font-quicksand">
                Rs {product?.price}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="min-h-[20px]">
            <RatingReview productId={product?.id} />
          </div>
        </div>

        {/* Size selection */}
        <div className="min-h-[30px] mt-2">
          {!!selectableSizes.length && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {selectableSizes.slice(0, 5).map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(s);
                  }}
                  className={`shrink-0 inline-flex items-center justify-center rounded-lg border px-2 py-1 text-xs font-quicksand font-bold ${
                    selectedSize === s
                      ? "border-pink-500 bg-pink-500 text-white"
                      : "border-pink-100 text-gray-500 hover:border-pink-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTAs */}
        {!isOutOfStock && (
          <div className="flex items-center gap-3 w-full mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                try {
                  const orderDetails = {
                    productId: product?.id,
                    selectedColor,
                    selectedSize,
                    quantity: 1,
                  };
                  localStorage.setItem(
                    "orderDetails",
                    JSON.stringify(orderDetails)
                  );
                } catch {}

                router.push(
                  `/checkout?type=buynow&productId=${product?.id}` +
                    (selectedColor
                      ? `&color=${encodeURIComponent(selectedColor)}`
                      : "") +
                    (selectedSize
                      ? `&size=${encodeURIComponent(selectedSize)}`
                      : "")
                );
              }}
              className="flex-1 glossy-btn text-white py-2.5 rounded-xl text-sm font-bold font-fredoka tracking-wide"
              disabled={isOutOfStock}
            >
              Buy Now
            </button>
            <AuthContextProvider>
              <AddToCartButton
                productId={product?.id}
                color={selectedColor}
                size={selectedSize}
                outOfStock={isOutOfStock}
              />
            </AuthContextProvider>
          </div>
        )}

        {isOutOfStock && (
          <div className="mt-2 text-center py-2 bg-gray-100 text-gray-400 rounded-xl border border-gray-200">
            <span className="text-xs font-bold font-quicksand uppercase">Out Of Stock</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RatingReview({ productId }) {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setCounts(await getProductReviewCounts({ productId }));
      } catch {}
    })();
  }, [productId]);
  if (!counts || !counts.averageRating) return null;
  return (
    <div className="flex gap-2 items-center">
      <MyRating value={counts.averageRating ?? 0} />
      <span className="text-xs text-gray-400 font-quicksand font-medium">
        {counts.averageRating?.toFixed(1)} ({counts.totalReviews})
      </span>
    </div>
  );
}