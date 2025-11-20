"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation"; // Removed for preview (unused)
import { ShoppingBag, Plus, Trash2, Loader2, Check } from "lucide-react";
// import toast from "react-hot-toast"; // Mocked below for preview

// ---------------------------------------------------------------------------
// ⚠️ IMPORTANT: UNCOMMENT YOUR REAL IMPORTS BELOW FOR PRODUCTION
// ---------------------------------------------------------------------------
/*
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { useLocalCart } from "../hooks/useLocalCart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
*/

// ---------------------------------------------------------------------------
// 🚧 MOCK HOOKS & UTILS FOR PREVIEW ONLY (DELETE THIS SECTION IN YOUR PROJECT)
// ---------------------------------------------------------------------------
const useAuth = () => ({ user: null }); // Mock Auth
const useUser = () => ({ data: { carts: [] } }); // Mock Firestore User
const updateCarts = async () => new Promise(r => setTimeout(r, 1000)); // Mock API
const useLocalCart = () => {
    const [cart, setCart] = useState([]);
    return {
        cart,
        addToCart: (item) => { 
            setCart([...cart, item]); 
            toast.success("Added to cart!"); 
        },
        removeFromCart: (id) => { 
            setCart(cart.filter(i => i.id !== id)); 
            toast.success("Removed from cart"); 
        }
    };
};
const useRouter = () => ({ push: () => {} }); // Mock Router
const toast = {
    success: (msg) => console.log("Toast Success:", msg),
    error: (msg) => console.error("Toast Error:", msg),
};
// ---------------------------------------------------------------------------

export default function AddToCartButton({ productId, type, color, size, outOfStock }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const { cart, addToCart, removeFromCart } = useLocalCart();
  const router = useRouter();

  // Check if item is in cart (handling both Firestore and Local)
  const isAdded = user 
    ? data?.carts?.find((item) => item?.id === productId)
    : cart.find((item) => item.id === productId);

  const handlClick = async (e) => {
    // e.stopPropagation(); // Prevent triggering product card click (if present)
    if (outOfStock) return;
    
    setIsLoading(true);
    try {
      if (!user?.uid) {
        if (isAdded) {
          removeFromCart(productId);
        } else {
          addToCart({ id: productId, quantity: 1, size: size, color: color });
        }
      }
      else {
        if (isAdded) {
          const newList = data?.carts?.filter((item) => item?.id != productId);
          await updateCarts({ list: newList, uid: user?.uid });
          toast.success("Removed from cart");
        } else {
          await updateCarts({
            list: [...(data?.carts ?? []), { id: productId, quantity: 1, color: color, size: size }],
            uid: user?.uid,
          });
          toast.success("Added to cart!");
        }
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  // ---------------------------------------------------------------------------
  // VARIANT: CUTE / LARGE (Full Text Button)
  // ---------------------------------------------------------------------------
  if (type === "cute" || type === "large") {
    return (
      <button
        onClick={handlClick}
        disabled={isLoading || outOfStock}
        className={`
            relative group overflow-hidden px-6 py-3 rounded-xl font-fredoka font-bold tracking-wide text-sm md:text-base transition-all duration-300
            ${outOfStock 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                : isAdded
                    ? 'bg-white border-2 border-red-400 text-red-500 hover:bg-red-50 shadow-sm'
                    : 'bg-gradient-to-b from-pink-400 to-pink-500 border-b-4 border-pink-700 text-white hover:-translate-y-1 hover:shadow-lg active:border-b-0 active:translate-y-1'
            }
            ${isLoading ? 'cursor-wait opacity-80' : ''}
        `}
      >
        <div className="flex items-center justify-center gap-2">
            {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
            ) : isAdded ? (
                <>
                    <Trash2 size={18} />
                    <span>Remove</span>
                </>
            ) : (
                <>
                    <ShoppingBag size={18} strokeWidth={2.5} />
                    <span>{outOfStock ? "Out of Stock" : "Add To Cart"}</span>
                </>
            )}
        </div>
      </button>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT: DEFAULT (Icon Only - 3D Pop Style)
  // ---------------------------------------------------------------------------
  return (
    <button
      onClick={handlClick}
      disabled={isLoading || outOfStock}
      className={`
        group relative flex items-center justify-center p-3 rounded-2xl transition-all duration-200 border-2
        ${outOfStock 
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
          : isAdded
            ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-[0_4px_0_#ec4899] hover:translate-y-[2px] hover:shadow-[0_2px_0_#ec4899] active:translate-y-[4px] active:shadow-none'
            : 'bg-white border-pink-400 text-pink-500 shadow-[0_4px_0_#ec4899] hover:bg-pink-50 hover:translate-y-[2px] hover:shadow-[0_2px_0_#ec4899] active:translate-y-[4px] active:shadow-none'
        }
      `}
      title={isAdded ? "Remove from cart" : "Add to cart"}
    >
      {isLoading ? (
        <Loader2 className="animate-spin text-pink-500" size={22} />
      ) : (
        <div className="relative">
            {isAdded ? (
                <Check size={22} strokeWidth={3} />
            ) : (
                <>
                    <ShoppingBag size={22} className="transition-transform group-hover:scale-110 group-active:scale-95" strokeWidth={2.5} />
                    {!outOfStock && (
                        <div className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm transform group-hover:rotate-90 transition-transform duration-300">
                            <Plus size={10} strokeWidth={4} />
                        </div>
                    )}
                </>
            )}
        </div>
      )}
    </button>
  );
}