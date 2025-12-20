"use client";
import React, { useEffect, useState } from "react";
import {
  UserCircle2,
  Menu,
  X,
  Home,
  HeartIcon,
  Info,
  Mail,
  Search,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminButton from "./AdminButton";
import HeaderClientButtons from "./HeaderClientButtons";
import LogoutButton from "./LogoutButton";
import UserDeatilsInMenu from "./UserDeatilsInMenu";
import LoginButton from "./LoginButton";
import AccountButton from "./AccountButton";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname() || "/"; // fallback for preview

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuList = [
    { name: "Home", link: "/", icon: <Home size={18} />, onNavbar: true },
    { name: "Categories", link: "/categories", icon: <LayoutGrid size={18} />, onNavbar: true },
    { name: "Search", link: "/search?q=", icon: <Search size={18} />, onNavbar: false },
    { name: "Favorites", link: "/favorites", icon: <HeartIcon size={18} />, onNavbar: false },
    { name: "About", link: "/about-us", icon: <Info size={18} />, onNavbar: true },
    { name: "Contact", link: "/contact-us", icon: <Mail size={18} />, onNavbar: true },
  ];

  const NavLink = ({ item }) => {
    const isActive = pathname === item.link;
    return (
      <Link href={item.link} className="relative group px-4 py-2">
        <span
          className={[
            "text-base font-bold transition-colors font-quicksand",
            isActive ? "text-pink-600" : "text-gray-600 group-hover:text-pink-500",
          ].join(" ")}
        >
          {item.name}
        </span>
        {/* Bubbly underline */}
        <span
          className={[
            "pointer-events-none absolute left-1/2 -bottom-1 h-1.5 w-1.5 rounded-full transition-all transform -translate-x-1/2",
            isActive ? "bg-pink-500 opacity-100" : "bg-pink-300 opacity-0 group-hover:opacity-100",
          ].join(" ")}
        />
      </Link>
    );
  };

  return (
    <>
    <nav
      className={[
        "sticky top-0 z-50",
        "transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b-4 border-pink-200 shadow-sm"
          : "bg-white/40 backdrop-blur-md border-b-4 border-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 w-full">
        <div className="h-16 md:h-20 flex items-center justify-between">
          {/* Left: Brand */}
          <Link href="/" className="flex items-center gap-2 group">
             <span className="font-fredoka text-base sm:text-lg md:text-3xl font-bold text-pink-500 text-shadow-pop">Freakin.pk</span>
          </Link>

          {/* Center: Nav (Desktop) */}
          <div className="hidden md:flex items-center bg-white/50 rounded-full px-4 py-1 border border-pink-100 backdrop-blur-sm">
            {menuList.filter(m => m.onNavbar).map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          {/* Right: Utilities */}
          <div className="hidden md:flex items-center gap-3">
            {/* Admin Button (only for admins) */}
            <AdminButton />

            {/* Search */}
            <div className="relative">
              <button
                title="Search Products"
                onClick={() => setShowSearch((s) => !s)}
                className="h-10 w-10 flex justify-center items-center rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 hover:scale-110 transition-all"
              >
                 <Search size={20} />
              </button>
              <div
                className={[
                  "absolute right-0 top-1/2 -translate-y-1/2",
                  "transition-all duration-300 overflow-hidden z-50",
                  showSearch ? "w-72 opacity-100 -right-12" : "w-0 opacity-0",
                ].join(" ")}
              >
                <form action="/search" className="flex shadow-lg rounded-full">
                  <input
                    name="q"
                    placeholder="Search cute things…"
                    className="w-full h-10 pl-4 pr-10 rounded-full bg-white border-2 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm font-quicksand placeholder-pink-300 text-pink-600"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600">
                    <Search size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Cart and Favorites */}
            <HeaderClientButtons />

            {/* Account Button (only when logged in) */}
            <AccountButton />

            {/* Login Button (only when not logged in) */}
            <LoginButton />

            {/* Logout Button (only when logged in) */}
            <LogoutButton />
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-2">
            <HeaderClientButtons forMobile />
            <button
              onClick={() => setIsDropdownOpen((s) => !s)}
              className="h-10 w-10 flex justify-center items-center rounded-full bg-pink-500 text-white hover:bg-pink-600 active:scale-95 transition-transform shadow-lg"
              aria-label="Toggle Menu"
            >
              {isDropdownOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile Sheet - Full Page Overlay */}
      {isDropdownOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          <button
            aria-label="Close"
            onClick={() => setIsDropdownOpen(false)}
            className="absolute inset-0 bg-pink-900/20 backdrop-blur-sm"
          />
          <div className="relative ml-auto h-full w-[86vw] max-w-sm bg-white border-l-4 border-pink-200 shadow-2xl p-5 flex flex-col rounded-l-3xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-white pb-2">
              <Link href="/" onClick={() => setIsDropdownOpen(false)}>
                <span className="font-fredoka text-base sm:text-lg md:text-3xl font-bold text-pink-500">Freakin.pk</span>
              </Link>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col pb-6">
              {/* User Details Section */}
              <div className="mb-6 pb-6 border-b border-pink-100">
                <UserDeatilsInMenu />
              </div>

              {/* Navigation Heading */}
              <h2 className="text-pink-400 text-xs font-bold uppercase mb-2 ml-1 tracking-widest">Navigation</h2>

              {/* Navigation Menu */}
              <div className="flex flex-col space-y-2 mb-8">
                {menuList.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setIsDropdownOpen(false)}
                    className={[
                      "flex items-center gap-4 rounded-2xl px-4 py-4 font-quicksand font-bold text-lg transition-all",
                      pathname === item.link ? "bg-pink-50 text-pink-600 shadow-sm" : "hover:bg-gray-50 text-gray-600",
                    ].join(" ")}
                  >
                    <span className={pathname === item.link ? "text-pink-500" : "text-gray-400"}>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="mt-auto pt-6 border-t border-pink-100 space-y-3">
                <h2 className="text-pink-400 text-xs font-bold uppercase mb-2 ml-1 tracking-widest">Account</h2>
                <div className="w-full">
                  <AdminButton />
                </div>
                <div className="w-full">
                  <AccountButton />
                </div>
                <div className="w-full">
                  <LoginButton />
                </div>
                <div className="w-full">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}