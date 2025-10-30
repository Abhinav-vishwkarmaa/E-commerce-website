"use client";

import { Package, Calendar, CreditCard, MapPin, CheckCircle, Clock, XCircle, AlertCircle, ShoppingBag } from "lucide-react";

type Address = {
  house_number: string;
  street: string;
  area: string;
  landmark?: string;
  building_name?: string;
  city: string;
  state: string;
  pincode: string;
};

type OrderType = {
  id: number;
  order_id: string;
  order_status: string;
  grand_total: string;
  payment_status?: string;
  payment_type: string;
  created_at: string;
  delivery_address: string;
  image?: string;
  address: Address;
};

type OrderHistoryProps = {
  order: OrderType;
};

export default function OrderHistory({ order }: OrderHistoryProps) {
  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    if (statusUpper === 'DELIVERED' || statusUpper === 'COMPLETED') {
      return 'from-green-400 to-green-600';
    }
    if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING') {
      return 'from-yellow-400 to-orange-500';
    }
    if (statusUpper === 'SHIPPED' || statusUpper.includes('TRANSIT')) {
      return 'from-blue-400 to-blue-600';
    }
    if (statusUpper === 'CANCELED' || statusUpper === 'CANCELLED') {
      return 'from-red-400 to-red-600';
    }
    return 'from-purple-400 to-purple-600';
  };

  const getStatusIcon = (status: string) => {
    const statusUpper = status.toUpperCase();
    if (statusUpper === 'DELIVERED' || statusUpper === 'COMPLETED') {
      return <CheckCircle size={20} />;
    }
    if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING') {
      return <Clock size={20} />;
    }
    if (statusUpper === 'SHIPPED' || statusUpper.includes('TRANSIT')) {
      return <Package size={20} />;
    }
    if (statusUpper === 'CANCELED' || statusUpper === 'CANCELLED') {
      return <XCircle size={20} />;
    }
    return <ShoppingBag size={20} />;
  };

  const getPaymentStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-500';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('paid') || statusLower.includes('success')) {
      return 'bg-green-500';
    }
    if (statusLower.includes('pending')) {
      return 'bg-yellow-500';
    }
    if (statusLower.includes('failed') || statusLower.includes('cancelled')) {
      return 'bg-red-500';
    }
    return 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = () => {
    const parts = [
      order.address.house_number,
      order.address.building_name,
      order.address.street,
      order.address.area,
      order.address.city,
      order.address.state,
      order.address.pincode
    ].filter(Boolean);
    
    let addressStr = parts.join(', ');
    if (order.address.landmark) {
      addressStr += ` (Near ${order.address.landmark})`;
    }
    return addressStr;
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

  <div className="bg-card backdrop-blur-lg rounded-2xl p-6 mb-4 border border-border shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] animate-slideInUp overflow-hidden relative group">
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          {/* Header Section with Image */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg ring-4 ring-card-20 transform transition-transform duration-300 group-hover:scale-110">
                {order.image ? (
                  <img 
                    src={order.image} 
                    alt={order.order_id}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect fill="%23ddd" width="128" height="128"/></svg>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-card-20 flex items-center justify-center">
                    <ShoppingBag size={48} className="text-foreground/70" />
                  </div>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-foreground/70" />
                    <span className="text-foreground/70 text-sm font-medium">Order ID:</span>
                  </div>
                  <span className="text-foreground font-bold text-lg tracking-wide">{order.order_id}</span>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {/* Order Status */}
                  <div className={`bg-gradient-to-r ${getStatusColor(order.order_status)} px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform transition-all duration-300 hover:scale-105`}>
                    {getStatusIcon(order.order_status)}
                    <span className="font-bold text-button-text text-xs uppercase tracking-wider">
                      {order.order_status}
                    </span>
                  </div>

                  {/* Payment Status */}
                  {order.payment_status && (
                    <div className={`${getPaymentStatusColor(order.payment_status)} px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform transition-all duration-300 hover:scale-105`}>
                      <CreditCard size={16} className="text-button-text" />
                      <span className="font-bold text-button-text text-xs uppercase tracking-wider">
                        {order.payment_status}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-2">
                <div className="bg-card-20 backdrop-blur-sm px-3 py-1.5 rounded-full text-foreground text-xs font-semibold flex items-center gap-1.5">
                  <CreditCard size={14} />
                  {order.payment_type}
                </div>
                <div className="bg-card-20 backdrop-blur-sm px-3 py-1.5 rounded-full text-foreground text-xs font-semibold flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(order.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Total Amount */}
            <div className="bg-card rounded-xl p-4 backdrop-blur-sm transform transition-all duration-300 hover:bg-card-20 hover:scale-105 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-lg shadow-lg">
                  <CreditCard size={22} className="text-button-text" />
                </div>
                <div>
                  <p className="text-foreground/70 text-xs font-medium mb-1">Total Amount</p>
                  <p className="text-foreground font-bold text-2xl">₹{parseFloat(order.grand_total).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-card rounded-xl p-4 backdrop-blur-sm transform transition-all duration-300 hover:bg-card-20 hover:scale-105 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-lg shadow-lg flex-shrink-0">
                  <MapPin size={22} className="text-button-text" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground/70 text-xs font-medium mb-1">Delivery Address</p>
                  <p className="text-foreground font-semibold text-sm leading-relaxed">
                    {formatAddress()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reorder Button - Only for delivered orders */}
          {(order.order_status.toUpperCase() === 'DELIVERED' || order.order_status.toUpperCase() === 'COMPLETED') && (
            <button className="w-full btn-accent font-bold py-3.5 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
              <Package size={20} />
              <span>Reorder</span>
            </button>
          )}

          {/* View Details Button - For other statuses */}
          {order.order_status.toUpperCase() !== 'DELIVERED' && order.order_status.toUpperCase() !== 'COMPLETED' && (
            <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-button-text font-bold py-3.5 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
              <AlertCircle size={20} />
              <span>View Details</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}