import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DarkModeContext } from '../context/DarkModeContext.jsx';

const SidebarLink = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
        isActive ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-700'
      }`
    }
    end
  >
    {icon}
    <span className="truncate">{label}</span>
  </NavLink>
);

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const sidebarVariants = {
    open: { width: 200, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: 56, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  // Detect mobile and collapse sidebar by default on small screens
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

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Backdrop for mobile drawer */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar: on mobile it's a sliding drawer; on desktop it resizes */}
      <motion.aside
        variants={!isMobile ? sidebarVariants : undefined}
        animate={!isMobile ? (open ? 'open' : 'closed') : undefined}
        style={isMobile ? { width: 260 } : undefined}
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
              {/* simple hamburger icon */}
              <div className="space-y-1">
                <span className="block w-6 h-0.5 bg-white" />
                <span className="block w-6 h-0.5 bg-white" />
                <span className="block w-6 h-0.5 bg-white" />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-semibold"
                >
                  Admin Panel
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <nav className="p-3 space-y-2">
            <SidebarLink to="/admin" label="Overview" />
            <SidebarLink to="/admin/users" label="Users" />
            <SidebarLink to="/admin/orders" label="Orders" />
          </nav>

          {/* Mobile controls (dark mode + logout) - only visible when drawer open */}
          {isMobile && open && (
            <div className="p-3 mt-auto sm:hidden border-t border-gray-800 space-y-2">
              <button
                onClick={toggleDarkMode}
                className="w-full px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-100 hover:bg-gray-700"
              >
                {darkMode ? 'Light' : 'Dark'} Mode
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

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className={`h-16 border-b flex items-center justify-between px-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            {/* Topbar hamburger for mobile */}
            <button
              className="sm:hidden p-2 rounded-md border border-gray-300 dark:border-gray-700"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              <div className="space-y-1">
                <span className={`block w-5 h-0.5 ${darkMode ? 'bg-gray-200' : 'bg-gray-800'}`} />
                <span className={`block w-5 h-0.5 ${darkMode ? 'bg-gray-200' : 'bg-gray-800'}`} />
                <span className={`block w-5 h-0.5 ${darkMode ? 'bg-gray-200' : 'bg-gray-800'}`} />
              </div>
            </button>
            <h1 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {location.pathname === '/admin' ? 'Overview' : location.pathname.split('/').slice(-1)[0]}
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
