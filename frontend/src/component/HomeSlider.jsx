import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HomeSlider() {
  const slides = [
    {
      image:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=1200&auto=compress&cs=tinysrgb",
      title: "PAN & Aadhaar Card Services",
      text: "Apply for PAN or Aadhaar Card easily and quickly with our online services.",
      button: "Apply Now",
    },
    {
      image:
        "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?w=1200&auto=compress&cs=tinysrgb",
      title: "Online Money Transfer",
      text: "Secure and fast online money transfer for your needs.",
      button: "Send Money",
    },
    {
      image:
        "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?w=1200&auto=compress&cs=tinysrgb",
      title: "All-in-One Online Services",
      text: "From bill payments to document services, we’ve got you covered.",
      button: "Explore Services",
    },
  ];

  // Preload all images for instant display
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  return (
    <div className="w-full h-screen">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
        preloadImages={true}
        watchSlidesProgress
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center flex items-center justify-center text-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 text-white p-6 max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-6">{slide.text}</p>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-lg text-lg font-semibold hover:scale-105 transition-transform duration-300">
                  {slide.button}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
