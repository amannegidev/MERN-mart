// MainHeader.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <header className="bg-gray-900 hidden sm:block ">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between ">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white no-underline">
          MERN-<span className="text-yellow-400">mart</span>
        </Link>

        {/* Nav Links */}
        <nav className="space-x-4">
          <Link to="/" className="text-white hover:text-blue-600 no-underline">
            Home
          </Link>
          <Link to="/shop" className="text-white hover:text-blue-600 no-underline">
            Shop
          </Link>
          <Link to="/contact" className="text-white hover:text-blue-600 no-underline">
            Contact
          </Link>
        </nav>

        {/* User/Cart Actions */}
        <div className="space-x-4">
          <Link to="/cart" className="text-white hover:text-blue-600 no-underline">
            Cart
          </Link>
          <Link to="/login" className="text-white hover:text-blue-600 no-underline">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
