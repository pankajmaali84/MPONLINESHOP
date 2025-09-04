import React from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';

// Simple portal-based center popup
export function showCenterPopup({
  title = 'Success',
  subtitle = '',
  colorClass = 'text-green-400',
  duration = 1600,
} = {}) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const Popup = () => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-lg" />
        {/* Glassy card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="relative w-[90%] h-[45%] max-w-sm rounded-2xl bg-white/10 backdrop-blur-lg text-white shadow-2xl border border-white/20 p-6 text-center"
        >
          <div className={`text-2xl font-bold ${colorClass}`}>{title}</div>
          {subtitle ? (
            <div className="mt-1 text-gray-200" dangerouslySetInnerHTML={{ __html: subtitle }} />
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  root.render(<Popup />);

  setTimeout(() => {
    try { root.unmount(); } catch {}
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, duration);
}
