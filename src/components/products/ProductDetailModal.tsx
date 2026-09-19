import React, { useState } from 'react';
import { Product, SubscriptionFrequency } from '../../types';
import { useStore } from '../../context/StoreContext';
import { checkPetCompatibility } from '../../services/recommendationEngine';
import { INITIAL_REVIEWS } from '../../data/mockData';
import { 
  X, Star, Heart, Repeat, ShoppingBag, ShieldCheck, 
  Sparkles, CheckCircle2, AlertTriangle, ChevronRight,
  Info, Leaf, ArrowRight
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, closeProductDetail, 
    addToCart, setIsCartOpen, setIsCheckoutOpen,
    wishlist, toggleWishlist,
    activePet, products, openProductDetail
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'one_time' | 'subscription'>('one_time');
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<SubscriptionFrequency>(30);
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'reviews'>('overview');

  if (!selectedProduct) return null;

  const isSaved = wishlist.includes(selectedProduct.id);
  const compatibility = checkPetCompatibility(selectedProduct, activePet);

  const basePrice = selectedProduct.discount > 0
    ? Math.round(selectedProduct.price * (1 - selectedProduct.discount / 100))
    : selectedProduct.price;

  const subscriptionPrice = Math.round(basePrice * 0.9); // Extra 10% off
  const finalPrice = purchaseType === 'subscription' ? subscriptionPrice : basePrice;

  // Reviews for this product or fallback reviews
  const productReviews = INITIAL_REVIEWS.filter(r => r.productId === selectedProduct.id);
  const displayReviews = productReviews.length > 0 ? productReviews : [
    {
      id: 'rev-def-1',
      productId: selectedProduct.id,
      userName: 'Pet Parent Community',
      petName: activePet ? activePet.name : 'Happy Pet',
      rating: 5,
      date: 'Recent verified order',
      comment: `Our ${selectedProduct.species === 'dog' ? 'pup' : 'cat'} loved this from day one. Packaging was fresh and ingredients are noticeably high grade.`,
      verifiedPurchase: true,
    }
  ];

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== selectedProduct.id && (p.species === selectedProduct.species || p.category === selectedProduct.category))
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(
      selectedProduct, 
      quantity, 
      purchaseType === 'subscription', 
      subscriptionFrequency
    );
    closeProductDetail();
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(
      selectedProduct, 
      quantity, 
      purchaseType === 'subscription', 
      subscriptionFrequency
    );
    closeProductDetail();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        id="product-detail-modal"
        className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl border border-purple-100 my-6 max-h-[92vh] overflow-y-auto relative"
      >
        {/* Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-xs hover:scale-105 transition-all"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Gallery & Image */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-purple-50/50 border border-purple-100 aspect-square">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {selectedProduct.discount > 0 && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FF6B4A] text-white shadow-sm">
                  {selectedProduct.discount}% OFF
                </span>
              )}

              <button
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-400 hover:text-[#FF6B4A] shadow-md transition-all"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'text-[#FF6B4A] fill-[#FF6B4A]' : ''}`} />
              </button>
            </div>

            {/* Quick Benefits Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedProduct.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#4A154B] text-xs font-semibold capitalize">
                  #{tag.replace('_', ' ')}
                </span>
              ))}
            </div>

            {/* Personalized "Is this right for your pet?" Box */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-purple-50/90 to-peach-50/50 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#4A154B] text-white flex items-center justify-center text-xs">
                    🐾
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Is this right for {activePet ? activePet.name : 'your pet'}?
                  </h4>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#4A154B] border border-purple-100 shadow-2xs">
                  {compatibility.score}% Compatibility
                </span>
              </div>

              <p className="text-xs font-semibold text-gray-700">{compatibility.title}</p>

              {compatibility.highlights.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-emerald-800">
                  {compatibility.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {compatibility.considerations.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-amber-800">
                  {compatibility.considerations.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-3 text-[10px] text-gray-400 border-t border-purple-200/50 pt-2 italic">
                * Recommendations are for shopping convenience and are not veterinary advice.
              </p>
            </div>
          </div>

          {/* Right: Info & Purchase Controls */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="font-bold text-[#4A154B] uppercase tracking-wider">{selectedProduct.brand}</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{selectedProduct.weightSize}</span>
            </div>

            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
              {selectedProduct.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">{selectedProduct.rating} / 5</span>
              <span className="text-xs text-gray-400">({selectedProduct.reviewCount} customer reviews)</span>
            </div>

            {/* Price section */}
            <div className="mt-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">₹{finalPrice}</span>
                  {(selectedProduct.discount > 0 || purchaseType === 'subscription') && (
                    <span className="text-sm text-gray-400 line-through">₹{selectedProduct.price}</span>
                  )}
                  {purchaseType === 'subscription' && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Save Extra 10%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Free standard shipping on orders over ₹999</p>
              </div>

              {selectedProduct.stock > 0 ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  In Stock ({selectedProduct.stock} left)
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* One-Time vs Subscription Selector */}
            {selectedProduct.isSubscriptionEligible && (
              <div className="mt-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Select Delivery Format
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => setPurchaseType('one_time')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      purchaseType === 'one_time'
                        ? 'border-[#4A154B] bg-purple-50/50 ring-2 ring-[#4A154B]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-bold text-gray-900">One-Time Order</p>
                    <p className="text-xs text-gray-500 mt-0.5">Standard single delivery</p>
                    <p className="text-sm font-bold text-[#4A154B] mt-2">₹{basePrice}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPurchaseType('subscription')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      purchaseType === 'subscription'
                        ? 'border-[#4A154B] bg-purple-50/50 ring-2 ring-[#4A154B]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">Auto-Replenish 🔄</p>
                      <span className="text-[10px] font-black uppercase bg-[#FF6B4A] text-white px-1.5 py-0.5 rounded">
                        10% Off
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Never run low on pet food</p>
                    <p className="text-sm font-bold text-[#4A154B] mt-2">₹{subscriptionPrice}</p>
                  </button>

                </div>

                {purchaseType === 'subscription' && (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between gap-2 animate-in fade-in duration-150">
                    <span className="text-xs font-semibold text-gray-700">Deliver every:</span>
                    <select
                      value={subscriptionFrequency}
                      onChange={(e) => setSubscriptionFrequency(Number(e.target.value) as SubscriptionFrequency)}
                      className="text-xs font-bold bg-white border border-purple-300 rounded-lg px-2.5 py-1 text-[#4A154B] focus:outline-hidden"
                    >
                      <option value={7}>7 Days (Weekly)</option>
                      <option value={15}>15 Days (Bi-weekly)</option>
                      <option value={30}>30 Days (Monthly recommended)</option>
                      <option value={45}>45 Days</option>
                      <option value={60}>60 Days (Bi-monthly)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-gray-600 font-bold hover:bg-gray-100 flex items-center justify-center shadow-xs"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white text-gray-600 font-bold hover:bg-gray-100 flex items-center justify-center shadow-xs"
                >
                  +
                </button>
              </div>

              <button
                id="modal-add-to-cart-btn"
                type="button"
                onClick={handleAddToCart}
                className="flex-1 min-w-[140px] py-3 px-5 rounded-xl bg-[#4A154B] text-white text-sm font-bold hover:bg-[#3B1443] transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-950/10 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                id="modal-buy-now-btn"
                type="button"
                onClick={handleBuyNow}
                className="py-3 px-5 rounded-xl bg-[#FF6B4A] text-white text-sm font-bold hover:bg-[#E8502B] transition-all active:scale-98"
              >
                Buy Now
              </button>
            </div>

            {/* Tabbed Info (Overview, Nutrition, Reviews) */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex border-b border-gray-200 gap-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'nutrition', label: 'Nutrition & Ingredients' },
                  { id: 'reviews', label: `Reviews (${selectedProduct.reviewCount})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
                      activeTab === tab.id
                        ? 'border-[#4A154B] text-[#4A154B]'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {activeTab === 'overview' && (
                  <div>
                    <p>{selectedProduct.description}</p>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50">
                        <strong className="text-gray-900 block mb-1">Suitable For:</strong>
                        <span className="capitalize">{selectedProduct.species}s ({selectedProduct.ageGroup.join(', ')})</span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50">
                        <strong className="text-gray-900 block mb-1">Dietary Focus:</strong>
                        <span className="capitalize">{selectedProduct.dietaryPreference.join(', ').replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'nutrition' && (
                  <div>
                    <h5 className="font-bold text-gray-900 mb-2">Guaranteed Nutritional Analysis:</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      {Object.entries(selectedProduct.nutritionalInfo).map(([key, val]) => (
                        <div key={key} className="p-2.5 rounded-xl bg-purple-50/60 text-center">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block">{key}</span>
                          <strong className="text-sm font-extrabold text-[#4A154B]">{val}</strong>
                        </div>
                      ))}
                    </div>

                    <h5 className="font-bold text-gray-900 mb-1.5">Key Ingredients:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.ingredients.map(ing => (
                        <span key={ing} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {displayReviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{rev.userName}</span>
                            {rev.petName && (
                              <span className="text-xs text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full font-medium">
                                🐾 {rev.petName}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{rev.date}</span>
                        </div>

                        <div className="flex text-amber-400 my-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>

                        <p className="text-xs text-gray-600">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Related items */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Pet Parents Also Purchased
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.map(rel => (
                    <button
                      key={rel.id}
                      onClick={() => openProductDetail(rel)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-purple-50 text-left border border-gray-100 transition-colors flex items-center gap-2"
                    >
                      <img src={rel.image} alt={rel.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{rel.name}</p>
                        <p className="text-[11px] font-bold text-[#4A154B]">₹{rel.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
