"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "@/components/category/category-card";
// import { Link } from "lucide-react";
import Link from "next/link";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3005/api/v1/public/categories")
      .then((res) => setCategories(res.data.categories))
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
          <h2 className="text-4xl md:text-5xl font-bold text-white">Categories</h2>
          <p className="text-white/80 mt-2">
            Explore all available product categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat)=>(
          <div key={cat.id}>
            <CategoryCard category={cat}/>
          </div>
        ))}
        </div>

      </div>
    </section>
  );
}
