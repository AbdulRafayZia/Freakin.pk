"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function AdminButton() {
  const authContext = useAuth();

  // Handle case when context is not available or still loading
  if (!authContext || authContext.isLoading) {
    return <></>;
  }

  const { user } = authContext;
  const { data } = useAdmin({ email: user?.email });

  if (!data) {
    return <></>;
  }

  return (
    <Link href={"/admin"} className="w-full">
      <button
        title="Admin Portal"
        className="h-10 px-4 w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-quicksand font-bold transition-all hover:scale-105 shadow-lg"
      >
        <Shield size={18} />
        <span className="text-sm">Admin</span>
      </button>
    </Link>
  );
}
