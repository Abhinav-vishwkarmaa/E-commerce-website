"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../../components/products/product-card";

export default function PriceSaver() {
  const [priceSaver, setPriceSaver] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3005/api/v1/public/products/price-saver")
      .then((res) => setPriceSaver(res.data.priceSaverProducts))
      .catch((err) => console.error(err));
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
          {priceSaver.map((product) => (
            <div
              key={product.seller_product_id}
              className="h-full"
            >
              <ProductCard product={product} showDiscount={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
