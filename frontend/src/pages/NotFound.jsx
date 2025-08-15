// src/pages/404.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-6xl md:text-8xl font-extrabold text-red-500 drop-shadow-lg"
      >
        404
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-4 text-lg md:text-xl text-gray-300 text-center"
      >
        Oops! Page not found.
      </motion.p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-10"
      >
        <button
          onClick={() => navigate("/Home")}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300"
        >
          Go Back Home
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 text-sm text-gray-600"
      >
        It seems you've entered a ghost town 👻
      </motion.div>
    </div>
  );
};

export default NotFound;
