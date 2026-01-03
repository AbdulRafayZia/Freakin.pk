import React from "react";
import { Mail, MapPin, Phone, Truck, Gift, Headset } from "lucide-react";
import { SocialIcon } from "react-social-icons";

export function Benefits() {
  return (
    <div className="bg-white py-12 border-b border-pink-100">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6 rounded-3xl bg-yellow-50 border-2 border-yellow-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-yellow-100 p-4 rounded-full mb-4 text-yellow-600">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-fredoka font-bold text-gray-800">FREE SHIPPING</h3>
            <p className="text-sm text-gray-500 font-quicksand">
              All over Pakistan (conditions apply)
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl bg-pink-50 border-2 border-pink-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-pink-100 p-4 rounded-full mb-4 text-pink-600">
              <Gift size={32} />
            </div>
            <h3 className="text-xl font-fredoka font-bold text-gray-800">BRAND NEW</h3>
            <p className="text-sm text-gray-500 font-quicksand">
              100% original genuine products
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl bg-purple-50 border-2 border-purple-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-purple-100 p-4 rounded-full mb-4 text-purple-600">
              <Headset size={32} />
            </div>
            <h3 className="text-xl font-fredoka font-bold text-gray-800">SUPPORT</h3>
            <p className="text-sm text-gray-500 font-quicksand">
              Comprehensive service & support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <Benefits />
      <footer className="bg-white pt-16 pb-8 border-t-4 border-pink-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-12 mb-12">

            {/* Brand */}
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-4">
                <h2 className="font-fredoka text-3xl font-bold text-pink-500 text-shadow-pop">Freakin.pk</h2>
              </div>
              <p className="text-gray-500 font-quicksand text-center md:text-left max-w-xs">
                Bringing joy to your life through cute stickers and trendy accessories.
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center md:justify-end gap-8">
              <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl text-blue-600">
                <Phone size={18} />
                <h2 className="text-sm font-bold font-quicksand">+92 3333333333</h2>
              </div>
              <div className="flex items-center gap-3 bg-pink-50 px-4 py-2 rounded-2xl text-pink-600">
                <Mail size={18} />
                <h2 className="text-sm font-bold font-quicksand">freakin.pk28@gmail.com</h2>
              </div>
              <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-2xl text-green-600">
                <MapPin size={18} />
                <h2 className="text-sm font-bold font-quicksand text-center">
                  New City Phase 2, Taxila
                </h2>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="text-center border-t border-dashed border-gray-200 pt-8">
            <h3 className="text-sm font-fredoka font-bold text-pink-400 uppercase tracking-wide mb-4">
              Let's be friends
            </h3>
            <div className="flex justify-center space-x-4">
              <SocialIcon url="https://facebook.com" bgColor="#fee2e2" fgColor="#ef4444" style={{ height: 40, width: 40 }} className="hover:scale-110 transition-transform" />
              <SocialIcon url="https://instagram.com" bgColor="#fce7f3" fgColor="#db2777" style={{ height: 40, width: 40 }} className="hover:scale-110 transition-transform" />
              <SocialIcon url="https://twitter.com" bgColor="#e0f2fe" fgColor="#0284c7" style={{ height: 40, width: 40 }} className="hover:scale-110 transition-transform" />
            </div>
            <div className="mt-8 text-xs text-gray-400 font-quicksand">
              &copy; 2026. All rights reserved. Made with ❤️
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}