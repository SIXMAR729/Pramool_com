import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Auction", path: "/auction" },
    { name: "Classified", path: "/classified" },
    { name: "Member", path: "/member" },
    { name: "Discuss", path: "/discuss" },
    { name: "FAQ", path: "/faq" },
    { name: "Webboard", path: "/webboard" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top section: Logo and User Info */}
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* UPDATED: SVG icon to look like a gavel/hammer */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M0 0 C10.56 0 21.12 0 32 0 C32 10.56 32 21.12 32 32 C21.44 32 10.88 32 0 32 C0 21.44 0 10.88 0 0 Z " fill="#FBFBFB" transform="translate(0,0)" />
              <path d="M0 0 C1.82421875 1.609375 1.82421875 1.609375 3.6875 3.75 C4.31011719 4.44609375 4.93273438 5.1421875 5.57421875 5.859375 C7 8 7 8 7 12 C4.5 14.75 4.5 14.75 2 17 C-1.21524305 15.59155282 -3.32183868 13.89655214 -5.75 11.375 C-6.36359375 10.74335938 -6.9771875 10.11171875 -7.609375 9.4609375 C-8.06828125 8.97882812 -8.5271875 8.49671875 -9 8 C-6.96659935 3.69822796 -5.14272912 0 0 0 Z " fill="#090909" transform="translate(21,3)" />
              <path d="M0 0 C1.28132813 0.00902344 2.56265625 0.01804688 3.8828125 0.02734375 C4.87023437 0.03894531 5.85765625 0.05054688 6.875 0.0625 C8.10190583 13.45622197 8.10190583 13.45622197 5.09375 17.39453125 C3.07488093 18.85536785 1.14634623 20.04343618 -1.125 21.0625 C-0.43121489 17.80238358 0.33393991 16.27211747 2.875 14.0625 C1.70174357 11.18268877 0.49561333 9.68311333 -1.75 7.4375 C-2.53375 6.65375 -3.3175 5.87 -4.125 5.0625 C-4.125 4.4025 -4.125 3.7425 -4.125 3.0625 C-6.75401288 4.58456009 -8.96865964 5.90615964 -11.125 8.0625 C-12.115 7.7325 -13.105 7.4025 -14.125 7.0625 C-9.32658824 1.1276223 -7.92151819 -0.0720138 0 0 Z " fill="#F5F5F5" transform="translate(25.125,-0.0625)" />
              <path d="M0 0 C1.32 0 2.64 0 4 0 C4 0.66 4 1.32 4 2 C3.34 2 2.68 2 2 2 C1.67 3.32 1.34 4.64 1 6 C0.34 6 -0.32 6 -1 6 C-1 6.66 -1 7.32 -1 8 C-2.32 7.34 -3.64 6.68 -5 6 C-5 5.34 -5 4.68 -5 4 C-4.0409375 3.8453125 -4.0409375 3.8453125 -3.0625 3.6875 C-2.381875 3.460625 -1.70125 3.23375 -1 3 C-0.67 2.01 -0.34 1.02 0 0 Z " fill="#6F6F6F" transform="translate(7,22)" />
              <path d="M0 0 C0.99 0 1.98 0 3 0 C2 3 2 3 0 6 C-1.32 6 -2.64 6 -4 6 C-4 5.34 -4 4.68 -4 4 C-3.34 4 -2.68 4 -2 4 C-1.34 2.68 -0.68 1.36 0 0 Z " fill="#848484" transform="translate(14,15)" />
              <path d="M0 0 C0.33 1.32 0.66 2.64 1 4 C-1.97 6.475 -1.97 6.475 -5 9 C-4.42647107 5.12867972 -2.51295648 2.91827204 0 0 Z " fill="#949494" transform="translate(29,12)" />
              <path d="M0 0 C2.3125 0.1875 2.3125 0.1875 4 1 C-0.39453125 5.00390625 -0.39453125 5.00390625 -2 6 C-2.99 5.67 -3.98 5.34 -5 5 C-2.75 2.4375 -2.75 2.4375 0 0 Z " fill="#949494" transform="translate(16,2)" />
            </svg>
            <span className="text-2xl sm:text-3xl font-bold text-orange-500">Pramool.com</span>
          </div>

          {/* Desktop User Info / Login Link */}
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
            {user ? (
              <>
                <span>Welcome, <span className="font-bold">{user.username}</span></span>
                <button onClick={logout} className="text-orange-500 hover:underline">Logout</button>
              </>
            ) : (
              <NavLink to="/login" className="text-orange-500 hover:underline">Login</NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && <span className="text-sm font-semibold text-gray-700">Welcome, {user.username}</span>}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <XMarkIcon className="h-8 w-8 text-gray-700" /> : <Bars3Icon className="h-8 w-8 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <div className="hidden md:block relative bg-orange-500 h-8">
        <div className="absolute bottom-0 left-0 w-24 h-16 bg-white" style={{ clipPath: 'path("M 0 64 Q 50 64 60 32 Q 70 0 100 0 L 100 64 L 0 64 Z")' }}></div>
        <nav className="h-full flex items-center pl-24">
          {navItems.map((item, index) => (
            <React.Fragment key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-bold transition-colors duration-200 ${isActive || (item.path === "/" && location.pathname === "/") ? 'bg-white text-orange-500' : 'text-white hover:bg-white hover:text-orange-500'
                  }`
                }
              >
                {item.name}
              </NavLink>
              {index < navItems.length - 1 && <span className="text-white">|</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <nav className="flex flex-col items-center py-4 bg-gray-50 border-t">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMobileMenu}
              className="py-2 text-gray-700 hover:bg-gray-200 w-full text-center"
            >
              {item.name}
            </NavLink>
          ))}
          <div className="border-t w-full my-2"></div>
          {/* Mobile User Info / Login */}
          <div className="py-2 w-full text-center">
            {user ? (
              <button onClick={() => { logout(); closeMobileMenu(); }} className="text-red-500 font-bold">Logout</button>
            ) : (
              <NavLink to="/login" onClick={closeMobileMenu} className="orange-blue-600 font-bold">Login</NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
