"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  createCheckoutAndGetURL,
  createCheckoutCODAndGetId,
} from "@/lib/firestore/checkout/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { useState, useEffect, useLayoutEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useLocalCart } from "@/app/hooks/useLocalCart";

export default function Checkout({ productList }) {
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cod");
  const [orderDetails, setOrderDetails] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;

  const { clearCart } = useLocalCart();

  // Load address from local storage only on the client side
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      try {
        const savedAddress = JSON.parse(localStorage.getItem('orderDetails')) || {};
        setOrderDetails(savedAddress);
      } catch (error) {
        console.error("Error loading saved address:", error);
      }
    }
  }, [user]);

  useLayoutEffect(() => {
    if (!user) {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const handleOrderChange = (key, value) => {
    const newOrderDetails = { ...orderDetails, [key]: value };
    setOrderDetails(newOrderDetails);
    
    // Only save to localStorage on the client side
    if (!user && typeof window !== "undefined") {
      try {
        localStorage.setItem('orderDetails', JSON.stringify(newOrderDetails));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };

  // Helper function to check if a value is empty
  const isEmpty = (val) => {
    return val === undefined || val === null || (typeof val === "string" && val.trim() === "");
  };

  const totalPrice = productList?.reduce((prev, curr) => {
    return prev + curr?.quantity * curr?.product?.salePrice;
  }, 0);

  const handlePlaceOrder = async () => {
    setSubmitLoading(true);
    try {
      if (totalPrice <= 0) {
        throw new Error("Price should be greater than 0");
      }

      if (isEmpty(orderDetails?.fullName)) {
        throw new Error("Full Name is required");
      }
      if (isEmpty(orderDetails?.mobile)) {
        throw new Error("Mobile Number is required");
      }

      // Phone number check
      const phoneUtil = PhoneNumberUtil.getInstance();
      const number = phoneUtil.parse(orderDetails.mobile, 'PK');
      if (!phoneUtil.isValidNumberForRegion(number, 'PK')) {
        throw new Error("Please enter a valid Pakistan phone number");
      }

      if (isEmpty(orderDetails?.addressLine1)) {
        throw new Error("Address Line 1 is required");
      }
      if (isEmpty(orderDetails?.pincode)) {
        throw new Error("Pincode is required");
      }
      if (isEmpty(orderDetails?.city)) {
        throw new Error("City is required");
      }
      if (isEmpty(orderDetails?.state)) {
        throw new Error("State is required");
      }

      if (!productList || productList?.length === 0) {
        throw new Error("Product List Is Empty");
      }

      if (!agreeToTerms) {
        throw new Error("You must agree to the terms & conditions");
      }

      if (paymentMode !== "cod") {
        const url = await createCheckoutAndGetURL({
          uid: user ? user.uid : "I6BPQGGYZObEdvNL2pPM",
          products: productList,
          orderDetails,
        });
        router.push(url);
      } else {
        const checkoutId = await createCheckoutCODAndGetId({
          uid: user?.uid || 'I6BPQGGYZObEdvNL2pPM',
          products: productList,
          orderDetails,
        });
        router.push(`/checkout-cod/${checkoutId}`);
        toast.success("Order placed successfully!");
        confetti();
        clearCart();
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setSubmitLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <section className="flex flex-col md:flex-row gap-3">
      <section className="flex-1 flex flex-col gap-4 border rounded-xl p-4">
        <h1 className="text-xl">Shipping Address</h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Full Name"
            value={orderDetails.fullName || ""}
            onChange={(e) => handleOrderChange("fullName", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={orderDetails.mobile || ""}
            onChange={(e) => handleOrderChange("mobile", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="email"
            placeholder="Email (Optional)"
            value={orderDetails.email || ""}
            onChange={(e) => handleOrderChange("email", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Address Line 1"
            value={orderDetails.addressLine1 || ""}
            onChange={(e) => handleOrderChange("addressLine1", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Address Line 2 (Optional)"
            value={orderDetails.addressLine2 || ""}
            onChange={(e) => handleOrderChange("addressLine2", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            max={100}
            placeholder="Pincode"
            value={orderDetails.pincode || ""}
            onChange={(e) => handleOrderChange("pincode", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="City"
            value={orderDetails.city || ""}
            onChange={(e) => handleOrderChange("city", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="State"
            value={orderDetails.state || ""}
            onChange={(e) => handleOrderChange("state", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <textarea
            placeholder="Delivery Notes (Optional)"
            value={orderDetails.orderNote || ""}
            onChange={(e) => handleOrderChange("orderNote", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>
      </section>

      <div className="flex-1 flex flex-col gap-3">
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <h1 className="text-xl">Products</h1>
          <div className="flex flex-col gap-2 pb-5 border-b">
            {productList?.map((item, idx) => {
              const hasColor = item?.color !== undefined && item?.color !== null && item?.color !== "";
              const hasSize = item?.size !== undefined && item?.size !== null && item?.size !== "";
              return (
                <div className="flex gap-3 items-center" key={item?.product?.id || idx}>
                  <img
                    className="w-10 h-10 object-cover rounded-lg"
                    src={item?.product?.featureImageURL}
                    alt=""
                  />
                  <div className="flex-1 flex flex-col">
                    <h1 className="text-sm">{item?.product?.title}</h1>
                    <div className="flex gap-2 items-center text-xs mt-1">
                      {hasColor && (
                        <div className="flex items-center gap-1">
                          <span>Color:</span>
                          <span
                            className="inline-block w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor: item.color,
                              borderColor: "#ccc",
                            }}
                            title={item.color}
                          ></span>
                          <span className="ml-1">{item.color}</span>
                        </div>
                      )}
                      {hasSize && (
                        <div className="flex items-center gap-1 ml-3">
                          <span>Size:</span>
                          <span className="font-semibold">{item.size}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-green-600 font-semibold text-[10px]">
                      Rs {item?.product?.salePrice}{" "}
                      <span className="text-black">X</span>{" "}
                      <span className="text-gray-600">{item?.quantity}</span>
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm">
                      Rs {item?.product?.salePrice * item?.quantity}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between w-full items-center px-2">
            <h1>Subtotal</h1>
            <h1>Rs {productList.reduce((total, item) => total + item.product?.price * item.quantity, 0)}</h1>
          </div>
          <div className="flex justify-between w-full items-center px-2">
            <h1>Discount</h1>
            <h1>Rs {productList.reduce((total, item) => total + (item.product?.price - item.product?.salePrice) * item.quantity, 0)}</h1>
          </div>
          <div className="flex justify-between w-full items-center px-2">
            <h1>Shipping</h1>
            <h1>Rs 0</h1>
          </div>
          <div className="flex justify-between w-full items-center p-2 font-semibold">
            <h1>Total</h1>
            <h1>Rs {totalPrice}</h1>
          </div>
        </section>

        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-xl">Payment Mode</h2>
          </div>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => toast("Coming Soon")}
              className="flex w-full items-center gap-1 p-2 text-xs rounded-md cursor-pointer transition-colors duration-150 bg-gray-100 hover:bg-gray-200"
            >
              <input
                type="radio"
                name="paymentMode"
                value="prepaid"
                disabled={true}
                checked={false}
                readOnly
                className="cursor-pointer"
              />
              Card Payment
            </button>
            <button
              onClick={() => toast("Coming Soon")}
              className="flex w-full items-center gap-1 p-2 text-xs rounded-md cursor-pointer transition-colors duration-150 bg-gray-100 hover:bg-gray-200"
            >
              <input
                type="radio"
                name="paymentMode"
                value="prepaid"
                disabled={true}
                checked={false}
                readOnly
                className="cursor-pointer"
              />
              EasyPaisa
            </button>
            <button
              onClick={() => toast("Coming Soon")}
              className="flex w-full items-center gap-1 p-2 text-xs rounded-md cursor-pointer transition-colors duration-150 bg-gray-100 hover:bg-gray-200"
            >
              <input
                type="radio"
                name="paymentMode"
                value="prepaid"
                disabled={true}
                checked={false}
                readOnly
                className="cursor-pointer"
              />
              JazzCash
            </button>
            <button
              onClick={() => setPaymentMode("cod")}
              className={`flex w-full items-center gap-1 p-2 text-xs rounded-md cursor-pointer transition-colors duration-150 ${
                paymentMode === "cod" ? "bg-blue-100" : "bg-gray-100"
              } hover:bg-blue-200`}
            >
              <input
                type="radio"
                name="paymentMode"
                value="cod"
                checked={paymentMode === "cod"}
                readOnly
                className="cursor-pointer"
              />
              Cash On Delivery
            </button>
          </div>
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              width={100}
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            <h4 className="text-xs text-gray-600">
              I agree with the{" "}
              <span className="text-blue-700">terms & conditions</span>
            </h4>
          </div>
          <Button
            isLoading={isLoading || submitLoading}
            isDisabled={isLoading || submitLoading}
            onClick={handlePlaceOrder}
            className="bg-black text-white"
          >
            Place Order
          </Button>
        </section>
      </div>
    </section>
  );
}