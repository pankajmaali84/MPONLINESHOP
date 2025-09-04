import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { showCenterPopup } from "./CenterPopup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext.jsx";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useContext(LanguageContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'email' ? value.trim() : value });
  };

  const showCenterWelcome = (name = 'User', message = 'Registration successful ✅') => {
    showCenterPopup({
      title: message,
      subtitle: `Welcome, <span class=\"font-semibold\">${name}</span> 🎉`,
      colorClass: 'text-green-400',
      duration: 1600,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const API = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await axios.post(
        `${API}/api/auth/register`,
        form
      );


      const token = response.data.token;
  

      localStorage.setItem("token", token);
      try { window.dispatchEvent(new Event('auth:changed')); } catch {}
  
      console.log("Server response:", response.data);
      const name = response.data?.user?.name || form.name || 'User';
      showCenterWelcome(name, "Registration successful ✅");

      // Optional: clear the form
      setForm({ name: "", email: "", password: "" });
      navigate("/home");
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Registration failed ❌");
    }
    console.log("Form Data:", form);
  };

  return (
    <>
      <style>
        {`
    input:-webkit-autofill {
      box-shadow: 0 0 0px 1000px transparent inset !important;
      -webkit-text-fill-color: white !important;
      transition: background-color 5000s ease-in-out 0s;
    }
       input[type="password"]::-ms-reveal,
    input[type="password"]::-ms-clear {
      display: none;
    }

    input[type="password"]::-webkit-credentials-auto-fill-button {
      visibility: hidden;
      display: none !important;
      pointer-events: none;
    }

    input[type="password"]::after {
      display: none !important;
    }
  `}
      </style>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <div className="dark bg-gray-950 text-gray-100">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Side Image & Text */}
          <div
            className="w-full lg:w-2/3 h-64 lg:h-auto bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80)",
            }}
          >
            <div className="flex items-center justify-center h-full px-6 bg-gradient-to-b from-black/70 to-black/50">
              <div className="transition duration-500 ease-in-out transform hover:scale-105 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white animate-bounce">
                  <span className="block">Welcome to</span>
                  <span className="block text-blue-400 text-shadow-3d">
                    One Portal. Every Service.
                  </span>
                </h2>
                <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-200 max-w-xl mx-auto">
                  Apply for PAN cards, certificates, college admissions, bank
                  services & all government and private services — in one place.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="flex items-center w-full px-4 sm:px-6 py-10 lg:py-0 lg:w-1/3">
            <div className="flex-1 max-w-md w-full mx-auto bg-gray-900/60 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/5">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                  <img
                    className="w-auto h-8"
                    src="https://merakiui.com/images/logo.svg"
                    alt="Logo"
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  {t('create_account')}
                </h1>
                <p className="mt-1 text-sm text-gray-300">
                  Start your journey with all online services
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="relative mt-4">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    spellCheck={false}
                    className="peer w-full bg-transparent border-0 border-b-2 border-gray-600 text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 rounded-none py-2"
                    placeholder="Username"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all duration-200 ease-out peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                  >
                    Username
                  </label>
                </div>

                <div className="relative mt-4">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    inputMode="email"
                    spellCheck={false}
                    className="peer w-full bg-transparent text-white border-0 border-b-2 border-gray-600 placeholder-transparent focus:outline-none focus:border-blue-400 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 rounded-none py-2"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all duration-200 ease-out peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                  >
                    {t('email')}
                  </label>
                </div>

                <div className="relative mt-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="peer w-full bg-transparent border-0 border-b-2 border-gray-600 text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 rounded-none py-2 pr-10 appearance-none"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all duration-200 ease-out peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                  >
                    {t('password')}
                  </label>

                  {/* Password dikhane/chhupane ka icon (white color) */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-lg focus:outline-none"
                  >
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>

                {/* Register Button */}
                <div className="mt-6 justify-center flex">
                  <button className="px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/60 rounded-lg font-semibold shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50">
                    {t('register')}
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-300">
                {t('already_have_account')} {" "}
                <Link
                  to="/login"
                  className="relative inline-block text-blue-400 transition-all duration-300 hover:text-blue-500 hover:scale-100"
                >
                  <span className="relative z-10 font-semibold">{t('login')}</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
