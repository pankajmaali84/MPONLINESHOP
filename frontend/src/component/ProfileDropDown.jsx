import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const profileItems = [
    { name: "Dashboard", path: "/profile/dashboard" },
    { name: "My Profile", path: "/profile/my-profile" },
    { name: "Requested Services", path: "/profile/requested-services" },
    { name: "Reviews", path: "/profile/reviews" },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 hover:text-gray-400 transition duration-300 focus:outline-none"
      >
        <FaUserCircle className="text-xl" />
        <span className="text-red-400">Profile</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg flex flex-col z-50">
          {profileItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-4 py-2 hover:bg-gray-700 transition"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
