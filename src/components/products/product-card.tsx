"use client";

import React from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Eye, IndianRupee } from "lucide-react";
import Link from "next/link";
const apiUrl =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_VERSION ?? "");

interface ProductCardProps {
  product: {
    seller_product_id: number;
    name?: string;
    product_name?: string;
    slug?: string;
    image_url?: string;
    image?: string;
    price?: {
      mrp?: number;
      sale_price?: number;
      act_price?: number;
    };
    base_price?: string;
    sale_price?: string;
    act_price?: string;
    rating?: {
      average?: string;
    };
    images?: string | string[];
  };
  showDiscount?: boolean;
}

export default function ProductCard({ product, showDiscount }: ProductCardProps) {
  // Handle pricing from different formats
  const mrp = product.price?.mrp || parseFloat(product.base_price || "0") || 0;
  const act_price = product.price?.act_price || parseFloat(product.act_price || "0") || 0;
  const salePrice = product.price?.sale_price || parseFloat(product.sale_price || "0") || 0;
  const discount = mrp && salePrice ? mrp - salePrice : 0;
  const rating = product.rating?.average;

  
  // Handle product name from different formats
  const productName = product.name || product.product_name || "Product";
  
  // Handle images properly - check for array or string
  let imageSrc = "/file.svg"; // default fallback
  if (product.image_url && product.image_url !== "") {
    imageSrc = product.image_url;
  } else if (product.images) {
    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0] !== "") {
      imageSrc = product.images[0];
    } else if (typeof product.images === "string" && product.images !== "") {
      imageSrc = product.images;
    }
  } else if (product.image && product.image !== "") {
    imageSrc = product.image;
  }
  const addToCart = async () => {
    const response = await fetch(`${apiUrl}/user/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("ilb-token")}`
      },
      body: JSON.stringify({ seller_product_id: product.seller_product_id ,quantity:1})
    });
  }

  return (
    <Link href={`/products/${product.seller_product_id}`}>
      <div className="flex flex-col w-auto h-68 bg-card backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
        {/* Product Image */}
        <div className="relative w-full h-40">
          <Image
            src={imageSrc}
            width={500}
            height={500}
            alt={productName}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {discount > 0 && showDiscount && (
            <span className="absolute top-2 left-2 bg-accent text-card-foreground text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
              <IndianRupee size={12} />
              <span>{discount.toFixed(0)} off</span>
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 justify-between p-4">
          <div className="flex flex-col w-full h-20">
            <h3 className="text-lg font-semibold text-card-foreground line-clamp-2">
              {productName}
            </h3>

            {salePrice > 0 && (
              <p className="text-card-foreground/80 mt-1">
                {(mrp > 0 || act_price > 0) && (
                  <>
                    {mrp > 0 && (
                      <span className="line-through text-card-foreground/50 mr-2">
                        ₹{mrp.toFixed(2)}
                      </span>
                    )}
                    {act_price > 0 && act_price !== mrp && (
                      <span className="line-through text-card-foreground/50 mr-2">
                        ₹{act_price.toFixed(2)}
                      </span>
                    )}
                  </>
                )}
                <span className="text-primary font-bold">₹{salePrice.toFixed(2)}</span>
              </p>
            )}

            {/* Rating */}
            {rating && (
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-accent mr-1 fill-accent" />
                <span className="text-sm text-card-foreground">{rating}</span>
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex justify-between items-center mt-4">
            {salePrice > 0 && (
              <button 
                className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart();
                }}
              >
                <ShoppingCart className="w-5 h-5 cursor-pointer" />
                <span className="text-sm font-medium">Add</span>
              </button>
            )}

            <button 
              className="text-accent hover:text-accent/80 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist logic here
              }}
            >
              <Heart className="w-5 h-5" />
            </button>

            <button 
              className="text-card-foreground/80 hover:text-card-foreground transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Quick view logic here
              }}
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}