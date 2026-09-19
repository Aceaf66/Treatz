import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Compass, ShoppingBag, Award, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentPage, setCurrentPage, cart, setIsCartOpen } = useStore();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav 
      id="mobile-bottom-nav" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 py-1.5 px-4 flex items-center justify-around shadow-lg"
      aria-label="Mobile Navigation"
    >
      <button
        onClick={() => setCurrentPage('home')}
        className={`flex flex-col items-center gap-1 p-1 text-xs font-semibold ${
          currentPage === 'home' ? 'text-[#4A154B]' : 'text-gray-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setCurrentPage('shop')}
        className={`flex flex-col items-center gap-1 p-1 text-xs font-semibold ${
          currentPage === 'shop' || currentPage === 'dogs' || currentPage === 'cats' ? 'text-[#4A154B]' : 'text-gray-500'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Shop</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 p-1 text-xs font-semibold text-gray-500"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#4A154B] text-white text-[10px] font-bold flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <button
        onClick={() => setCurrentPage('rewards')}
        className={`flex flex-col items-center gap-1 p-1 text-xs font-semibold ${
          currentPage === 'rewards' ? 'text-[#4A154B]' : 'text-gray-500'
        }`}
      >
        <Award className="w-5 h-5" />
        <span>Rewards</span>
      </button>

      <button
        onClick={() => setCurrentPage('account')}
        className={`flex flex-col items-center gap-1 p-1 text-xs font-semibold ${
          currentPage === 'account' ? 'text-[#4A154B]' : 'text-gray-500'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
