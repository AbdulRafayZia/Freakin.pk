"use client";

import { updateAdvertisementClicks } from "@/lib/firestore/advertisement/write";
import { useRouter } from "next/navigation";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function SmAdvertisements({ advertisements }) {
  const router = useRouter();

  const handleAdClick = async (ad) => {
    try {
      await updateAdvertisementClicks(ad.id);
      if (ad.link) {
        router.push(ad.link);
      } else {
        console.log("Link not available");
      }
    } catch (error) {
      console.log({ error });
      console.log("Unable to update click count");
    }
  };

  return (
    <section className="w-full flex justify-center py-6 bg-white">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={20}
          className="advertisement-swiper px-4"
          loop={true}
          centeredSlides={false}
          watchOverflow={true}
        >
          {advertisements.map((ad) => (
            <SwiperSlide key={ad.id} style={{ width: "auto", height: "auto"}}>
              <div className="flex justify-center p-2">
                <div className="overflow-hidden rounded-2xl border-2 border-pink-100 shadow-md hover:shadow-pink-200/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                    <img
                    onClick={() => handleAdClick(ad)}
                    src={ad.addImage}
                    alt={`Ad ${ad.id}`}
                    className="h-[150px] w-auto object-cover" 
                    />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
    </section>
  );
}