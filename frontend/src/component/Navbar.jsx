<<<<<<< HEAD
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropDown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Service", path: "/service" },
    { name: "Contact", path: "/contact" },
    // { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold">
            {/* <Link to="/">MyLogo</Link> */}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-gray-400 transition duration-300"
              >
                {item.name}
              </Link>
            ))}

             <ProfileDropdown/>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-2xl focus:outline-none">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="flex flex-col px-4 py-2 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block py-2 px-2 rounded hover:bg-gray-700 transition"
                onClick={() => setIsOpen(false)} // close menu on click
              >
                {item.name}
              </Link>
            ))}
          
           
          </div>
=======

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
>>>>>>> c3540197e2bbe8cac0011fc08b3e5e83b82e2c2b
        </div>
      )}
    </nav>
  );
};

export default Navbar;
