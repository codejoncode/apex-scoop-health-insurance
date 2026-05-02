'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="ApexScoop" className="w-8 h-8" />
          <span className="text-2xl font-bold text-primary">ApexScoop</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/ask" className="hover:text-primary">Ask a Question</Link>
          <Link href="/calculator" className="hover:text-primary">Calculator</Link>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <Link href="/leads" className="btn-primary text-sm">Get a Quote</Link>

          {isLoggedIn ? (
            <>
              <Link href="/admin/dashboard" className="hover:text-primary">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/admin/login" className="text-gray-500 hover:text-gray-700 text-sm">Admin</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
