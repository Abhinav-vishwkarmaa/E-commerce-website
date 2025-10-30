import { Heart, ShoppingCart, AlertCircle } from 'lucide-react';

export default function Wishlist({ item, onRemove, onAddToCart }: { 
  item: any;
  onRemove?: (wishlistId: number) => void;
  onAddToCart?: (item: any) => void;
}) {
  const hasDiscount = parseFloat(item.act_price) > parseFloat(item.price);
  const discountPercent = hasDiscount 
    ? Math.round(((parseFloat(item.act_price) - parseFloat(item.price)) / parseFloat(item.act_price)) * 100)
    : 0;

  return (
    <div className="border border-gray-200 rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
      <div className="relative">
        <img 
          src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={item.name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {discountPercent}% OFF
          </div>
        )}

        {/* Remove from Wishlist Button */}
        <button
          onClick={() => onRemove?.(item.wishlist_id)}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
          aria-label="Remove from wishlist"
        >
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        </button>

        {/* Availability Badge */}
        {!item.is_available && (
          <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-90 text-white px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[3rem]">
          {item.name}
        </h3>

        {/* Unit */}
        <p className="text-sm text-gray-500 mb-2">{item.unit}</p>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{parseFloat(item.price).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{parseFloat(item.act_price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Info */}
        {item.is_available && item.stock_quantity > 0 && (
          <p className="text-xs text-green-600 mb-3">
            {item.stock_quantity} in stock
          </p>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(item)}
          disabled={!item.is_available}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            item.is_available
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {item.is_available ? 'Add to Cart' : 'Unavailable'}
        </button>

        {/* Pincode Info */}
        <p className="text-xs text-gray-400 mt-2 text-center">
          Available at {item.pincode}
        </p>
      </div>
    </div>
  );
}

// Example Usage Component
function WishlistExample() {
  const sampleItem = {
    wishlist_id: 66,
    seller_product_id: 28,
    name: "Tata Salt Iodized Salt",
    description: "Contains the right amount of iodine, essential for proper mental and physical development.",
    act_price: "26.00",
    price: "25.00",
    stock_quantity: 300,
    unit: "1kg",
    pincode: 201303,
    image: "https://via.placeholder.com/300x200?text=Tata+Salt",
    is_available: true
  };

  const handleRemove = (wishlistId: number) => {
    console.log('Remove item:', wishlistId);
    alert(`Removed item ${wishlistId} from wishlist`);
  };

  const handleAddToCart = (item: any) => {
    console.log('Add to cart:', item);
    alert(`Added ${item.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Wishlist 
            item={sampleItem} 
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
          />
          <Wishlist 
            item={{...sampleItem, wishlist_id: 67, is_available: false, name: "Out of Stock Item"}} 
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}