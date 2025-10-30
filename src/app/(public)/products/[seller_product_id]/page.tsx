'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Minus, Star } from 'lucide-react';

// --- TYPE DEFINITIONS ---

// Define an interface for a single review
interface Review {
  rating: number;
  comment: string;
}

// Define an interface for the Product object
interface Product {
  seller_product_id: string;
  name: string;
  description: string;
  sale_price: number;
  act_price?: number; 
  stock: number;
  category_id: number;
  average_rating: number;
  review_count: number;
  images: string[];
  reviews: Review[];
  related_products: Product[];
}

// --- SELF-CONTAINED PRODUCT CARD COMPONENT ---

// ProductCard component is now defined inside this file to avoid import issues.
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const handleCardClick = () => {
    // Navigate to the product detail page
    window.location.href = `/products/${product.seller_product_id}`;
  };

  return (
    <div
      className="bg-card rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:-translate-y-1 transition-transform duration-300 ease-in-out"
      onClick={handleCardClick}
    >
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.images?.[0] || 'https://placehold.co/400x400/FFFFFF/333333?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground truncate">{product.name}</h3>
        <p className="text-lg font-semibold text-foreground mt-1">₹{product.sale_price}</p>
      </div>
    </div>
  );
};


export default function ProductDetailPage() {
  const [seller_product_id, setSellerProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
    const apiUrl =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_VERSION ?? "");
      const addToCart = async () => {
      const token = localStorage.getItem("ilb-token");
      if (!token) {
        alert("Please log in to add items to your cart.");
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/user/cart`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seller_product_id: seller_product_id,
            quantity,
          }),
        });
        const data = await response.json();
        if (data.success) {
          alert(`${quantity} x ${product.name} added to cart`);
        } else {
          alert("Failed to add item to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    };
  
  // --- REPLACEMENT FOR NEXT.JS HOOKS ---
  
  // Get seller_product_id from URL path
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const id = pathSegments[pathSegments.length - 1];
      if (id) {
        setSellerProductId(id);
      }
    }
  }, []);

  // Fetch data when seller_product_id is available
  useEffect(() => {
    if (!seller_product_id) {
      // If no ID after initial check, stop loading
      if (loading && !product) setLoading(false);
      return;
    }

    setLoading(true);
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/public/products/${seller_product_id}`);
        const res = await response.json();
        setProduct(res.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [seller_product_id]);

  const navigateBack = () => window.history.back();
  const navigateToProducts = () => window.location.href = '/products';
  
  // --- RENDER LOGIC ---

  if (loading) return <div className="text-center py-20 text-foreground">Loading...</div>;

  if (!product)
    return (
      <div className="text-center py-20 text-foreground">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={navigateToProducts}
          className="px-6 py-3 btn-primary rounded-xl font-semibold shadow"
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

  <section className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Background blur circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-background rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-background rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-8">
          {/* Back Button */}
          <button
            className="mb-6 flex items-center text-foreground font-semibold hover:text-primary"
            onClick={navigateBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-card backdrop-blur-sm rounded-2xl overflow-hidden flex items-center justify-center">
              {product.images?.length > 0 ? (
                <div className="flex w-full h-full overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                  {product.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="flex-shrink-0 w-full h-full object-cover snap-center"
                    />
                  ))}
                </div>
              ) : (
                <span className="text-button-text/50">No Image</span>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-card-20 text-button-text rounded text-sm">
                    Category {product.category_id}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="font-medium text-foreground">{product.average_rating ?? 0}</span>
                    <span className="text-foreground/80">({product.review_count} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-2 text-foreground">{product.name}</h1>
                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-foreground">₹{currentPrice}</span>
                {product.act_price && (
                  <span className="text-xl line-through text-foreground/50">₹{product.act_price}</span>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="font-semibold">Quantity:</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 flex items-center justify-center text-foreground disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                      className="h-10 w-10 flex items-center justify-center text-foreground disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-foreground/80">{currentStock} available</span>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart();
                }}
                disabled={currentStock === 0}
                className="w-full md:w-auto btn-primary px-6 py-3 rounded-xl shadow-md font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Add to Cart - ₹{currentPrice * quantity}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="w-full">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mt-12 mb-4">Related Products</h2>
            </div>
            <div className="overflow-x-auto hide-scrollbar pl-4">
              <div className="flex gap-6">
                {product.related_products.map((p) => (
                  <div key={p.seller_product_id} className="shrink-0 w-64">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
        </div>


        {/* Reviews */}
        <div className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mt-12 mb-4">Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="bg-card backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center mb-2">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star 
                                key={starIdx}
                                className={`w-4 h-4 ${starIdx < review.rating ? 'text-accent' : 'text-button-text/20'}`}
                            />
                        ))}
                    </div>
                  <span className="font-medium ml-2 text-foreground">{review.rating}</span>
                </div>
                <p className="text-foreground/80">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

