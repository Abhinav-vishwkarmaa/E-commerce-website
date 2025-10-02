'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../../components/products/product-card";

export default function TrendingProducts() {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch trending products based on pincode
    const fetchTrending = async (pin: string) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          "http://localhost:3005/api/v1/public/products/trending",
          { 
            headers: { "x-user-pincode": pin || "" } 
          }
        );
        
        if (res.data.success && Array.isArray(res.data.trendingProducts)) {
          setTrendingProducts(res.data.trendingProducts);
        } else {
          setTrendingProducts([]);
        }
      } catch (err: any) {
        console.error('Error fetching trending products:', err);
        setError(err.message || 'Failed to load products');
        setTrendingProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initially from localStorage
    const initialPin = localStorage.getItem("pincode") || "";
    fetchTrending(initialPin);

    // Listen for pincode updates from Navbar
    const handlePincodeChange = (e: any) => fetchTrending(e.detail);
    window.addEventListener("pincodeChanged", handlePincodeChange);

    return () => window.removeEventListener("pincodeChanged", handlePincodeChange);
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Trending Products
          </h2>
          <p className="text-white/80 mt-2">
            Check out the most popular products this week
          </p>
        </div>

        {/* Loading Skeleton */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white/10 rounded-2xl p-4">
              <div className="aspect-square bg-white/20 rounded-lg mb-3"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-3/4 mb-3"></div>
              <div className="h-10 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Trending Products
          </h2>
          <p className="text-white/80 mt-2">
            Check out the most popular products this week
          </p>
        </div>

        {/* Error State */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-lg mb-4">Failed to load trending products</p>
          <p className="text-white/60 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!trendingProducts || trendingProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Trending Products
          </h2>
          <p className="text-white/80 mt-2">
            Check out the most popular products this week
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/60 text-lg">No trending products available at the moment.</p>
          <p className="text-white/40 text-sm mt-2">Check back soon for exciting deals!</p>
        </div>
      </div>
    );
  }

  // Success State - Products Grid
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Trending Products
        </h2>
        <p className="text-white/80 mt-2">
          Check out the most popular products this week
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {trendingProducts.map((product) => (
          <div key={product.seller_product_id} className="h-full">
            <ProductCard product={product} showDiscount={true} />
          </div>
        ))}
      </div>
    </div>
  );
}