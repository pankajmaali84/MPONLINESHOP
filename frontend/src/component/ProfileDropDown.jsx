import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { LanguageContext } from "../context/LanguageContext.jsx";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useContext(LanguageContext);

  const profileItems = [
    // { name: t('profile_dashboard'), path: "/profile/dashboard" }, // temporarily disabled
    { name: t('profile_my_profile'), path: "/profile/my-profile" },
    { name: t('profile_requested_services'), path: "/profile/requested-services" },
    { name: t('profile_reviews'), path: "/profile/reviews" },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-400 transition duration-300 focus:outline-none"
      >
        <FaUserCircle className="text-xl" />
        <span className="text-red-500 dark:text-red-400">{t('profile')}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded shadow-lg flex flex-col z-50 border border-gray-200 dark:border-gray-700">
          {profileItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
