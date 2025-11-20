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
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap');
          
          /* Glossy Button Class */
          .glossy-btn {
              background: linear-gradient(180deg, #f472b6 0%, #db2777 100%);
              box-shadow: 0 4px 0 #9d174d, 0 5px 10px rgba(0,0,0,0.1);
              transition: all 0.1s ease;
          }
          .glossy-btn:active {
              transform: translateY(4px);
              box-shadow: 0 0 0 #9d174d, inset 0 2px 5px rgba(0,0,0,0.2);
          }
          
          .text-shadow-pop {
              text-shadow: 2px 2px 0px #fff, 4px 4px 0px #f9a8d4;
          }
        `}} />

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