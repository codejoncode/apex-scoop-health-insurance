'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">

        {/* Brand lockup */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
          <Image
            src="/logo.svg"
            alt="ApexScoop shield"
            width={32}
            height={37}
            className="flex-shrink-0"
            priority
          />
          <div className="leading-none">
            <div className="text-lg sm:text-xl font-black tracking-tight">
              <span className="text-blue-800">Apex</span>
              <span className="text-cyan-600">Scoop</span>
            </div>
            <div className="text-[9px] font-semibold text-gray-400 tracking-[0.18em] uppercase">
              Insurance Services
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/#webinars" className="text-gray-600 hover:text-blue-700 font-medium text-sm transition-colors">
            Free Webinars
          </a>
          <a href="/#consultation" className="text-gray-600 hover:text-blue-700 font-medium text-sm transition-colors">
            Contact
          </a>
          <a
            href="/#consultation"
            className="bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            Free Consultation
          </a>
          {isLoggedIn ? (
            <>
              <Link href="/admin/dashboard" className="text-gray-500 hover:text-blue-700 text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/admin/login" className="text-gray-300 hover:text-gray-500 text-xs transition-colors">
              Admin
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1 text-gray-500 hover:text-blue-700 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-1">
          <a
            href="/#webinars"
            onClick={closeMenu}
            className="block text-gray-700 hover:text-blue-700 font-medium py-2.5 border-b border-gray-50 text-sm"
          >
            Free Webinars
          </a>
          <a
            href="/#consultation"
            onClick={closeMenu}
            className="block text-gray-700 hover:text-blue-700 font-medium py-2.5 border-b border-gray-50 text-sm"
          >
            Contact
          </a>
          <div className="pt-2">
            <a
              href="/#consultation"
              onClick={closeMenu}
              className="block bg-blue-700 text-white text-center px-5 py-3 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors"
            >
              Free Consultation
            </a>
          </div>
          {isLoggedIn ? (
            <div className="pt-2 flex gap-4">
              <Link href="/admin/dashboard" onClick={closeMenu} className="text-gray-500 text-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-500 text-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <Link href="/admin/login" onClick={closeMenu} className="text-gray-300 text-xs">
                Admin
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
