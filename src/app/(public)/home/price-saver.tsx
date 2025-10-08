"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../../components/products/product-card";

export default function PriceSaver() {
  const [priceSaver, setPriceSaver] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
const apiUrl =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_VERSION ?? "");
  const ITEMS_PER_PAGE = 12;

  // Fetch products with pagination
  const fetchPriceSaver = async (pin: string, pageNum: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${apiUrl}/public/products/price-saver?limit=${ITEMS_PER_PAGE}&offset=${(pageNum - 1) * ITEMS_PER_PAGE}`,
        {
          headers: { "x-user-pincode": pin || "" },
        }
      );

      if (res.data.success && Array.isArray(res.data.priceSaverProducts)) {
        const newProducts = res.data.priceSaverProducts;
        setPriceSaver(newProducts);
        
        // Check if there are more products to load
        setHasMore(newProducts.length === ITEMS_PER_PAGE);
      } else {
        setPriceSaver([]);
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Error fetching price-saver products:", err);
      setError(err.message || "Failed to load products");
      setPriceSaver([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and pincode change handler
  useEffect(() => {
    const initialPin = localStorage.getItem("pincode") || "";
    fetchPriceSaver(initialPin, page);

    const handlePincodeChange = (e: any) => {
      setPage(1);
      fetchPriceSaver(e.detail, 1);
    };
    
    window.addEventListener("pincodeChanged", handlePincodeChange);
    return () => window.removeEventListener("pincodeChanged", handlePincodeChange);
  }, [page]);

  // Handle navigation
  const handleNext = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (page > 1 && !loading) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 relative overflow-hidden text-white">
      {/* Background Blurs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Price Saver
          </h2>
          <p className="text-white/80 mt-2">
            Get the best deals and discounts on your favorite products
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white/10 rounded-2xl p-4"
              >
                <div className="aspect-square bg-white/20 rounded-lg mb-3"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-3/4 mb-3"></div>
                <div className="h-10 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-lg mb-4">
              Failed to load Price Saver products
            </p>
            <p className="text-white/60 text-sm">{error}</p>
          </div>
        ) : priceSaver.length === 0 ? (
          // Empty
          <div className="text-center text-white/70 mt-10">
            <h2 className="text-xl font-semibold">
              No Price Saver products found
            </h2>
          </div>
        ) : (
          // Products Grid
          <>
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
              {priceSaver.map((product, index) => (
                <div key={`${product.seller_product_id}-${index}`} className="h-full">
                  <ProductCard product={product} showDiscount={true} />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-12">
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                disabled={page === 1 || loading}
                className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 text-white py-3 px-6 rounded-xl border border-white/20 transition-all duration-300 font-medium flex items-center gap-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                Previous
              </button>

              {/* Page Indicator */}
              <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20">
                <span className="text-white font-medium">
                  Page {page}
                </span>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={!hasMore || loading}
                className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 text-white py-3 px-6 rounded-xl border border-white/20 transition-all duration-300 font-medium flex items-center gap-2"
              >
                Next
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </button>
            </div>

            {/* Info Text */}
            <div className="text-center mt-6 text-white/60 text-sm">
              {hasMore ? (
                <p>Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {(page - 1) * ITEMS_PER_PAGE + priceSaver.length} products</p>
              ) : (
                <p>Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {(page - 1) * ITEMS_PER_PAGE + priceSaver.length} products • You've reached the end</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}