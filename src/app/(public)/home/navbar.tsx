'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, User, LogIn, Search } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pincode, setPincode] = useState("");
 
  // check token
  useEffect(() => {
    const token = localStorage.getItem("ilb-token")
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

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
    window.dispatchEvent(new CustomEvent("pincodeChanged", { detail: pincode }));
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-background/10 backdrop-blur-md flex justify-between items-center px-6 py-4 z-50">
      {/* Left: Logo */}
      <div className="text-primary font-bold text-xl">ILB Mart</div>
      
      {/* Center: Navigation */}
      <div className="flex space-x-6">
        <a href="#hero" className="text-button-text font-semibold hover:text-primary">Home</a>
        <a href="#trending" className="text-button-text font-semibold hover:text-primary">Trending</a>
        <a href="#categories" className="text-button-text font-semibold hover:text-primary">Categories</a>
        <a href="#pricesaver" className="text-button-text font-semibold hover:text-primary">Price Saver</a>
      </div>
      
      {/* Right: Pincode Input + Wishlist/Cart/Profile */}
      <div className="flex items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <input
            type="number"
            placeholder="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full pr-10 pl-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary
                       appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            onClick={setLocal}
            className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-600 hover:text-primary transition-colors cursor-pointer"
          >
            <Search size={20} />
          </button>
        </div>
        
        {/* Wishlist - opens wishlist section */}
        <Link href="/profile?section=wishlist">
          <Heart className="w-6 h-6 text-accent hover:text-accent/80" />
        </Link>
        
        {/* Cart - opens cart section */}
        <Link href="/profile?section=cart">
          <ShoppingCart className="w-6 h-6 text-primary hover:text-primary/80" />
        </Link>
        
        {/* Profile/Login */}
        {isLoggedIn ? (
          <Link href="/profile">
            <User className="w-6 h-6 text-button-text hover:text-primary" />
          </Link>
        ) : (
          <Link href="/login">
            <LogIn className="w-6 h-6 text-button-text hover:text-primary" />
          </Link>
        )}
      </div>
    </nav>
  );
}