"use client";

import { Rating } from "@mui/material";
import { motion } from "framer-motion";

export default function CustomerReviews() {
  const list = [
    {
      name: "Penny Albritton",
      message:
        "Absolutely obsessed with the stickers! The quality is amazing and they look so cute on my laptop.",
      rating: 5,
      imageLink:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    },
    {
      name: "Oscar Nommanee",
      message:
        "The ring set I bought fits perfectly. Packaging was super pink and adorable. 10/10 recommend!",
      rating: 5,
      imageLink:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    },
    {
      name: "Emma Watson",
      message:
        "Fast shipping to Karachi. The phone charm is even prettier in person. Will buy again!",
      rating: 4.5,
      imageLink:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    },
  ];

  const reviewVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="bg-white py-16 border-t border-pink-50">
      <div className="w-full p-5 md:max-w-[1100px] mx-auto flex flex-col gap-10">
        <motion.h1
          className="text-center text-3xl md:text-4xl font-fredoka font-bold text-pink-500 text-shadow-pop"
          variants={headingVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          Freakin' Love from Fans 💖
        </motion.h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {list.map((item, index) => (
            <motion.div
              className="flex flex-col gap-4 p-6 rounded-[2rem] bg-pink-50 border-2 border-pink-100 shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-white"
              key={item.name}
              variants={reviewVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="mx-auto p-1 bg-white rounded-full border-2 border-pink-200">
                <img
                    src={item.imageLink}
                    className="h-20 w-20 rounded-full object-cover"
                    alt={item.name}
                />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-fredoka font-bold text-gray-800">{item.name}</h2>
                <div className="flex justify-center my-2">
                    <Rating
                    size="small"
                    name="customer-rating"
                    defaultValue={item.rating}
                    precision={0.5}
                    readOnly
                    className="text-yellow-400"
                    />
                </div>
              </div>
              
              <div className="bg-white/60 p-4 rounded-2xl flex-grow">
                <p className="text-sm text-gray-600 text-center font-quicksand italic">"{item.message}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}