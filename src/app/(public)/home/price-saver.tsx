"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../../components/products/product-card";

export default function PriceSaver() {
  const [priceSaver, setPriceSaver] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Function to fetch price-saver products based on pincode
    const fetchTrending = async (pin: string) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          "http://localhost:3005/api/v1/public/products/price-saver",
          { 
            headers: { "x-user-pincode": pin || "" } 
          }
        );
        
        if (res.data.success && Array.isArray(res.data.priceSaverProducts)) {
          setPriceSaver(res.data.priceSaverProducts);
        } else {
          setPriceSaver([]);
        }
      } catch (err: any) {
        console.error('Error fetching price-saver products:', err);
        setError(err.message || 'Failed to load products');
        setPriceSaver([]);
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
  return (
    <section className="py-16 relative overflow-hidden text-white">
      {/* Background Blur Circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Price Saver</h2>
          <p className="text-white/80 mt-2">
            Get the best deals and discounts on your favorite products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
  {priceSaver && priceSaver.length > 0 ? (
    priceSaver.map((product) => (
      <div key={product.seller_product_id} className="h-full">
        <ProductCard product={product} showDiscount={true} />
      </div>
    ))
  ) : (
    <div className="col-span-full text-center text-white/70 mt-10">
      <h2 className="text-xl font-semibold">No products found</h2>
    </div>
  )}
</div>

      </div>
    </section>
  );
}
