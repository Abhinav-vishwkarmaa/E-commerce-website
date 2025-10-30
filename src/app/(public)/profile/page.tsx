"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, ShoppingBag, Heart, ShoppingCart, LogOut, Mail, Phone, MapPin, X } from "lucide-react";
import Order from "@/components/account/orders";
import OrderHistory from "@/components/account/orderHistory";
import Cart from "@/components/account/cart";
import Wishlist from "@/components/account/wishlist";

const apiUrl =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_VERSION ?? "");

interface UserData {
  id: number;
  name: string;
  email: string;
  mobile: string;
  pincode: string;
  address: string | null;
  image: string | null;
  status: number;
}

interface OrderData {
  id: number;
  order_id: string;
  grand_total: string;
  order_status: string;
  payment_type: string;
  image?: string;
  created_at: string;
  delivery_address: string;
  address: any;
}

// Separate component that uses useSearchParams
function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');
  
  const [active, setActive] = useState<"profile" | "orders" | "wishlist" | "cart" | "orderHistory">("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set active section based on URL parameter
  useEffect(() => {
    if (sectionParam && ['profile', 'orders', 'wishlist', 'cart', 'orderHistory'].includes(sectionParam)) {
      setActive(sectionParam as typeof active);
    }
  }, [sectionParam]);

  const navigation = [
    { id: 1, nav: "profile", icon: <User size={20} />, label: "Profile" },
    { id: 4, nav: "cart", icon: <ShoppingCart size={20} />, label: "Cart" },
    { id: 3, nav: "wishlist", icon: <Heart size={20} />, label: "Wishlist" },
    { id: 2, nav: "orders", icon: <ShoppingBag size={20} />, label: "Current Orders" },
    { id: 5, nav: "orderHistory", icon: <ShoppingBag size={20} />, label: "Order History" },
    { id: 6, nav: "logout", icon: <LogOut size={20} />, label: "Logout" },
  ];

  const [profileData, setProfile] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [cart, setCart] = useState<any>(null);
  const [orderHistory, setOrderHistory] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("ilb-token");
    router.push("/login");
  };

  const handleClick = (item: typeof navigation[0]) => {
    if (item.nav === "logout") {
      setShowLogoutModal(true);
      return;
    }
    setActive(item.nav as any);
    router.push(`/profile?section=${item.nav}`, { scroll: false });
  };
  console.log(wishlist);
  const fetchData = async (endpoint: string, setter: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-pincode': localStorage.getItem("pincode") || ''
        },
      });
      const result = await response.json();
      
      if (result.success || result.status) {
        if (endpoint.includes("cart")) {
          setter(result.data);
        } else {
          setter(result.data || []);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setter(endpoint.includes("profile") ? null : endpoint.includes("cart") ? null : []);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: number) => {
    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/user/wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        fetchData("user/wishlist", setWishlist);
      } else {
        alert("Failed to remove item from wishlist");
      }
    } catch (err) {
      console.error("Remove from wishlist error:", err);
      alert("Error removing item from wishlist");
    }
  };

  const addToCartFromWishlist = async (item: any) => {
    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/user/cart/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seller_product_id: item.seller_product_id,
          quantity: 1,
          pincode: item.pincode
        }),
      });

      if (response.ok) {
        alert("Item added to cart successfully!");
        fetchData("user/cart", setCart);
      } else {
        const errorData = await response.json();
        alert(`Failed to add to cart: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error adding item to cart");
    }
  };

  const refreshCart = () => {
    fetchData("user/cart", setCart);
  };

  useEffect(() => {
    switch (active) {
      case "profile":
        fetchData("user/profile", setProfile);
        break;
      case "orders":
        fetchData("user/orders/current", setOrders);
        break;
      case "wishlist":
        fetchData("user/wishlist", setWishlist);
        break;
      case "cart":
        fetchData("user/cart", setCart);
        break;
      case "orderHistory":
        fetchData("user/orders/history", setOrderHistory);
        break;
    }
  }, [active]);

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }
      `}</style>

      <div className="flex min-h-screen bg-background text-foreground">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Fixed */}
        <aside className={`fixed left-0 top-0 h-screen w-80 p-6 bg-card backdrop-blur-xl shadow-2xl flex flex-col items-center border-r border-border animate-slideInLeft overflow-y-auto z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
          <div className="mb-8 text-center">
            <div className="w-24 h-24 bg-card-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl ring-4 ring-card-20 transition-transform duration-300 hover:scale-110">
              {profileData?.image ? (
                <img src={profileData.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={48} className="text-foreground/80" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground drop-shadow-lg">My Account</h2>
            {profileData && <p className="text-sm text-foreground/90 mt-2 font-medium">{profileData.name}</p>}
          </div>
          
          <nav className="flex flex-col space-y-2 w-full">
            {navigation.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                style={{animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards'}}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 animate-slideInLeft ${
                  active === item.nav 
                    ? "bg-card text-pink-500 shadow-xl font-semibold" 
                    : "hover:bg-card-20 text-foreground/90 hover:shadow-lg"
                }`}
              >
                <div className={active === item.nav ? "text-pink-500" : "text-foreground/80"}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Main Content */}
        <main className="flex-1 md:ml-80 p-8 overflow-y-auto animate-slideInRight">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold drop-shadow-lg animate-fadeIn">
                {active === "orderHistory" ? "Order History" : active.charAt(0).toUpperCase() + active.slice(1)}
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full mt-3 shadow-lg"></div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20 animate-fadeIn">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-card-20 border-t-card-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 bg-card-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile */}
            {active === "profile" && profileData && !loading && (
              <div className="bg-card backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-5 bg-card rounded-xl hover:bg-card-20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <div className="bg-gradient-to-br from-accent to-accent/80 p-3 rounded-full shadow-lg">
                      <User size={24} className="text-button-text" />
                    </div>
                    <div>
                      <p className="text-sm text-button-text/70 font-medium">Name</p>
                      <p className="text-xl font-bold text-button-text">{profileData.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 bg-card rounded-xl hover:bg-card-20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-full shadow-lg">
                      <Phone size={24} className="text-button-text" />
                    </div>
                    <div>
                      <p className="text-sm text-button-text/70 font-medium">Mobile</p>
                      <p className="text-xl font-bold text-button-text">{profileData.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 bg-card rounded-xl hover:bg-card-20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-full shadow-lg">
                      <Mail size={24} className="text-button-text" />
                    </div>
                    <div>
                      <p className="text-sm text-button-text/70 font-medium">Email</p>
                      <p className="text-xl font-bold text-button-text">{profileData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 bg-card rounded-xl hover:bg-card-20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <div className="bg-gradient-to-br from-accent to-accent/80 p-3 rounded-full shadow-lg">
                      <MapPin size={24} className="text-button-text" />
                    </div>
                    <div>
                      <p className="text-sm text-button-text/70 font-medium">Pincode</p>
                      <p className="text-xl font-bold text-button-text">{profileData.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart */}
            {active === "cart" && !loading && (
              <Cart cartData={cart} onRefresh={refreshCart} />
            )}

            {/* Wishlist */}
            {active === "wishlist" && !loading && (
              <div className="bg-card backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-button-text drop-shadow-lg">My Wishlist</h2>
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.wishlist_id} >
                        <Wishlist
                          item={item}
                          onRemove={removeFromWishlist}
                          onAddToCart={addToCartFromWishlist}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Heart size={64} className="mx-auto text-button-text/50 mb-4" />
                    <p className="text-xl text-button-text/80">Your wishlist is empty.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Orders */}
            {active === "orders" && !loading && (
              <div className="animate-fadeIn">
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => <Order key={order.id} order={order} />)}
                  </div>
                ) : (
                  <div className="bg-card backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border">
                    <div className="text-center py-16">
                      <ShoppingBag size={64} className="mx-auto text-button-text/50 mb-4" />
                      <p className="text-xl text-button-text/80">No active orders found.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order History */}
            {active === "orderHistory" && !loading && (
              <div className="animate-fadeIn">
                {orderHistory.length > 0 ? (
                  <div className="space-y-4">
                    {orderHistory.map((order) => <OrderHistory key={order.id} order={order} />)}
                  </div>
                ) : (
                  <div className="bg-card backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border">
                    <div className="text-center py-16">
                      <ShoppingBag size={64} className="mx-auto text-button-text/50 mb-4" />
                      <p className="text-xl text-button-text/80">No order history found.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-fadeIn">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <LogOut size={32} className="text-red-600" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Confirm Logout</h3>
            <p className="text-gray-600 mb-8">Are you sure you want to logout from your account?</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 bg-card-20 text-foreground rounded-xl font-semibold hover:bg-card transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 btn-primary rounded-xl font-semibold hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Main component with Suspense boundary
export default function Profile() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-card-20 border-t-card-50"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}