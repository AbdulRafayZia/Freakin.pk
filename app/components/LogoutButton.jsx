"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../hooks/useConfirm";

export default function LogoutButton() {
  const authContext = useAuth();
  const confirmModal = useConfirm();

  // Handle case when context is not available or still loading
  if (!authContext || authContext.isLoading) {
    return <></>;
  }

  const { user } = authContext;

  if (!user) {
    return <></>;
  }

  return (
    <button
      onClick={async () => {
        if (!(await confirmModal("Are you sure you want to logout?"))) return;
        try {
          await toast.promise(signOut(auth), {
            error: (e) => e?.message,
            loading: "Logging out...",
            success: "Successfully Logged out",
          });
        } catch (error) {
          toast.error(error?.message);
        }
      }}
      title="Logout"
      className="h-10 w-10 flex justify-center items-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110 transition-all"
    >
      <LogOut size={20} />
    </button>
  );
}
