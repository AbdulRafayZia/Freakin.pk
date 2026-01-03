"use client";

import { updateAdvertisementClicks } from "@/lib/firestore/advertisement/write";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];
function isVideoUrl(url = "") {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

export default function LgAdvertisements({ advertisements }) {
  const router = useRouter();
  const videoRefs = useRef({});

  useEffect(() => {
    if (!advertisements?.length) return;
    const firstAd = advertisements[0];
    if (isVideoUrl(firstAd.addImage)) {
      const v = videoRefs.current[firstAd.id];
      v?.play?.().catch(() => {});
    }
  }, [advertisements]);

  const handleSlideChange = (swiper) => {
    const activeIdx = swiper.realIndex;
    advertisements.forEach((ad, i) => {
      const v = videoRefs.current[ad.id];
      if (!v) return;
      if (i === activeIdx) {
        v.play?.().catch(() => {});
      } else {
        v.pause?.();
        v.currentTime = 0;
      }
    });
  };

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
    <section className="w-full bg-pink-50 py-8">
      <div className="w-full max-w-full lg:max-w-[1500px] mx-auto p-5">
        <div className="rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
            <Swiper
            slidesPerView={1}
            loop={true}
            watchOverflow={true}
            centeredSlides={true}
            onSlideChange={handleSlideChange}
            >
            {advertisements.map((ad) => (
                <SwiperSlide key={ad.id}>
                <div className="w-full h-full flex justify-center bg-white">
                    {isVideoUrl(ad.addImage) ? (
                    <video
                        ref={el => (videoRefs.current[ad.id] = el)}
                        onClick={() => handleAdClick(ad)}
                        src={ad.addImage}
                        className="w-full h-auto object-cover cursor-pointer"
                        poster={ad.posterUrl || ""}
                        style={{ maxHeight: 500 }}
                        playsInline
                        muted
                        loop
                        autoPlay
                        preload="metadata"
                    />
                    ) : (
                    <img
                        onClick={() => handleAdClick(ad)}
                        src={ad.addImage}
                        alt={`Ad ${ad.id}`}
                        className="w-full h-auto object-cover cursor-pointer"
                    />
                    )}
                </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
      </div>
    </section>
  );
}