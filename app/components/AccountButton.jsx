"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function AccountButton() {
  const authContext = useAuth();

  // Handle case when context is not available or still loading
  if (!authContext || authContext.isLoading) {
    return <></>;
  }

  const { user } = authContext;

  if (!user) {
    return <></>;
  }

  return (
    <Link href="/account">
      <button
        title="My Account"
        className="h-10 w-10 flex justify-center items-center rounded-full bg-purple-50 text-purple-500 hover:bg-purple-100 hover:scale-110 transition-all"
      >
        <UserCircle2 size={20} />
      </button>
    </Link>
  );
}
