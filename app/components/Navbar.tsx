'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold accent-text">XerionX</span>
            <span className="text-white">AI Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-gray-300 hover:text-accent transition-colors">
              Shop
            </Link>
            <Link href="/chat" className="text-gray-300 hover:text-accent transition-colors">
              AI Chat
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-accent transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-600 transition-colors accent-glow"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link href="/shop" className="text-gray-300 hover:text-accent transition-colors">
                Shop
              </Link>
              <Link href="/chat" className="text-gray-300 hover:text-accent transition-colors">
                AI Chat
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-accent transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
