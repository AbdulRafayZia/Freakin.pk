"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginButton() {
  const authContext = useAuth();

  // Handle case when context is not available or still loading
  if (!authContext || authContext.isLoading) {
    return <></>;
  }

  const { user } = authContext;

  if (user) {
    return <></>;
  }

  return (
    <Link href="/login" className="w-full">
      <button
        title="Login"
        className="h-10 px-4 w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-quicksand font-bold transition-all hover:scale-105 shadow-lg"
      >
        <LogIn size={18} />
        <span className="text-sm">Login</span>
      </button>
    </Link>
  );
}
