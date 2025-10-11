import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingOverlay = ({ isLoading, message = "Loading..." }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Blurred Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          
          {/* Loading Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.4 
            }}
            className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center min-w-[300px]"
          >
            {/* Animated Loading Spinner */}
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="w-16 h-16 mx-auto border-4 border-blue-500/20 border-t-blue-500 rounded-full"
              />
              
              {/* Inner spinning dots */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full opacity-80" />
              </motion.div>
            </div>

            {/* Loading Text with typing animation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-400">
                {message}
              </h3>
              
              {/* Animated dots */}
              <div className="flex items-center justify-center space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: 0 
                  }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: 0.2 
                  }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: 0.4 
                  }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </motion.div>

            {/* Optional progress bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="mt-6 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full overflow-hidden"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="h-full w-1/3 bg-white/40 blur-sm"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;