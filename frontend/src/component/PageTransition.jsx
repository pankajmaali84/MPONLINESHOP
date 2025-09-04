import React from "react";
import { motion } from "framer-motion";

// Reusable wrapper to add smooth page transitions
// Usage: <PageTransition><YourPage /></PageTransition>
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -24, y: -24, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
