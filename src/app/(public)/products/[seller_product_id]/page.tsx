'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Plus, Minus, Heart, Share2, Star } from 'lucide-react';
import ProductCard from '@/components/products/product-card';

export default function ProductDetailPage() {
  const { seller_product_id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!seller_product_id) return;

    axios
      .get(`http://localhost:3005/api/v1/public/products/${seller_product_id}`)
      .then((res) => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [seller_product_id]);

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;

  if (!product)
    return (
      <div className="text-center py-20 text-white">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold shadow"
        >
          Back to Products
        </button>
      </div>
    );

  const currentPrice = product.sale_price;
  const currentStock = product.stock ?? 10;

  return (
    <>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <section className="min-h-screen bg-gradient-to-br from-yellow-500 to-pink-500 text-white relative overflow-hidden">
        {/* Background blur circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <button
            className="mb-6 flex items-center text-white font-semibold"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden flex items-center justify-center">
              {product.images?.length ? (
                <div className="flex w-full h-full overflow-x-auto hide-scrollbar">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="flex-shrink-0 w-full h-full object-cover"
                    />
                  ))}
                </div>
              ) : (
                <span className="text-white/50">No Image</span>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-white/20 text-white rounded text-sm">
                    Category {product.category_id}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.average_rating ?? 0}</span>
                    <span className="text-white/80">({product.review_count} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-white/80 leading-relaxed">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold">₹{currentPrice}</span>
                {product.act_price && (
                  <span className="text-xl line-through text-white/50">₹{product.act_price}</span>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="font-semibold">Quantity:</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg border-white/30">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 flex items-center justify-center text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                      className="h-10 w-10 flex items-center justify-center text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-white/80">{currentStock} available</span>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => alert(`${quantity} x ${product.name} added to cart`)}
                disabled={currentStock === 0}
                className="w-full md:w-auto bg-white text-green-600 hover:bg-white/90 px-6 py-3 rounded-xl shadow-md font-semibold"
              >
                Add to Cart - ₹{currentPrice * quantity}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto hide-scrollbar p-4">
          <div className="flex gap-6">
            {product.related_products.map((p: any) => (
              <div key={p.seller_product_id} className="shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mt-12 mb-4">Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review: any, idx: number) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-2" />
                  <span className="font-medium">{review.rating}</span>
                </div>
                <p className="text-white/80">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}