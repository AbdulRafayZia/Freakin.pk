// Import React
import React from "react";
// Import other components
import AuthContextProvider from "@/contexts/AuthContext";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Layout({ children }) {
  return (
    <AuthContextProvider>
      <div className="font-quicksand bg-[#fff5f9] min-h-screen text-gray-800 selection:bg-pink-200 selection:text-pink-900">
        {/* Load Fonts */}
        {/* Load Fonts: Handled in RootLayout */}

        <Header />

        <main>
          {children}
        </main>

        <Footer />

        {/* WhatsApp link and logo */}
        <a
          href="https://wa.me/+923396409143"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50 hover:scale-110 transition-transform duration-300 animate-float"
        >
          <img
            src={"/whatsapp-logo.jpg"}
            alt="WhatsApp"
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
          />
        </a>
      </div>
    </AuthContextProvider>
  );
}