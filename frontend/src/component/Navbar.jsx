
import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {







    const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const translations = {
    en: {
      welcome: "Welcome",
      home: "Home",
      about: "About",
      contact: "Contact",
      logout: "Logout",
      viewForms: "View All Submitted Forms",
      apply: "Apply Now",
    },
    hi: {
      welcome: "स्वागत है",
      home: "होम",
      about: "जानकारी",
      contact: "संपर्क",
      logout: "लॉगआउट",
      viewForms: "सभी आवेदन देखें",
      apply: "अभी आवेदन करें",
    },
  };

  const t = translations[language];



  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 shadow-lg border-b border-gray-700 ${
        darkMode ? "bg-gradient-to-r from-black via-gray-900 to-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Welcome message */}
      <span className="text-sm md:text-base font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-1.5 rounded-xl shadow-md transform hover:scale-105 transition duration-300 ease-in-out">
        👋 {t.welcome}, <span className="text-yellow-300">{username}</span>
      </span>

      {/* Right Nav Items */}
      <div className="hidden md:flex gap-6 items-center">
        <button onClick={() => navigate("/home")} className="hover:text-purple-400 transition-transform transform hover:scale-105">
          {t.home}
        </button>
        <button onClick={() => alert("About clicked")} className="hover:text-purple-400 transition-transform transform hover:scale-105">
          {t.about}
        </button>
        <button onClick={() => alert("Contact clicked")} className="hover:text-purple-400 transition-transform transform hover:scale-105">
          {t.contact}
        </button>

        {/* Language toggle */}
        <button
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="text-sm px-2 py-1 border rounded border-purple-500 hover:bg-purple-500 hover:text-white transition"
        >
          {language === "en" ? "हिंदी" : "English"}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="transition transform hover:scale-110"
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition transform hover:scale-105 shadow-md"
        >
          {t.logout}
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className={`absolute top-16 left-0 w-full px-6 py-4 z-50 rounded-b-3xl shadow-lg transition-all duration-500 ease-in-out ${
            darkMode
              ? "bg-gradient-to-b from-black via-gray-900 to-black text-white"
              : "bg-gradient-to-b from-white to-gray-200 text-black"
          } flex flex-col gap-4 md:hidden transition-all`}
        >
          <button onClick={() => navigate("/home")}>{t.home}</button>
          <button onClick={() => alert("About clicked")}>{t.about}</button>
          <button onClick={() => alert("Contact clicked")}>{t.contact}</button>
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            className="text-sm px-2 py-1 border rounded w-fit"
          >
            {language === "en" ? "हिंदी" : "English"}
          </button>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 w-fit"
          >
            {t.logout}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
