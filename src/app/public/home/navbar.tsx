'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, User, LogIn } from 'lucide-react';

export default function Navbar() {
  // Simulate login state (replace with your auth logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md flex justify-between items-center px-6 py-4 z-50">
      {/* Left: Logo / Brand */}
      <div className="text-white font-bold text-xl">mummabite</div>

      {/* Center: Navigation Links */}
      <div className="flex space-x-6">
        <a href="#hero" className="text-white font-semibold hover:text-green-200">Home</a>
        <a href="#trending" className="text-white font-semibold hover:text-green-200">Trending</a>
        <a href="#categories" className="text-white font-semibold hover:text-green-200">Categories</a>
        <a href="#pricesaver" className="text-white font-semibold hover:text-green-200">Price Saver</a>
      </div>

      {/* Right: Wishlist, Cart & Profile/Login */}
      <div className="flex space-x-4 items-center">
        <Link href="/wishlist">
          <Heart className="w-6 h-6 text-red-400 hover:text-red-600" />
        </Link>
        <Link href="/cart">
          <ShoppingCart className="w-6 h-6 text-green-400 hover:text-green-600" />
        </Link>
        {isLoggedIn ? (
          <Link href="/profile">
            <User className="w-6 h-6 text-white hover:text-green-200" />
          </Link>
        ) : (
          <Link href="/login">
            <LogIn className="w-6 h-6 text-white hover:text-green-200" />
          </Link>
        )}
      </div>
    </nav>
  );
}
