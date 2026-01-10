import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ConfirmModal } from "./components/ConfirmModal";
import { ConfirmProvider } from "./hooks/useConfirm";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { Fredoka, Quicksand } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400", "500", "600", "700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Freakin.pk",
  description: "Create By Docs Readers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/logo.svg" />
        <title>Freakin.pk</title>
        <meta name="description" content="Create By Docs Readers" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} ${quicksand.variable} antialiased`}
      >
        <Toaster />
        <NextUIProvider>
          <ConfirmProvider>
            {children}
            <ConfirmModal />
          </ConfirmProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
