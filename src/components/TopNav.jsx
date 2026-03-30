import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/tourist/login", label: "Tourist" },
    { path: "/police/login", label: "Police" },
    { path: "/admin/id-issue", label: "Admin" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition"
        >
          🧭 Smart Tourist Safety
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition ${
                isActive(link.path)
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.label}

              {/* Active underline */}
              {isActive(link.path) && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-600 rounded"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className="hidden md:flex items-center gap-4">

          {/* Notification */}
          <button className="relative text-gray-600 hover:text-blue-600 transition">
            🔔
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              3
            </span>
          </button>

          {/* Login Button */}
          <Link
            to="/tourist/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition shadow"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-60 border-t" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-5 py-4 space-y-3 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${
                isActive(link.path)
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/tourist/login"
            className="bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
