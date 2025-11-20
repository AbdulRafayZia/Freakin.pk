"use client";

import { Button } from "@nextui-org/react";
import { collection } from "firebase/firestore";
import { Heart } from "lucide-react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Collections({ collections }) {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Changed to 1 for mobile to give more space
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  if (collections.length === 0) {
    return <></>;
  }

  return (
    <div className="overflow-hidden md:p-10 p-5 bg-[#fff5f9]">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-fredoka font-bold text-pink-500 text-shadow-pop">
          Our Collections
        </h2>
      </div>
      <Slider {...settings}>
        {(collections?.length <= 2
          ? [...collections, ...collections, ...collections]
          : collections
        )?.map((collection, index) => {
          return (
            <div className="px-3 py-4" key={collection?.id || index}>
              <div className="flex gap-4 bg-gradient-to-br from-pink-100 to-purple-100 p-6 w-full rounded-3xl h-full border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="w-full flex flex-col justify-between gap-2">
                  <div className="flex flex-col gap-2">
                    <h1 className="md:text-xl text-lg font-fredoka font-bold text-purple-900 group-hover:text-pink-600 transition-colors">
                      {collection?.title}
                    </h1>
                    <h1 className="text-gray-600 font-quicksand text-xs md:text-sm max-w-96 line-clamp-2 font-medium">
                      {collection?.subTitle}
                    </h1>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <Link href={`/collections/${collection?.id}`}>
                      <button className="glossy-btn text-white text-xs md:text-sm px-6 py-3 rounded-xl font-fredoka font-bold tracking-wide transform transition hover:-translate-y-1 shadow-md">
                        SHOP NOW
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center">
                  <img
                    className="h-[6rem] md:h-[10rem] object-contain drop-shadow-md transform group-hover:scale-110 transition-transform duration-300"
                    src={collection?.imageURL}
                    alt={collection?.title}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}