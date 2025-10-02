'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '@/components/products/product-card';

interface Subcategory {
  id: number;
  name: string;
}

interface Product {
  seller_product_id: number;
  name: string;
  slug?: string;
  image_url?: string;
  price?: {
    mrp?: number;
    sale_price?: number;
    act_price?: number;
  };
}

export default function SubcategoriesPage() {
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subcatProducts, setSubcatProducts] = useState<Product[]>([]);
  const [selectedSubcat, setSelectedSubcat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch subcategories
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axios
      .get(`http://localhost:3005/api/v1/public/categories/${id}/subcategories`)
      .then((res) => {
        setSubcategories(res.data.subcategories || []);
        if (res.data.subcategories?.length > 0) {
          setSelectedSubcat(res.data.subcategories[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch products for selected subcategory
  useEffect(() => {
    if (!selectedSubcat) return;

    axios
      .get(`http://localhost:3005/api/v1/public/subcategories/${selectedSubcat}/products`)
      .then((res) => setSubcatProducts(res.data.products || []))
      .catch((err) => console.error(err));
  }, [selectedSubcat]);

  if (loading)
    return <div className="text-white text-center py-20">Loading...</div>;

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

      <div className="flex min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 text-white">
        {/* Subcategory Sidebar */}
        <aside className="w-1/4 p-6 bg-white/10 backdrop-blur-md overflow-y-auto hide-scrollbar">
          <h2 className="text-xl font-bold mb-4">Subcategories</h2>
          <ul className="space-y-2">
            {subcategories.map((subcat) => (
              <li
                key={subcat.id}
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                  selectedSubcat === subcat.id 
                    ? 'bg-white/20 font-semibold shadow-md' 
                    : 'hover:bg-white/10'
                }`}
                onClick={() => setSelectedSubcat(subcat.id)}
              >
                {subcat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Products Grid */}
        <main className="w-3/4 p-6 overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subcatProducts.length > 0 ? (
              subcatProducts.map((product) => (
                <ProductCard
                  key={product.seller_product_id}
                  product={product}
                  showDiscount
                />
              ))
            ) : (
                <div className="col-span-full text-center text-white/70 mt-10">
                <h2 className="text-xl font-semibold">No products found</h2>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}