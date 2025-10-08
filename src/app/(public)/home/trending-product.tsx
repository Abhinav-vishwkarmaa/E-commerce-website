'use client';

import React, { useEffect, useState } from "react";
import ProductCard from "../../../components/products/product-card";

export default function TrendingProducts() {
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 12;
const apiUrl =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_VERSION ?? "");

  // ✅ Fetch trending products with pagination
  const fetchTrending = async (pin: string, pageNum: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/public/products/trending?limit=${ITEMS_PER_PAGE}&offset=${(pageNum - 1) * ITEMS_PER_PAGE}`, {
        headers: { 'x-user-pincode': pin || '' }
      });
      const res = await response.json();

      if (res.success && Array.isArray(res.trendingProducts)) {
        const newProducts = res.trendingProducts;
        setTrendingProducts(newProducts);
        setHasMore(newProducts.length === ITEMS_PER_PAGE);
      } else {
        setTrendingProducts([]);
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Error fetching trending products:", err);
      setError(err.message || "Failed to load trending products");
      setTrendingProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load on mount and handle pincode changes
  useEffect(() => {
    const initialPin = localStorage.getItem("pincode") || "";
    fetchTrending(initialPin, page);

    const handlePincodeChange = (e: any) => {
      setPage(1);
      fetchTrending(e.detail, 1);
    };

    window.addEventListener("pincodeChanged", handlePincodeChange);
    return () => window.removeEventListener("pincodeChanged", handlePincodeChange);
  }, [page]);

  // ✅ Pagination handlers
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
  <section className="py-16 relative overflow-hidden text-foreground">

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Trending Products
          </h2>
          <p className="text-foreground/80 mt-2">
            Check out the most popular products this week
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          // Error State
            <div className="bg-card border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-lg mb-4">
              Failed to load trending products
            </p>
            <p className="text-foreground/60 text-sm">{error}</p>
          </div>
        ) : trendingProducts.length === 0 ? (
          // Empty State
          <div className="text-center text-button-text/70 mt-10">
            <h2 className="text-xl font-semibold">
              No trending products found
            </h2>
          </div>
        ) : (
          // Success: Product Grid
          <>
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
              {trendingProducts.map((product, index) => (
                <div key={`${product.seller_product_id}-${index}`} className="h-full">
                  <ProductCard product={product} showDiscount={true} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 mt-12">
              {/* Previous */}
              <button
                onClick={handlePrevious}
                disabled={page === 1 || loading}
                className="bg-card hover:bg-card-20 disabled:bg-card/50 disabled:cursor-not-allowed disabled:opacity-50 text-button-text py-3 px-6 rounded-xl border border-border transition-all duration-300 font-medium flex items-center gap-2"
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
              <div className="bg-card px-6 py-3 rounded-xl border border-border">
                <span className="text-button-text font-medium">Page {page}</span>
              </div>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={!hasMore || loading}
                className="bg-card hover:bg-card-20 disabled:bg-card/50 disabled:cursor-not-allowed disabled:opacity-50 text-button-text py-3 px-6 rounded-xl border border-border transition-all duration-300 font-medium flex items-center gap-2"
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
            <div className="text-center mt-6 text-foreground/60 text-sm">
              {hasMore ? (
                <p>
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {(page - 1) * ITEMS_PER_PAGE + trendingProducts.length} products
                </p>
              ) : (
                <p>
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {(page - 1) * ITEMS_PER_PAGE + trendingProducts.length} products • You've reached the end
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ✅ Loading Skeleton for placeholders */
function LoadingSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse bg-card rounded-2xl p-4">
          <div className="aspect-square bg-card-20 rounded-lg mb-3"></div>
          <div className="h-4 bg-card-20 rounded mb-2"></div>
          <div className="h-4 bg-card-20 rounded w-3/4 mb-3"></div>
          <div className="h-10 bg-card-20 rounded"></div>
        </div>
      ))}
    </div>
  );
}
