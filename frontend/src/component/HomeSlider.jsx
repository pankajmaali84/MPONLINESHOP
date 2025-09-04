import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css/bundle";
import { LanguageContext } from "../context/LanguageContext.jsx";

export default function HomeSlider() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const slides = [
    {
      image:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=1200&auto=compress&cs=tinysrgb",
      title: t('home_slide1_title'),
      text: t('home_slide1_text'),
      button: t('home_slide1_button'),
    },
    {
      image:
        "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?w=1200&auto=compress&cs=tinysrgb",
      title: t('home_slide2_title'),
      text: t('home_slide2_text'),
      button: t('home_slide2_button'),
    },
    {
      image:
        "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?w=1200&auto=compress&cs=tinysrgb",
      title: t('home_slide3_title'),
      text: t('home_slide3_text'),
      button: t('home_slide3_button'),
    },
  ];

  // Preload all images for instant display
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, [slides]);

  return (
    <div className="w-full h-screen">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop
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
              <motion.div
                className="relative z-10 text-white p-6 max-w-2xl"
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl mb-6">{slide.text}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 rounded-md text-base font-semibold transition-transform duration-300"
                  onClick={() => {
                    if (index === 2) {
                      navigate("/service");
                    }
                  }}
                >
                  {slide.button}
                </motion.button>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}