"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/products/product-card";

export default function SubcategoriesPage() {
  const { id } = useParams();
  const categoryId = Array.isArray(id) ? id[0] : id; // normalize

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [subcatProducts, setSubcatProducts] = useState<any[]>([]);
  const [selectedSubcat, setSelectedSubcat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subcategories
  useEffect(() => {
    if (!categoryId) return;
  
    const fetchSubcategories = async () => {
      setLoading(true);
      try {
        const pin = localStorage.getItem("pincode") || "";
  
        const res = await axios.get(
          `http://localhost:3005/api/v1/public/categories/${categoryId}/subcategories`,
          {
            headers: { "x-user-pincode": pin }
          }
        );
  
        const subcats = res.data.subcategories || [];
        setSubcategories(subcats);
        if (subcats.length > 0) {
          setSelectedSubcat(subcats[0].id);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubcategories();
  }, [categoryId]);
  
  // Fetch products for selected subcategory
  useEffect(() => {
    if (!selectedSubcat) return;
  
    const fetchProducts = async () => {
      const pin = localStorage.getItem("pincode") || ""; // get latest pincode
      try {
        setLoading(true);
        setError(null);
  
        const res = await axios.get(
          `http://localhost:3005/api/v1/public/subcategories/${selectedSubcat}/products`,
          { headers: { "x-user-pincode": pin } }
        );
  
        if (res.data.success && Array.isArray(res.data.products)) {
          setSubcatProducts(res.data.products);
        } else {
          setSubcatProducts([]);
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
        setSubcatProducts([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [selectedSubcat]); // Only depends on selectedSubcat
  if (loading) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="flex bg-gradient-to-br from-yellow-500 to-pink-500 text-white">
      {/* Subcategory Sidebar */}
      <aside className="w-1/4 p-6 bg-white/10 backdrop-blur-md overflow-y-auto hide-scrollbar">
        <h2 className="text-xl font-bold mb-4">Subcategories</h2>
        <ul className="space-y-2">
          {subcategories.map((subcat) => (
            <li
              key={subcat.id}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                selectedSubcat === subcat.id
                  ? "bg-white/20 font-semibold shadow-md"
                  : "hover:bg-white/10"
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
              <ProductCard key={product.seller_product_id} product={product} showDiscount />
            ))
          ) : (
            <div className="col-span-full text-center text-white/70 mt-10">
              <h2 className="text-xl font-semibold">No products found</h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
