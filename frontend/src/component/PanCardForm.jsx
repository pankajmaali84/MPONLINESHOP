import React, { useState } from "react";

export default function StylishForm() {
  const [formData, setFormData] = useState({
    username: "",
    parentName: "",
    dob: "",
    aadhar: "",
    email: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form Submitted Successfully!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 bg-white dark:bg-gray-900 transition-colors"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg transition-colors">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          User Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "User Name", name: "username", type: "text" },
            { label: "Parent Name", name: "parentName", type: "text" },
            { label: "Date of Birth", name: "dob", type: "date" },
            {
              label: "Aadhaar Card Number",
              name: "aadhar",
              type: "text",
              maxLength: "12",
              pattern: "\\d{12}",
            },
            { label: "Email", name: "email", type: "email" },
            {
              label: "Mobile Number",
              name: "mobile",
              type: "tel",
              maxLength: "10",
              pattern: "\\d{10}",
            },
          ].map((field, index) => (
            <div key={index} className="relative">
              <input
                {...field}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-2 pt-5 pb-2 focus:border-blue-500 focus:outline-none transition-all text-gray-900 dark:text-gray-100"
                required
              />
              <label className="absolute left-2 top-2.5 text-gray-500 dark:text-gray-300 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-blue-500 peer-focus:text-sm">
                {field.label}
              </label>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
