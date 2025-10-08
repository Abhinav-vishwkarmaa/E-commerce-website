"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, Heart, ShoppingCart, LogOut, Mail, Phone, MapPin, X } from "lucide-react";
import Order from "@/components/account/orders";
import OrderHistory from "@/components/account/orderHistory";

const apiUrl = "http://localhost:3005/api/v1";

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

interface ProfileResponse {
  status: boolean;
  code: number;
  data: UserData;
}

interface OrderData {
  id: number;
  order_id: string;
  total_amount: string;
  order_status: string;
  payment_type: string;
  image?: string;
  created_at: string;
  delivery_address: string;
  address: any;
}

export default function Profile() {
  const router = useRouter();
  const [active, setActive] = useState<"profile" | "orders" | "wishlist" | "cart" | "orderHistory">("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigation = [
    { id: 1, nav: "profile", icon: <User size={20} />, label: "Profile" },
    { id: 2, nav: "orders", icon: <ShoppingBag size={20} />, label: "Current Orders" },
    { id: 3, nav: "wishlist", icon: <Heart size={20} />, label: "Wishlist" },
    { id: 4, nav: "cart", icon: <ShoppingCart size={20} />, label: "Cart" },
    { id: 5, nav: "orderHistory", icon: <ShoppingBag size={20} />, label: "Order History" },
    { id: 6, nav: "logout", icon: <LogOut size={20} />, label: "Logout" },
  ];

  const [profileData, setProfile] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
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
  };

  const fetchData = async (endpoint: string, setter: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      
      if (result.success || result.status) {
        setter(result.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setter(endpoint.includes("profile") ? null : []);
    } finally {
      setLoading(false);
    }
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
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
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

      <div className="flex min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 text-white animate-gradient">
        {/* Sidebar - Fixed */}
        <aside className="fixed left-0 top-0 h-screen w-80 p-6 bg-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center border-r border-white/20 animate-slideInLeft overflow-y-auto">
          <div className="mb-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-white/30 to-white/10 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl ring-4 ring-white/30 transition-transform duration-300 hover:scale-110">
              {profileData?.image ? (
                <img src={profileData.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">My Account</h2>
            {profileData && <p className="text-sm text-white/90 mt-2 font-medium">{profileData.name}</p>}
          </div>
          
          <nav className="flex flex-col space-y-2 w-full">
            {navigation.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                style={{animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards'}}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 animate-slideInLeft ${
                  active === item.nav 
                    ? "bg-white text-pink-500 shadow-xl font-semibold" 
                    : "hover:bg-white/20 text-white hover:shadow-lg"
                }`}
              >
                <div className={active === item.nav ? "text-pink-500" : "text-white"}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content - With left margin to account for fixed sidebar */}
        <main className="flex-1 ml-80 p-8 overflow-y-auto animate-slideInRight">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold drop-shadow-lg animate-fadeIn">
                {active === "orderHistory" ? "Order History" : active.charAt(0).toUpperCase() + active.slice(1)}
              </h1>
              <div className="h-1 w-20 bg-white rounded-full mt-3 shadow-lg"></div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20 animate-fadeIn">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 bg-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile */}
            {active === "profile" && profileData && !loading && (
              <div className="bg-white/15 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-5 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-3 rounded-full shadow-lg">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-medium">Name</p>
                      <p className="text-xl font-bold text-white">{profileData.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-full shadow-lg">
                      <Phone size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-medium">Mobile</p>
                      <p className="text-xl font-bold text-white">{profileData.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-full shadow-lg">
                      <Mail size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-medium">Email</p>
                      <p className="text-xl font-bold text-white">{profileData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-5 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <div className="bg-gradient-to-br from-red-400 to-pink-600 p-3 rounded-full shadow-lg">
                      <MapPin size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70 font-medium">Pincode</p>
                      <p className="text-xl font-bold text-white">{profileData.pincode}</p>
                    </div>
                  </div>
                </div>
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
                  <div className="bg-white/15 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
                    <div className="text-center py-16">
                      <ShoppingBag size={64} className="mx-auto text-white/50 mb-4" />
                      <p className="text-xl text-white/80">No active orders found.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {active === "wishlist" && !loading && (
              <div className="bg-white/15 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">My Wishlist</h2>
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render wishlist items */}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Heart size={64} className="mx-auto text-white/50 mb-4" />
                    <p className="text-xl text-white/80">Your wishlist is empty.</p>
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
            {active === "cart" && !loading && (
              <div className="bg-white/15 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">My Cart</h2>
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {/* Render cart items */}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ShoppingCart size={64} className="mx-auto text-white/50 mb-4" />
                    <p className="text-xl text-white/80">Your cart is empty.</p>
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
                  <div className="bg-white/15 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
                    <div className="text-center py-16">
                      <ShoppingBag size={64} className="mx-auto text-white/50 mb-4" />
                      <p className="text-xl text-white/80">No order history found.</p>
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-fadeIn">
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
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
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