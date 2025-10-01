"use client";

import React from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";

interface categoryCard {
  category: {
    id: number;
    name?: string;
    image?:string
}}

export default function CategoryCard({ category }: categoryCard) {
  console.log(category)
  return (
<Link href={`public/subcategories/${category.id}`}>
            <div
              className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition h-full"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-white/20"
              />
              <h3 className="text-lg font-semibold text-white text-center">
                {category.name}
              </h3>
            </div>
</Link>

  );
}