import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LanguageContext } from '../context/LanguageContext.jsx';
import LoadingOverlay from './LoadingOverlay';

const Login = () => {
  const { t } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'email' ? value.trim() : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await axios.post(`${API}/api/auth/login`, formData);
      setMessage(response.data.message || 'Login successful');
      
      // Save token and notify app about auth change
      localStorage.setItem('token', response.data.token);
      try { window.dispatchEvent(new Event('auth:changed')); } catch {}

      // Direct navigation without popup
      setTimeout(() => {
        setIsLoading(false);
        navigate('/home');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      const msg = error.response?.data?.message || 'Login failed';
      setMessage(msg);
      toast.error(msg);
    }
  };

  return (

<>
      <LoadingOverlay isLoading={isLoading} message="Logging you in..." />
      
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      
 <div className="dark bg-gray-950 text-gray-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side Image */}
        <div
          className="w-full lg:w-2/3 h-64 lg:h-auto bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <div className="flex items-center justify-center h-full px-6 bg-gradient-to-b from-black/70 to-black/50">
            <div className="transition duration-500 transform hover:scale-105 text-center">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white animate-bounce">
                <span className="block">Welcome Back</span>
                <span className="block text-blue-400 text-shadow-3d">
                  One Portal. Every Service.
                </span>
              </h2>
              <p className="mt-4 text-gray-200 max-w-xl mx-auto">
                Login to access all online services from one place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="flex items-center w-full px-4 sm:px-6 py-10 lg:py-0 lg:w-1/3">
          <div className="flex-1 max-w-md w-full mx-auto bg-gray-900/60 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/5">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img
                  className="w-auto h-8"
                  src="https://merakiui.com/images/logo.svg"
                  alt="Logo"
                />
              </div>
              {/* Forgot Password Link */}
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {t('login_to_account')}
              </h1>
              <p className="mt-1 text-sm text-gray-300">
                Access your dashboard and services
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="relative mt-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  className="peer w-full bg-transparent border-0 border-b-2 border-gray-600 text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 rounded-none py-2"
                  placeholder="Email address"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all duration-200 ease-out peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                >
                  {t('email')}
                </label>
              </div>

              {/* Password Field */}
              <div className="relative mt-6">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="peer w-full bg-transparent border-0 border-b-2 border-gray-600 text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus-visible:outline-none focus:ring-0 focus-visible:ring-0 rounded-none py-2 pr-10"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-sm text-gray-300 transition-all duration-200 ease-out peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                >
                  {t('password')}
                </label>
                
                {/* Password Show/Hide Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
                </button>
              </div>

              {/* Login Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/60 rounded-lg font-semibold shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                  {t('login')}
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-300">
              {t('dont_have_account')} {" "}
              <Link
                to="/register"
                className="relative inline-block text-blue-400 transition-all duration-300 hover:text-blue-500 hover:scale-100"
              >
                <span className="relative z-10 font-semibold">{t('register')}</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default Login;