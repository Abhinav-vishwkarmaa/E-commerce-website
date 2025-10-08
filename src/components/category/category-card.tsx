"use client";

import React from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface categoryCard {
  category: {
    id: number;
    name?: string;
    image?:string
}}

export default function CategoryCard({ category }: categoryCard) {
  return (
<Link href={`/subcategories/${category.id}`}>
            <div
              className="flex flex-col items-center p-6 bg-card backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition h-full"
            >
              <Image
                src={category.image || "/next.svg"}
                alt={category.name || "category"}
                width={500}
                height={500}
                className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-border"
              />
              <h3 className="text-lg font-semibold text-button-text text-center">
                {category.name}
              </h3>
            </div>
</Link>

  );
}