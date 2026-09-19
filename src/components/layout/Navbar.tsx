import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, Heart, Search, User, Sparkles, ChevronDown, 
  Plus, Check, ShieldCheck, Repeat, X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentPage, setCurrentPage, 
    pets, activePet, setActivePet, setIsPetModalOpen, setEditingPet,
    cart, setIsCartOpen,
    wishlist,
    searchQuery, setSearchQuery,
    rewards,
    isLoggedIn
  } = useStore();

  const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const petDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistItemCount = wishlist.length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (petDropdownRef.current && !petDropdownRef.current.contains(e.target as Node)) {
        setIsPetDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('shop');
      setIsSearchOpen(false);
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
      {/* Top micro-announcement banner */}
      <div className="bg-[#4A154B] text-white px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
        <span>Fresh batches, vet-backed recipes. Save 10% on every auto-delivery order!</span>
        <button 
          onClick={() => setCurrentPage('subscriptions')}
          className="underline hover:text-[#FF6B4A] transition-colors ml-1 font-semibold"
        >
          Explore Subscriptions
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              id="brand-logo-btn"
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4A154B] to-[#7B2CBF] flex items-center justify-center text-white shadow-md shadow-purple-900/10 group-hover:scale-105 transition-transform">
                <span className="text-xl">🐾</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#4A154B] leading-none">
                  Treatz
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B4A] leading-none mt-1">
                  Better Food. Happier Pets.
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Main Navigation">
              {[
                { id: 'home', label: 'Home' },
                { id: 'shop', label: 'Shop All' },
                { id: 'dogs', label: 'Dogs 🐕' },
                { id: 'cats', label: 'Cats 🐈' },
                { id: 'subscriptions', label: 'Subscriptions 🔄' },
                { id: 'rewards', label: 'Rewards 🎁' },
              ].map(link => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => setCurrentPage(link.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive 
                        ? 'text-[#4A154B] bg-purple-50' 
                        : 'text-gray-600 hover:text-[#4A154B] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activePet ? `Search food, chews, or care for ${activePet.name}...` : "Search food, treats, litter & care..."}
                className="w-full pl-10 pr-10 py-2 rounded-xl text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B] focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons & Active Pet Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Active Pet Switcher Dropdown */}
            <div className="relative" ref={petDropdownRef}>
              <button
                id="active-pet-switcher-btn"
                onClick={() => setIsPetDropdownOpen(!isPetDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-peach-50 bg-[#FFEFE8] border border-[#FF6B4A]/30 text-gray-800 text-xs sm:text-sm font-semibold hover:bg-[#FFE5DC] transition-all shadow-2xs"
                title="Switch active pet for tailored recommendations"
              >
                {activePet ? (
                  <>
                    <span className="text-base">{activePet.species === 'dog' ? '🐶' : '🐱'}</span>
                    <span className="hidden sm:inline font-bold text-[#FF6B4A]">{activePet.name}</span>
                    <span className="sm:hidden font-bold text-[#FF6B4A]">{activePet.name.slice(0, 5)}</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">🐾</span>
                    <span className="hidden sm:inline font-medium text-gray-600">Select Pet</span>
                  </>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {isPetDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-purple-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Shopping For</p>
                    <p className="text-xs text-gray-500 mt-0.5">Recommendations adapt to selected pet</p>
                  </div>

                  <div className="py-1 max-h-56 overflow-y-auto">
                    {pets.map(pet => {
                      const isSelected = activePet?.id === pet.id;
                      return (
                        <button
                          key={pet.id}
                          onClick={() => {
                            setActivePet(pet);
                            setIsPetDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-purple-50/70 transition-colors ${
                            isSelected ? 'bg-purple-50 text-[#4A154B] font-semibold' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{pet.species === 'dog' ? '🐶' : '🐱'}</span>
                            <div>
                              <p className="text-sm font-bold leading-tight">{pet.name}</p>
                              <p className="text-xs text-gray-500 leading-tight">{pet.breed} • {pet.age}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#4A154B]" />}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        setActivePet(null);
                        setIsPetDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-xs text-left hover:bg-gray-50 transition-colors ${
                        !activePet ? 'font-bold text-[#4A154B]' : 'text-gray-500'
                      }`}
                    >
                      Browse general catalog (no active pet)
                    </button>
                  </div>

                  <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                    <button
                      id="add-new-pet-nav-btn"
                      onClick={() => {
                        setEditingPet(null);
                        setIsPetModalOpen(true);
                        setIsPetDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-purple-200 text-xs font-bold text-[#4A154B] hover:bg-purple-50 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Another Pet Profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-[#4A154B] hover:bg-purple-50"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              id="navbar-wishlist-btn"
              onClick={() => {
                setCurrentPage('account');
              }}
              className="relative p-2 rounded-xl text-gray-600 hover:text-[#FF6B4A] hover:bg-purple-50 transition-colors"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className={`w-5 h-5 ${wishlistItemCount > 0 ? 'text-[#FF6B4A] fill-[#FF6B4A]' : ''}`} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF6B4A] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistItemCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-gray-600 hover:text-[#4A154B] hover:bg-purple-50 transition-colors"
              aria-label="Open Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#4A154B] text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Account / Admin Menu */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                id="navbar-account-btn"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-all text-xs font-semibold text-gray-700"
                aria-label="User Account"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[#4A154B] font-bold text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline">Account</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-purple-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">Alex Morgan</p>
                    <p className="text-xs text-gray-500 truncate">alex.morgan@example.com</p>
                    <div className="flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-md bg-purple-50 text-[#4A154B] text-xs font-semibold">
                      <Sparkles className="w-3 h-3 text-[#FF6B4A]" />
                      <span>{rewards.currentPoints} Treatz Points</span>
                    </div>
                  </div>

                  <div className="py-1 text-sm">
                    <button
                      onClick={() => {
                        setCurrentPage('account');
                        setIsAccountDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 hover:text-[#4A154B] flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      My Pet Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('subscriptions');
                        setIsAccountDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 hover:text-[#4A154B] flex items-center gap-2"
                    >
                      <Repeat className="w-4 h-4 text-gray-400" />
                      Auto-Replenish Subscriptions
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('rewards');
                        setIsAccountDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 hover:text-[#4A154B] flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-gray-400" />
                      Treatz Rewards & Vouchers
                    </button>

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      id="nav-admin-console-btn"
                      onClick={() => {
                        setCurrentPage('admin');
                        setIsAccountDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-[#4A154B] font-bold hover:bg-purple-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#4A154B]" />
                      Admin Control Hub
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Expanded Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-2 pb-3 border-t border-gray-100 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activePet ? `Search for ${activePet.name}...` : "Search food, treats, care..."}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
                autoFocus
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>
        )}
      </div>
    </header>
  );
};
