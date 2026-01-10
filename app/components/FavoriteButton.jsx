"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateFavorites } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useRouter } from "next/navigation";
import { useLocalFavorites } from "../hooks/useLocalFavorites";

export default function FavoriteButton({ productId }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const { favorites, addToFavorites, removeFromFavorites } = useLocalFavorites();
  const router = useRouter();

  const isLiked = user
    ? data?.favorites?.includes(productId)
    : favorites.includes(productId);

  const handlClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        if (isLiked) {
          removeFromFavorites(productId);
        } else {
          addToFavorites(productId);
        }
      }
      else {
        if (data?.favorites?.includes(productId)) {
          const newList = data?.favorites?.filter((item) => item != productId);
          await updateFavorites({ list: newList, uid: user?.uid });
        } else {
          await updateFavorites({
            list: [...(data?.favorites ?? []), productId],
            uid: user?.uid,
          });
        }
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handlClick}
      disabled={isLoading}
      className={`
        w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border
        ${isLiked
          ? "bg-pink-50 border-pink-500 text-pink-500 shadow-md transform scale-105"
          : "bg-white border-gray-200 text-gray-400 hover:text-pink-400 hover:border-pink-200 hover:shadow-lg"
        }
        ${isLoading ? "opacity-70 cursor-wait" : ""}
      `}
      title={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {!isLiked && <FavoriteBorderOutlinedIcon />}
          {isLiked && <FavoriteIcon />}
        </>
      )}
    </button>
  );
}
