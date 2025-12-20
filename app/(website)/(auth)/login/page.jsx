"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Sparkles, Home } from "lucide-react";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({});

  const handleData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data?.email, data?.password);
      toast.success("Logged In Successfully");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <main className="w-full min-h-screen flex bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Home Button */}
      <Link href="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-pink-600 font-quicksand font-bold rounded-full border-2 border-pink-200 hover:border-pink-400 transition-all hover:scale-105 shadow-lg backdrop-blur-sm cursor-pointer">
        <Home size={18} />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10">
        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-pink-500" size={40} />
            <h1 className="font-fredoka text-6xl font-bold text-pink-600 text-shadow-pop">
              Freakin.pk
            </h1>
          </div>

          {/* Welcome Message */}
          <h2 className="font-fredoka text-4xl font-bold text-gray-800 mb-4">
            Welcome Back!
          </h2>
          <p className="font-quicksand text-lg text-gray-600 mb-8">
            Sign in to continue your amazing shopping experience with us.
          </p>

          {/* Feature List */}
          <div className="space-y-4">
            {[
              "Browse exclusive collections",
              "Track your orders easily",
              "Save your favorite items",
              "Get personalized recommendations"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <span className="font-quicksand text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="text-pink-500" size={32} />
              <h1 className="font-fredoka text-4xl font-bold text-pink-600 text-shadow-pop">
                Freakin.pk
              </h1>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-pink-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="font-fredoka text-3xl font-bold text-gray-800 mb-2">
                Sign In
              </h2>
              <p className="font-quicksand text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-5"
            >
              {/* Email Input */}
              <div>
                <label htmlFor="user-email" className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                  <input
                    placeholder="your@email.com"
                    type="email"
                    name="user-email"
                    id="user-email"
                    value={data?.email || ""}
                    onChange={(e) => {
                      handleData("email", e.target.value);
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="user-password" className="block text-sm font-quicksand font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                  <input
                    placeholder="Enter your password"
                    type="password"
                    name="user-password"
                    id="user-password"
                    value={data?.password || ""}
                    onChange={(e) => {
                      handleData("password", e.target.value);
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none transition-colors font-quicksand"
                    required
                  />
                </div>
              </div>

              {/* Forget Password Link */}
              <div className="flex justify-end">
                <Link href="/forget-password">
                  <button type="button" className="text-sm font-quicksand font-semibold text-pink-600 hover:text-pink-700 transition-colors">
                    Forgot Password?
                  </button>
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-sm text-gray-500 font-quicksand">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600 font-quicksand">
                Don't have an account?{" "}
                <Link href="/sign-up">
                  <span className="font-bold text-pink-600 hover:text-pink-700 transition-colors cursor-pointer">
                    Create Account
                  </span>
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-center text-sm text-gray-500 font-quicksand mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </main>
  );
}

function SignInWithGoogleComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = credential.user;
      await createUser({
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
  return (
    <Button isLoading={isLoading} isDisabled={isLoading} onClick={handleLogin}>
      Sign In With Google
    </Button>
  );
}
