import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ShopEase
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <Link to="/products" className="hover:text-blue-500">Products</Link>
          <Link to="/about" className="hover:text-blue-500">About</Link>
          <Link to="/contact" className="hover:text-blue-500">Contact</Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="w-6 h-6 text-gray-600 hover:text-blue-500" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              2
            </span>
          </Link>

          {/* Auth Links */}
          {user ? (
            <>
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md">
          <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Home</Link>
          <Link to="/products" className="block px-4 py-2 hover:bg-gray-100">Products</Link>
          <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">About</Link>
          <Link to="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact</Link>
          <Link to="/cart" className="block px-4 py-2 hover:bg-gray-100">Cart</Link>
          {user ? (
            <>
              <span className="block px-4 py-2">{user.name}</span>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
