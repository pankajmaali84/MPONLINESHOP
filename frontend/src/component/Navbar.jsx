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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
