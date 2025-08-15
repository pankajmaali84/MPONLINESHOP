import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
 const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      setMessage(response.data.message || 'Login successful');

      // Save token if needed:
      localStorage.setItem('token', response.data.token);

      // Redirect or navigate if necessary
      // window.location.href = '/dashboard';
         navigate('/home');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <form 
    //     onSubmit={handleSubmit}
    //     className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
    //   >
    //     <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

    //     {message && <p className="text-sm text-center text-red-500 mb-4">{message}</p>}

    //     <input
    //       type="email"
    //       name="email"
    //       placeholder="Email"
    //       className="w-full p-2 border rounded mb-4"
    //       value={formData.email}
    //       onChange={handleChange}
    //       required
    //     />

    //     <input
    //       type="password"
    //       name="password"
    //       placeholder="Password"
    //       className="w-full p-2 border rounded mb-4"
    //       value={formData.password}
    //       onChange={handleChange}
    //       required
    //     />

    //     <button
    //       type="submit"
    //       className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
    //     >
    //       Login
    //     </button>
    //   </form>
    // </div>
    <>
  

 <div className="bg-white dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side Image */}
        <div
          className="w-full lg:w-2/3 h-64 lg:h-auto bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <div className="flex items-center justify-center h-full px-6 bg-gray-900 bg-opacity-60">
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
                Login to your account
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Access your dashboard and services
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="relative mt-4">
                <input
                  type="email"
                  name="email"
                    value={formData.email}
                    onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 py-2"
                  placeholder="Email address"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-sm text-gray-600 dark:text-gray-300 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  Email Address
                </label>
              </div>

              {/* Password Field */}
              <div className="relative mt-6">
                <input
                  type="password"
                  name="password"
                   value={formData.password}
                   onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 py-2"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-sm text-gray-600 dark:text-gray-300 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  Password
                </label>
              </div>

              {/* Login Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-white/10 backdrop-blur-md text-blue-400 border border-blue-500 rounded-lg font-semibold shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                  Login
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-400">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="relative inline-block text-blue-400 transition-all duration-300 hover:text-blue-500 hover:scale-100"
              >
                <span className="relative z-10 font-semibold">Register</span>
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
