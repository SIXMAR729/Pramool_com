import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Auction", path: "/auction" },
    { name: "Classified", path: "/classified" },
    { name: "Member", path: "/member" },
    { name: "Discuss", path: "/discuss" },
    { name: "FAQ", path: "/faq" },
    { name: "Webboard", path: "/webboard" },
  ];

  return (
    <header className="relative bg-orange-500 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="bg-orange-600 px-4 py-1">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>Free service Thai online auction</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hover:text-orange-200">contact webmaster</button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">JAROOL.COM</div>
            <div className="text-sm opacity-90">SIXMAR729.com - ภาพเหมือน</div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

{/* Desktop Navigation */}
<nav className="bg-orange-400 hidden md:block">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex space-x-1">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="px-4 py-2 text-sm font-medium hover:bg-orange-300 transition-colors"
        >
          {item.name}
        </Link>
      ))}
    </div>
  </div>
</nav>

{/* Mobile Dropdown Navigation*/}
<nav
  className={`bg-orange-400 md:hidden px-4 overflow-hidden transition-all duration-1000 ease-in-out ${
    menuOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
  }`}
>
  <div className="flex flex-col space-y-1">
    {navItems.map((item) => (
      <Link
        key={item.name}
        to={item.path}
        className="text-left px-4 py-2 text-sm font-medium hover:bg-orange-300 transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        {item.name}
      </Link>
    ))}
  </div>
</nav>
      

      {/* Right-side Wave */}
      <svg
        className="absolute right-0 top-0 h-full w-32 -z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C50,50 50,50 0,100 L100,100 L100,0 Z -z-10"
          fill="white"
          opacity="0.1"
        />
      </svg>
    </header>
  );
};

export default Header;
