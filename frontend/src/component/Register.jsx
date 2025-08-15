import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );


      const token = response.data.token;
  

      localStorage.setItem("token", token);
  
      console.log("Server response:", response.data);
      alert("User registered successfully ✅");

      // Optional: clear the form
      setForm({ name: "", email: "", password: "" });
      navigate("/home");
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Registration failed ❌");
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

      <div className="bg-white dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Side Image & Text */}
          <div
            className="w-full lg:w-2/3 h-64 lg:h-auto bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80)",
            }}
          >
            <div className="flex items-center justify-center h-full px-6 bg-gray-900 bg-opacity-60">
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
          <div className="flex items-center w-full px-6 py-10 lg:py-0 lg:w-1/3">
            <div className="flex-1">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                  <img
                    className="w-auto h-8"
                    src="https://merakiui.com/images/logo.svg"
                    alt="Logo"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">
                  Create Account
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Start your journey with all online services
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="relative mt-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 py-2"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-0 -top-3.5 text-sm text-gray-600 dark:text-gray-300 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
                  >
                    Username
                  </label>
                </div>

                <div className="relative mt-4">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="peer w-full bg-transparent text-white border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-blue-500 py-2"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-sm text-gray-600 dark:text-gray-300 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
                  >
                    Email Address
                  </label>
                </div>

                <div className="relative mt-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 py-2 pr-10 appearance-none"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-sm text-gray-600 dark:text-gray-300 transition-all 
      peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
      peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
                  >
                    Password
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
                  <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-blue-400 border border-blue-500 rounded-lg font-semibold shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300">
                    Register
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="relative inline-block text-blue-400 transition-all duration-300 hover:text-blue-500 hover:scale-100"
                >
                  <span className="relative z-10 font-semibold">
                    Login here
                  </span>
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
