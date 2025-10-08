"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/products/product-card";

export default function SubcategoriesPage() {
   const { id } = useParams();
   const categoryId = Array.isArray(id) ? id[0] : id;
   const apiURL =
     (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
     (process.env.NEXT_PUBLIC_API_VERSION ?? "");

   const [subcategories, setSubcategories] = useState<any[]>([]);
   const [products, setProducts] = useState<any[]>([]);
   const [selectedSubcat, setSelectedSubcat] = useState<number | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pin = typeof window !== "undefined" ? localStorage.getItem("pincode") || "" : "";

  // Fetch subcategories
  useEffect(() => {
    if (!categoryId) return;

    const fetchSubcategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${apiURL}/public/categories/${categoryId}/subcategories`,
          { headers: { "x-user-pincode": pin } }
        );
        const data = await res.json();
        const subcats = data.subcategories || [];
        setSubcategories(subcats);
        if (subcats.length > 0) setSelectedSubcat(subcats[0].id);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch subcategories");
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId, pin]);

  // Fetch products when subcategory changes
  useEffect(() => {
    if (!selectedSubcat) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${apiURL}/public/subcategories/${selectedSubcat}/products`,
          { headers: { "x-user-pincode": pin } }
        );
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedSubcat, pin]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row bg-background text-foreground min-h-screen">
      {/* Subcategory Sidebar */}
      <aside className={`w-full md:w-1/4 p-6 bg-card backdrop-blur-md overflow-y-auto hide-scrollbar ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <h2 className="text-xl font-bold mb-4">Subcategories</h2>
        <ul className="space-y-2">
          {subcategories.map((subcat) => (
            <li
              key={subcat.id}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                selectedSubcat === subcat.id
                  ? "bg-card-20 font-semibold shadow-md"
                  : "hover:bg-card"
              }`}
              onClick={() => setSelectedSubcat(subcat.id)}
            >
              {subcat.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Products Grid */}
      <main className="w-full md:w-3/4 p-6 overflow-y-auto hide-scrollbar">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden mb-4 p-2 bg-card rounded-lg shadow"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? 'Hide Categories' : 'Show Categories'}
        </button>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.seller_product_id}
                product={product}
                showDiscount
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-button-text/70 mt-10">
            <h2 className="text-xl font-semibold">No products found</h2>
          </div>
        )}
      </main>
    </div>
  );
}
