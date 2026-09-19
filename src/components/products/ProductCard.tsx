import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { checkPetCompatibility } from '../../services/recommendationEngine';
import { Star, Heart, Plus, Sparkles, Repeat, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  recommendationReason?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, recommendationReason }) => {
  const { 
    openProductDetail, addToCart, 
    wishlist, toggleWishlist,
    activePet
  } = useStore();

  const isSaved = wishlist.includes(product.id);
  const compatibility = checkPetCompatibility(product, activePet);
  const discountedPrice = product.discount > 0 
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-purple-100/80 hover:border-purple-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Top Media & Badges Container */}
      <div className="relative w-full pt-[75%] bg-purple-50/40 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FF6B4A] text-white shadow-xs">
              {product.discount}% OFF
            </span>
          )}
          {product.isSubscriptionEligible && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4A154B] text-white flex items-center gap-1 shadow-xs">
              <Repeat className="w-2.5 h-2.5" />
              Auto-Ship 10% Off
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-[#FF6B4A] shadow-xs hover:scale-110 active:scale-95 transition-all z-10"
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'text-[#FF6B4A] fill-[#FF6B4A]' : ''}`} />
        </button>

        {/* Dynamic Pet Match indicator */}
        {activePet && compatibility.isCompatible && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[11px] font-semibold text-[#4A154B] flex items-center justify-between border border-purple-100 shadow-xs">
            <span className="flex items-center gap-1 truncate">
              <Sparkles className="w-3 h-3 text-[#FF6B4A] shrink-0" />
              <span className="truncate">Matches {activePet.name}</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {compatibility.score}% Fit
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1">
            <span className="font-semibold text-[#4A154B] uppercase tracking-wider text-[11px]">{product.brand}</span>
            <span className="text-gray-400 text-[11px]">{product.weightSize}</span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => openProductDetail(product)}
            className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 hover:text-[#4A154B] cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Recommendation snippet if passed */}
          {recommendationReason && (
            <p className="mt-1 text-xs text-purple-900/80 bg-purple-50/70 px-2 py-1 rounded-md line-clamp-1 italic">
              🐾 {recommendationReason}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs font-medium text-gray-500 capitalize">{product.category}</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">₹{discountedPrice}</span>
              {product.discount > 0 && (
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              )}
            </div>
            <p className="text-[10px] text-gray-500">Inclusive of all taxes</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`quick-view-btn-${product.id}`}
              type="button"
              onClick={() => openProductDetail(product)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Details
            </button>
            <button
              id={`quick-add-cart-btn-${product.id}`}
              type="button"
              onClick={() => addToCart(product, 1)}
              className="p-2 rounded-xl bg-[#4A154B] text-white hover:bg-[#3B1443] transition-all active:scale-95 shadow-xs"
              title="Quick add 1 to cart"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
