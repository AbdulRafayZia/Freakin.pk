"use client";
import { auth } from "@/lib/firebase";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { updateUser } from "@/lib/firestore/user/write";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/firestore/user/read";
import { Pencil, User, Lock, Save, Package, Sparkles, Home, ShoppingBag } from "lucide-react";
import { useOrders } from "@/lib/firestore/orders/read";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/vercel.blob";
import Link from "next/link";

export default function Page() {
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });
  const {
    data: orders,
    error: ordersError,
    isLoading: ordersLoading,
  } = useOrders({ uid: user?.uid });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log({userData})
    // Assuming userData is provided via a useUser hook or similar
    if (userData) {
      setDisplayName(userData.displayName ?? "");
      setPhotoURL(userData.photoURL ?? "");
    }
  }, [userData]);

  const handleProfilePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const newPhotoURL = await uploadFile("profile-pics/", file);
        if (newPhotoURL) {
          setPhotoURL(newPhotoURL);
          setIsChanged(true);
        }
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        toast.error("Failed to upload profile picture. Please try again.");
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (password) {
        if (!currentPassword) {
          toast.error("Please enter your current password for verification");
          setLoading(false);
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(auth.currentUser, password);
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");
      }

      if (displayName != user.displayName || photoURL != user.photoURL) {
        await updateUser({ uid: user.uid, displayName, photoURL });
        toast.success("Profile updated successfully");
        setIsChanged(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Home Button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-pink-600 font-quicksand font-bold rounded-full border-2 border-pink-200 hover:border-pink-400 transition-all hover:scale-105 shadow-lg backdrop-blur-sm">
          <Home size={18} />
          <span className="hidden sm:inline">Home</span>
        </button>
      </Link>

      <div className="relative z-10 py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="text-pink-500" size={32} />
              <h1 className="font-fredoka text-4xl md:text-5xl font-bold text-pink-600">
                My Account
              </h1>
            </div>
            <p className="font-quicksand text-gray-600">
              Manage your profile and view your orders
            </p>
          </div>

          {/* Profile Section */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-10 border border-pink-100 mb-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  className="rounded-full h-32 w-32 border-4 border-pink-200 shadow-lg object-cover"
                  src={photoURL || "/blank-profile-picture.png"}
                  alt="Profile"
                />
                <div
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-3 cursor-pointer hover:scale-110 transition-all shadow-lg"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <Pencil size={20} className="text-white" />
                </div>
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
              <h2 className="font-fredoka text-2xl font-bold text-gray-800 mb-1">
                {displayName || "User"}
              </h2>
              <p className="font-quicksand text-gray-600">{user?.email}</p>
            </div>

            {/* General Information */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <User className="text-pink-500" size={24} />
                <h3 className="font-fredoka text-xl font-bold text-gray-800">
                  General Information
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName || ""}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setIsChanged(true);
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="text-purple-500" size={24} />
                <h3 className="font-fredoka text-xl font-bold text-gray-800">
                  Change Password
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword || ""}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password || ""}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsChanged(true);
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword || ""}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setIsChanged(true);
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              disabled={!isChanged || loading}
              onClick={handleUpdateProfile}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Orders Section */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-10 border border-pink-100">
            <div className="flex items-center gap-2 mb-6">
              <Package className="text-pink-500" size={28} />
              <h2 className="font-fredoka text-3xl font-bold text-gray-800">
                My Orders
              </h2>
            </div>
            {ordersLoading ? (
              <div className="flex justify-center py-24">
                <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
              </div>
            ) : ordersError ? (
              <div className="text-center py-12 text-red-500 font-quicksand">
                {ordersError}
              </div>
            ) : (
              <OrderList orders={orders} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function OrderList({ orders }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "packed":
      case "picked up":
      case "in transit":
      case "out for delivery":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div>
      {!orders || orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="text-pink-400" size={64} />
          </div>
          <h3 className="font-fredoka text-xl font-bold text-gray-800">
            No Orders Yet
          </h3>
          <p className="font-quicksand text-gray-600 text-center max-w-md">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
              <ShoppingBag size={20} />
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders?.map((item, orderIndex) => {
            const totalAmount = item?.checkout?.line_items?.reduce(
              (prev, curr) => {
                return (
                  prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity
                );
              },
              0
            );
            return (
              <div
                key={orderIndex}
                className="bg-white rounded-2xl border-2 border-pink-100 p-6 hover:shadow-lg transition-all"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-pink-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="font-fredoka font-bold text-pink-600">
                        #{orderIndex + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-quicksand text-xs text-gray-500">
                        Order placed on
                      </p>
                      <p className="font-quicksand text-sm font-semibold text-gray-700">
                        {item?.timestampCreate?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-quicksand font-bold rounded-full border border-blue-200 uppercase">
                      {item?.paymentMode}
                    </span>
                    <span
                      className={`px-3 py-1.5 text-xs font-quicksand font-bold rounded-full border uppercase ${getStatusClass(
                        item?.status ?? "pending"
                      )}`}
                    >
                      {item?.status ?? "pending"}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {item?.checkout?.line_items?.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-pink-50 rounded-xl"
                    >
                      <img
                        className="h-16 w-16 rounded-lg object-cover border-2 border-white shadow-sm"
                        src={product?.price_data?.product_data?.images?.[0]}
                        alt="Product"
                      />
                      <div className="flex-1">
                        <h3 className="font-quicksand font-semibold text-gray-800 mb-1">
                          {product?.price_data?.product_data?.name}
                        </h3>
                        <p className="font-quicksand text-sm text-gray-600">
                          Rs {product?.price_data?.unit_amount / 100} × {product?.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-fredoka font-bold text-pink-600">
                          Rs {(product?.price_data?.unit_amount / 100) * product?.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex items-center justify-between pt-4 border-t border-pink-100">
                  <span className="font-quicksand font-semibold text-gray-700">
                    Order Total
                  </span>
                  <span className="font-fredoka text-2xl font-bold text-pink-600">
                    Rs {totalAmount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
