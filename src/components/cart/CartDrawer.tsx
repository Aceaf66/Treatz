import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, 
  Repeat, Tag, ShieldCheck, Sparkles, Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, setIsCartOpen,
    cart, removeFromCart, updateCartQuantity, clearCart,
    cartSubtotal, cartDiscount, cartDeliveryFee, cartTotal,
    appliedCoupon, applyCoupon, removeCoupon,
    setIsCheckoutOpen,
    rewards, activePet
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput.trim()) {
      const ok = applyCoupon(couponCodeInput);
      if (ok) setCouponCodeInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="cart-drawer-container"
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 relative"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-[#4A154B]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Your Pet Cart</h2>
              <p className="text-xs text-gray-500">{cart.length} item{cart.length !== 1 ? 's' : ''} for your pack</p>
            </div>
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-5 py-3 bg-purple-50/70 border-b border-purple-100 text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between font-semibold text-gray-700">
                <span>Add <strong>₹{amountNeededForFreeShipping}</strong> more for <strong>FREE Delivery</strong></span>
                <span>{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden">
                <div 
                  className="h-full bg-[#FF6B4A] rounded-full transition-all duration-500" 
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>You have qualified for Free Express Delivery! 🎉</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl mb-3">
                🐾
              </div>
              <h3 className="text-base font-bold text-gray-800">Your Treatz cart is empty</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                {activePet ? `Explore recipes Bruno and your pack will love!` : 'Discover nutritious foods, chews, and care treats.'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#3B1443]"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.isSubscription 
                ? Math.round(item.product.price * 0.9) 
                : (item.product.discount > 0 ? Math.round(item.product.price * (1 - item.product.discount / 100)) : item.product.price);

              return (
                <div 
                  key={`${item.product.id}-${item.isSubscription}`}
                  className="flex gap-3.5 p-3 rounded-2xl bg-gray-50/60 border border-gray-100 hover:border-purple-200 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-white shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-500">{item.product.weightSize}</p>

                    {item.isSubscription && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4A154B] bg-purple-100 px-2 py-0.5 rounded-md mt-1">
                        <Repeat className="w-2.5 h-2.5" />
                        Auto-Ship every {item.subscriptionFrequency || 30} days (-10%)
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/80">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-xs font-bold rounded-l-md"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-xs font-bold rounded-r-md"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-black text-gray-900">
                        ₹{itemPrice * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Coupon input & Summary Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-200 bg-white space-y-4">
            {/* Coupon Code section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} applied (₹{appliedCoupon.discountAmount} off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Coupon (e.g. TREATZ100)"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs uppercase font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-purple-100 text-[#4A154B] text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Quick Pricing Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{cartSubtotal}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {cartDeliveryFee === 0 ? (
                    <strong className="text-emerald-600 uppercase text-[11px]">FREE</strong>
                  ) : (
                    `₹${cartDeliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                <span>Final Total</span>
                <span className="text-lg text-[#4A154B]">₹{cartTotal}</span>
              </div>
            </div>

            {/* Loyalty points info */}
            <p className="text-[11px] text-purple-900/80 bg-purple-50 px-3 py-1.5 rounded-lg flex items-center justify-between">
              <span>🐾 You'll earn from this order:</span>
              <strong className="font-bold">+{Math.round(cartTotal / 10)} Treatz Points</strong>
            </p>

            {/* Proceed Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#4A154B] hover:bg-[#3B1443] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/15 transition-all active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
