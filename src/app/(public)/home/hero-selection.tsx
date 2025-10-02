'use client';

import React, { useState } from 'react';
import { Clock, Truck, Shield, Menu, X, ShoppingCart } from 'lucide-react';
import TrendingProducts from './trending-product';
import Categories from './categories';
import PriceSaver from './price-saver';
import Link from 'next/link';

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="min-h-screen text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            MyShop
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-green-200">Home</Link>
            <Link href="/products" className="hover:text-green-200">Products</Link>
            <Link href="/about" className="hover:text-green-200">About</Link>
            <Link href="/contact" className="hover:text-green-200">Contact</Link>
          </div>

          {/* Cart Icon */}
          <div className="hidden md:flex">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-green-700 px-4 py-4 space-y-2 rounded-xl">
            <Link href="/" className="block hover:text-green-200">Home</Link>
            <Link href="/products" className="block hover:text-green-200">Products</Link>
            <Link href="/about" className="block hover:text-green-200">About</Link>
            <Link href="/contact" className="block hover:text-green-200">Contact</Link>
        
          </div>
        )}

        {/* Hero Content */}
        <div className="flex flex-col justify-center min-h-screen py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block">Fresh Groceries</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  in 10 Minutes
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                Get fresh groceries, fruits, vegetables, and daily essentials delivered to your doorstep instantly.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
              <div className="flex flex-col items-center space-y-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg">10-Min Delivery</h3>
                <p className="text-white/80 text-sm text-center">
                  Lightning fast delivery to your doorstep
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg">Free Delivery</h3>
                <p className="text-white/80 text-sm text-center">
                  No delivery charges on any order
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg">Quality Assured</h3>
                <p className="text-white/80 text-sm text-center">
                  Fresh products with quality guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
