import { useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropDown";
import { DarkModeContext } from "../context/DarkModeContext.jsx";
import { LanguageContext } from "../context/LanguageContext.jsx";
import { toast } from "react-hot-toast";
import { showCenterPopup } from "./CenterPopup";
import { getRoleFromToken } from "../utils/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { lang, toggleLang, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const role = useMemo(() => getRoleFromToken(token), [token]);

  const showLogoutCenter = () => {
    showCenterPopup({
      title: 'Logged out',
      subtitle: 'You have been signed out.',
      colorClass: 'text-red-400',
      duration: 1200,
    });
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
    } catch (_) {}
    // notify app about auth change
    try { window.dispatchEvent(new Event('auth:changed')); } catch {}
    showLogoutCenter();
    setTimeout(() => navigate('/login'), 1000);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const baseMenu = [
    { key: "home", path: "/" },
    { key: "about", path: "/about" },
    { key: "services", path: "/service" },
    { key: "contact", path: "/contact" },
  ];
  const menuItems = role === 'admin' ? [...baseMenu, { key: 'admin', path: '/admin' }] : baseMenu;

  return (
    <>
      <nav className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white shadow-md fixed w-full z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="text-2xl font-bold">
              {/* <Link to="/">MyLogo</Link> */}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              {isLoggedIn && (
                <>
                  {menuItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.path}
                      className="hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </>
              )}

              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    className="hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="hover:text-gray-600 dark:hover:text-gray-400 transition duration-300"
                  >
                    {t('register')}
                  </Link>
                </>
              )}

              {isLoggedIn && <ProfileDropdown />}

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded bg-red-500/10 text-red-500 border border-red-500/40 hover:bg-red-500 hover:text-white transition-colors"
                  title="Logout"
                >
                  {t('logout')}
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                title={darkMode ? t("switch_to_light") : t("switch_to_dark")}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="ml-2 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm"
                title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              >
                {lang === 'en' ? 'हिंदी' : 'EN'}
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-2xl focus:outline-none"
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 transition-colors">
            <div className="flex flex-col px-4 py-2 space-y-2">
              {isLoggedIn && (
                <>
                  {menuItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.path}
                      className="block py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </>
              )}

              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    className="block py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </>
              )}

              {/* Theme Toggle in Mobile */}
              <button
                onClick={() => { toggleDarkMode(); setIsOpen(false); }}
                className="w-full text-left block py-2 px-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? t('switch_to_light') : t('switch_to_dark')}
              </button>

              {/* Language Toggle (Mobile) */}
              <button
                onClick={() => { toggleLang(); setIsOpen(false); }}
                className="w-full text-left block py-2 px-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              >
                {lang === 'en' ? 'हिंदी' : 'EN'}
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left block py-2 px-2 rounded bg-red-500/10 text-red-500 border border-red-500/40 hover:bg-red-500 hover:text-white transition-colors"
                >
                  {t('logout')}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
