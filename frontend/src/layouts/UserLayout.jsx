import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DarkModeContext } from '../context/DarkModeContext.jsx';
import { LanguageContext } from '../context/LanguageContext.jsx';

const SidebarLink = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
        isActive ? 'bg-emerald-600 text-white' : 'text-gray-200 hover:bg-gray-700'
      }`
    }
    end
  >
    {icon}
    <span className="truncate">{label}</span>
  </NavLink>
);

export default function UserLayout() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { lang, toggleLang } = useContext(LanguageContext);

  const sidebarVariants = {
    open: { width: 200, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: 56, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (mobile) setOpen(false);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Lock body scroll when mobile drawer is open and allow ESC to close
  useEffect(() => {
    if (isMobile && open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e) => {
        if (e.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [isMobile, open]);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {isMobile && open && (
        <div className="fixed inset-0 z-40 bg-black/40 sm:hidden" onClick={() => setOpen(false)} />
      )}

      <motion.aside
        variants={!isMobile ? sidebarVariants : undefined}
        animate={!isMobile ? (open ? 'open' : 'closed') : undefined}
        style={isMobile ? { width: 280 } : undefined}
        className={`${
          isMobile
            ? `${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 sm:sticky sm:z-auto`
            : 'sticky top-0 left-0'
        } h-screen text-white flex flex-col overflow-y-auto ${darkMode ? 'bg-gray-950' : 'bg-gray-900'}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md hover:bg-gray-800 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
            </div>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-semibold">
                My Account
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="p-3 pb-6 space-y-2">
          <SidebarLink to="/home" label="Home" />
          <SidebarLink to="/service" label="Services" />
          <SidebarLink to="/contact" label="Contact" />
          <div className="mt-3 border-t border-gray-800 pt-3 text-xs uppercase tracking-wide text-gray-400">Account</div>
          <SidebarLink to="/profile/requested-services" label="My Applications" />
          <SidebarLink to="/profile/my-profile" label="My Profile" />
        </nav>

        {isMobile && open && (
          <div className="p-3 mt-auto sm:hidden border-t border-gray-800 space-y-2">
            <button
              onClick={toggleDarkMode}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-100 hover:bg-gray-700"
            >
              {darkMode ? 'Light' : 'Dark'} Mode
            </button>
            <button
              onClick={toggleLang}
              className="w-full px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-100 hover:bg-gray-700"
            >
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('auth:changed'));
                navigate('/login');
              }}
              className="w-full px-3 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </motion.aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className={`h-16 border-b flex items-center justify-between px-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <button className="sm:hidden p-2 rounded-md border border-gray-300 dark:border-gray-700" onClick={() => setOpen(true)} aria-label="Open sidebar">
              <div className="space-y-1">
                <span className={`block w-5 h-0.5 ${darkMode ? 'bg-gray-200' : 'bg-gray-800'}`} />
                <span className={`block w-5 h-0.5 ${darkMode ? 'bg-gray-200' : 'bg-gray-800'}`} />
                <span className={`block w-5 h-0.5 ${darkMode ? 'bg-gray-200' : 'bg-gray-800'}`} />
              </div>
            </button>
            <h1 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {location.pathname.startsWith('/home') && 'Home'}
              {location.pathname.startsWith('/service') && 'Services'}
              {location.pathname.startsWith('/contact') && 'Contact'}
              {location.pathname.includes('requested-services') && 'My Applications'}
              {location.pathname.includes('my-profile') && 'My Profile'}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className={`px-3 py-1.5 rounded-md text-sm ${darkMode ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {darkMode ? 'Light' : 'Dark'} Mode
            </button>
            <button
              onClick={toggleLang}
              className={`px-3 py-1.5 rounded-md text-sm ${darkMode ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('auth:changed'));
                navigate('/login');
              }}
              className={`px-3 py-1.5 rounded-md text-sm ${darkMode ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-600 text-white hover:bg-red-500'}`}
            >
              Logout
            </button>
          </div>
        </div>
        <div className={`p-4 ${darkMode ? 'text-gray-100' : ''}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
