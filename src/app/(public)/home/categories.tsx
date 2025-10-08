"use client";

import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/category/category-card";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
const apiUrl =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_VERSION ?? "");
  useEffect(() => {
    const fetchCategories = async (pin: string) => {
      try {
        const response = await fetch(`${apiUrl}/public/categories`, { headers: { 'x-user-pincode': pin || '' } });
        const res = await response.json();
        setCategories(res.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
  
    const initialPin = localStorage.getItem("pincode") || "";
    fetchCategories(initialPin);
  }, []);
  

  return (
    <section className="py-16 relative overflow-hidden text-foreground">

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Categories</h2>
          <p className="text-muted-foreground mt-2">
            Explore all available product categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
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
