'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, User, LogIn, Microscope, Search } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with real auth logic
  const [pincode, setPincode] = useState("");

  // Load pincode from localStorage initially
  useEffect(() => {
    const savedPincode = localStorage.getItem("pincode");
    if (savedPincode) setPincode(savedPincode);
  }, []);

  // Save pincode and notify other components
  const setLocal = () => {
    if (pincode.trim() === "") {
      alert("Please enter a pincode");
      return;
    }
    localStorage.setItem("pincode", pincode);

    // Dispatch a custom event so TrendingProducts can listen
    window.dispatchEvent(new CustomEvent("pincodeChanged", { detail: pincode }));
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md flex justify-between items-center px-6 py-4 z-50">
      {/* Left: Logo */}
      <div className="text-white font-bold text-xl">mummabite</div>

      {/* Center: Navigation */}
      <div className="flex space-x-6">
        <a href="#hero" className="text-white font-semibold hover:text-green-200">Home</a>
        <a href="#trending" className="text-white font-semibold hover:text-green-200">Trending</a>
        <a href="#categories" className="text-white font-semibold hover:text-green-200">Categories</a>
        <a href="#pricesaver" className="text-white font-semibold hover:text-green-200">Price Saver</a>
      </div>

      {/* Right: Pincode Input + Wishlist/Cart/Profile */}
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="px-3 py-1 border rounded"
        />
        <Search
          size={24}
          className="cursor-pointer text-black hover:text-blue-600 hover:bg-gray-200 p-1 rounded transition-colors duration-200"
          onClick={setLocal}
        />


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
