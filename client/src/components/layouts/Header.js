import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import { Badge } from "antd";

const Header = () => {
  const { cart, setCart } = useCart();
  const [auth, setAuth] = useAuth();

  const [isDropdownOpen, setIsDropdownOpen]   = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);   // NEW

  const navigate = useNavigate();

  /* ─── handlers ─── */
  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    setCart([]);
    localStorage.removeItem("cart");
    navigate("/login");
    toast.dismiss();
    toast.success("Logout successfully");
  };

  const toggleDropdown   = () => { setIsDropdownOpen(!isDropdownOpen); setIsMobileMenuOpen(false); };
  const toggleMobileMenu = () => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsDropdownOpen(false); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/search?q=${searchTerm}`);
  };

  /* ─── JSX ─── */
  return (
    <nav className="bg-green-600 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-0">
        {/* ───── Left: brand + desktop nav ───── */}
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-bold text-white no-underline">
            MERN<span className="text-gray-100">Mart</span>
          </Link>

          <div className="hidden lg:flex gap-14 text-white text-lg font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "text-gray-300 font-semibold" : "hover:text-gray-200 text-white"} no-underline`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `${isActive ? "text-gray-300 font-semibold" : "hover:text-gray-200 text-white"} no-underline`
              }
            >
              All Products
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${isActive ? "text-gray-300 font-semibold" : "hover:text-gray-200 text-white"} no-underline`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${isActive ? "text-gray-300 font-semibold" : "hover:text-gray-200 text-white"} no-underline`
              }
            >
              Contact
            </NavLink>
          </div>
        </div>

        {/* ───── Right actions ───── */}
        <div className="flex items-center gap-4">
          {/* desktop search */}
          <div className="relative hidden sm:block">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchTerm}
                placeholder="Search products..."
                className="px-3 py-2 rounded-l-md focus:outline-none text-gray-800"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-white px-3 py-2 rounded-r-md hover:bg-gray-100 focus:outline-none"
                aria-label="Search"
              >
                <i className="bi bi-search text-gray-700" />
              </button>
            </form>
          </div>

          {/* mobile search trigger */}
          <button
            type="button"
            className="sm:hidden text-white text-xl"
            aria-label="Search"
            onClick={() => setMobileSearchOpen(true)}
          >
            <i className="bi bi-search" />
          </button>

          {/* cart */}
          <Badge count={cart?.length} showZero>
            <NavLink to="/cart" className="text-white text-lg no-underline">
              <i className="bi bi-cart-fill" />
            </NavLink>
          </Badge>

          {/* auth / profile */}
          {auth?.user ? (
            <div className="relative w-max">
              <button
                onClick={toggleDropdown}
                className="px-4 py-2 rounded text-white text-sm font-medium bg-green-700 hover:bg-green-800 active:bg-green-700 flex items-center gap-2 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <img
                  src={
                    auth.user.profilePic?.startsWith("http")
                      ? auth.user.profilePic
                      : `http://localhost:8000${auth.user.profilePic || ""}`
                  }
                  alt="Profile"
                  className="h-7 w-7 rounded-full border border-white object-cover shadow-sm"
                />
                <span className="hidden md:inline">{auth.user.name?.split(" ")[0]}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-white inline ml-1" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 14.5a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L12 12.086l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 12 14.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 shadow-lg bg-white py-2 z-50 w-44 rounded max-h-96 overflow-auto animate-fade-in"
                  role="menu"
                  aria-label="User menu"
                >
                  <li>
                    <NavLink
                      to={`/dashboard/${auth.user.role === 1 ? "admin" : "user"}`}
                      className="block py-2.5 px-4 hover:bg-green-50 text-slate-900 text-sm font-medium no-underline"
                      role="menuitem"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2.5 px-4 hover:bg-red-50 text-slate-900 text-sm font-medium"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex gap-3">
              <NavLink
                to="/register"
                className="px-3 py-1 text-black border border-white rounded hover:bg-white hover:text-green-950 transition no-underline"
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="px-3 py-1 text-black border border-white rounded hover:bg-white hover:text-green-950 transition no-underline"
              >
                Login
              </NavLink>
            </div>
          )}

          {/* mobile menu toggle */}
          <button
            className="lg:hidden text-white text-2xl focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {/* mobile nav links */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white text-gray-700 px-6 py-4 space-y-3 shadow-inner">
          <NavLink to="/" className="block hover:text-green-600 no-underline" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="block hover:text-green-600 no-underline"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            All Products
          </NavLink>
          <NavLink
            to="/about"
            className="block hover:text-green-600 no-underline"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="block hover:text-green-600 no-underline"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </NavLink>

          {!auth?.user ? (
            <>
              <NavLink
                to="/register"
                className="block hover:text-green-600 no-underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="block hover:text-green-600 no-underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={`/dashboard/${auth.user.role === 1 ? "admin" : "user"}`}
                className="block hover:text-green-600 no-underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left hover:text-green-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* ───── mobile search modal ───── */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSearchOpen(false)} />
          {/* bar */}
          <div className="absolute top-0 left-0 right-0 bg-white shadow-md p-3 flex gap-2">
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setMobileSearchOpen(false);
              }}
              className="flex-grow flex"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                placeholder="Search products…"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none text-gray-800"
              />
              <button
                type="submit"
                className="bg-green-600 px-3 py-2 rounded-r-md text-white"
                aria-label="Go"
              >
                <i className="bi bi-search" />
              </button>
            </form>
            <button
              type="button"
              className="text-gray-600 text-2xl"
              aria-label="Close"
              onClick={() => setMobileSearchOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
