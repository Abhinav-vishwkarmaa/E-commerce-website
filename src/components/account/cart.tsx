'use client';
import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, Truck, AlertCircle, MapPin, Edit, Check } from 'lucide-react';

const apiUrl =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "") +
  (process.env.NEXT_PUBLIC_API_VERSION ?? "");

interface CartItem {
  cart_id: number;
  seller_product_id: number;
  product_name: string;
  description: string;
  slug: string;
  qty: number;
  stock_qty: number;
  unit: string;
  price: number;
  act_price: number;
  item_total: number;
  original_total: number;
  discount: number;
  pincode: number;
  image: string;
  is_available: boolean;
}

interface CartSummary {
  total_items: number;
  total_quantity: number;
  rawSubtotal: number;
  subtotal: number;
  original_total: number;
  discount: number;
  delivery_fee: number;
  handling_fee: number;
  tip: number;
  coupon: any;
  total: number;
}

interface CartData {
  items: CartItem[];
  summary: CartSummary;
  delivery_address_id: number;
  free_delivery_threshold: number;
  current_amount: number;
  amount_needed_for_free_delivery: number;
}

interface CartProps {
  cartData: CartData | null;
  onRefresh: () => void;
}

export default function Cart({ cartData, onRefresh }: CartProps) {
  const [updating, setUpdating] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/user/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method: "cod",
          delivery_notes: "Please deliver in the morning"
        }),
      });

      if (response.ok) {
        onRefresh();
        alert("Order placed successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Place order error:", err);
      alert("Error placing order");
    }
  };

  // Update quantity
  const updateQuantity = async (cartId: number, newQty: number) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/user/cart/items/${cartId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error("Update quantity error:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Apply coupon
  const applyCoupon = async () => {
    if (couponCode.trim() === "") {
      alert("Please enter a coupon code");
      return;
    }

    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/user/cart/coupon`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coupon_code: couponCode }),
      });

      if (response.ok) {
        onRefresh();
        alert("Coupon applied successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to apply coupon: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Apply coupon error:", err);
      alert("Error applying coupon");
    }
  };

  // Remove single item
  const removeItem = async (cartId: number) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/user/cart/items/${cartId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error("Remove item error:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Remove all items
  const removeAllItems = async () => {
    if (!window.confirm("Are you sure you want to remove all items from your cart?")) {
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("ilb-token");
      const response = await fetch(`${apiUrl}/user/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onRefresh();
      } else {
        // If clear endpoint doesn't exist, remove items one by one
        const promises = cartData?.items.map(item => removeItem(item.cart_id)) || [];
        await Promise.all(promises);
        onRefresh();
      }
    } catch (err) {
      console.error("Remove all items error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleQuantityChange = (cartId: number, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      updateQuantity(cartId, newQty);
    }
  };

  const handleTipChange = (value: number) => {
    setTipAmount(value);
    if (cartData) {
      cartData.summary.tip = value;
      cartData.summary.total = cartData.summary.subtotal - cartData.summary.discount + 
        cartData.summary.delivery_fee + cartData.summary.handling_fee + value;
    }
  };

  // Empty cart state
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 animate-fadeIn">
        <div className="text-center py-16">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-800 mb-2">Your cart is empty.</p>
          <p className="text-sm text-gray-600">Add items to get started!</p>
        </div>
      </div>
    );
  }

  const { items, summary, free_delivery_threshold, amount_needed_for_free_delivery } = cartData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header with Remove All */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart ({summary.total_items} items)</h2>
          <button
            onClick={removeAllItems}
            disabled={updating}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
            <span className="font-medium">Remove All</span>
          </button>
        </div>

        {/* Delivery Address Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Delivery Address</p>
                <p className="text-xs text-blue-700">
                  {cartData.delivery_address_id ? `Address ID: ${cartData.delivery_address_id}` : 'No address selected'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              <span className="text-sm font-medium">Change</span>
            </button>
          </div>
        </div>

        {/* Free Delivery Progress */}
        {amount_needed_for_free_delivery > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck size={20} className="text-green-600" />
              <p className="text-sm font-semibold text-green-800">
                Add ₹{amount_needed_for_free_delivery.toFixed(2)} more for FREE delivery!
              </p>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((summary.subtotal / free_delivery_threshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.cart_id}
            className={`bg-white rounded-xl shadow-lg border border-gray-200 p-4 transition-all duration-300 hover:shadow-xl ${
              !item.is_available ? 'opacity-60' : ''
            } ${updating ? 'pointer-events-none' : ''}`}
          >
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.product_name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
                {!item.is_available && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <AlertCircle size={32} className="text-white" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">{item.unit}</p>
                    {!item.is_available && (
                      <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.cart_id)}
                    disabled={updating}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-600">₹{item.price}</span>
                    {item.act_price > item.price && (
                      <>
                        <span className="text-sm text-gray-500 line-through">₹{item.act_price}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                          {Math.round(((item.act_price - item.price) / item.act_price) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                    <button
                      onClick={() => handleQuantityChange(item.cart_id, item.qty, -1)}
                      disabled={!item.is_available || item.qty <= 1 || updating}
                      className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-bold text-gray-900 min-w-[20px] text-center">{item.qty}</span>
                    <button
                      onClick={() => handleQuantityChange(item.cart_id, item.qty, 1)}
                      disabled={!item.is_available || item.qty >= item.stock_qty || updating}
                      className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Stock Info */}
                {item.is_available && item.stock_qty <= 5 && (
                  <p className="text-xs text-orange-600 mt-2">
                    Only {item.stock_qty} left in stock
                  </p>
                )}

                {/* Item Total */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Item Total:</span>
                    <span className="text-lg font-bold text-gray-900">₹{item.item_total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
        
      {/* Order Summary - Sticky */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
         
          {/* Coupon Section */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon?</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button 
                onClick={applyCoupon} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal ({summary.total_items} {summary.total_items === 1 ? 'item' : 'items'})</span>
              <span>₹{summary.subtotal.toFixed(2)}</span>
            </div>

            {summary.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{summary.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span className={summary.delivery_fee === 0 ? 'text-green-600 font-semibold' : ''}>
                {summary.delivery_fee === 0 ? 'FREE' : `₹${summary.delivery_fee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Handling Fee</span>
              <span>₹{summary.handling_fee.toFixed(2)}</span>
            </div>

            {/* Tip Section */}
            <div className="border-t border-gray-200 pt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Tip (Optional)</label>
              <div className="flex gap-2 mb-2">
                {[10, 20, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleTipChange(amount)}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-colors text-sm font-medium ${
                      tipAmount === amount
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom amount"
                value={tipAmount || ''}
                onChange={(e) => handleTipChange(Number(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ₹{(summary.subtotal - summary.discount + summary.delivery_fee + summary.handling_fee + tipAmount).toFixed(2)}
              </span>
            </div>
          </div>

          <button 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={items.some(item => !item.is_available)}
            onClick={(e)=>{
                e.preventDefault()
                e.stopPropagation()
                placeOrder()
            }}
          >
            {items.some(item => !item.is_available) ? 'Remove unavailable items' : 'Proceed to Checkout'}
          </button>

          {/* Additional Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Final amount may vary based on delivery address and availability.
            </p>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Delivery Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="border border-gray-300 rounded-lg p-4 hover:border-blue-600 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Current Address</p>
                    <p className="text-sm text-gray-600">Address ID: {cartData.delivery_address_id}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to view full details</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors font-medium">
                + Add New Address
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  onRefresh();
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}