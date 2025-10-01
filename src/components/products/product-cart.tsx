"use client";

import React from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: {
    seller_product_id: number;
    name?: string;
    slug?: string;
    image_url?: string;
    price?: {
      mrp?: number;
      sale_price?: number;
      act_price?:number
    };
    rating?: {
      average?: string;
    };
  };
  showDiscount?: boolean;
}

export default function ProductCard({ product, showDiscount }: ProductCardProps) {
  const mrp = product.price?.mrp || 0;
  const act_price = product.price?.act_price ||0;
  const salePrice = product.price?.sale_price || 0;
  const discount = mrp && salePrice ? mrp - salePrice : 0;
  const rating = product.rating?.average;
  return (
<Link href={`public/products/${product.seller_product_id}`}>
  <div className="flex flex-col w-54 h-68 bg-white/10 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
    {/* Product Image */}
    {(
      <div className="relative w-full h-40">
        <img
          src={product.image_url}
          alt={product.name || "Product"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {discount > 0 && showDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount} off
          </span>
        )}
      </div>
    )}

    {/* Product Info */}
    <div className="flex flex-col flex-1 justify-between p-4">
      <div className="flex flex-col w-48 h-20">
        {product.name && (
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            {product.name}
          </h3>
        )}

        {product.price && (
          <p className="text-white/80 mt-1">
            {mrp > 0 && (
              <span className="line-through text-white/50 mr-2">₹{mrp}</span>
            )}
            {act_price > 0 && (
              <span className="line-through text-white/50 mr-2">₹{act_price}</span>
            )}
            <span className="text-primary font-bold">₹{salePrice}</span>
          </p>
        )}

        {/* Rating */}
        {rating && (
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm text-white">{rating}</span>
          </div>
        )}
      </div>

      {/* Action Icons */}
      <div className="flex justify-between items-center mt-4">
        {salePrice > 0 && (
          <button className="flex items-center space-x-1 text-green-400 hover:text-green-500">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-medium">Add</span>
          </button>
        )}

        <button className="text-red-400 hover:text-red-500">
          <Heart className="w-5 h-5" />
        </button>

        <button className="text-white/80 hover:text-white">
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</Link>

  );
}
