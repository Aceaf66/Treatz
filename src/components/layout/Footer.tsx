import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShieldCheck, Truck, RotateCcw, Mail, Send, RotateCcw as ResetIcon } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, showToast, resetToDefaultData } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      showToast('Subscribed!', 'Welcome to the Treatz pack! Check your inbox for 15% off.');
      setEmailInput('');
    }
  };

  return (
    <footer id="main-footer" className="bg-[#180A1A] text-gray-300 pt-16 pb-24 lg:pb-12 border-t border-purple-950/40">
      {/* Value props trust bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B4A] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Quality Inspected</p>
              <p className="text-xs text-gray-400 mt-0.5">Vet-reviewed recipes & safe clean sourcing</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B4A] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Free Express Delivery</p>
              <p className="text-xs text-gray-400 mt-0.5">On all orders above ₹999 with live tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B4A] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Flexible Auto-Replenish</p>
              <p className="text-xs text-gray-400 mt-0.5">Never run out of food. Pause or cancel anytime</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B4A] shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Pet-First Nutrition</p>
              <p className="text-xs text-gray-400 mt-0.5">Recommendations tailored to breed & age</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4A154B] to-[#7B2CBF] flex items-center justify-center text-white font-black text-lg">
                🐾
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Treatz
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-sm">
              Better Food. Happier Pets. Treatz brings high-grade pet nutrition, personalized dietary matching, and frictionless auto-replenishment directly to pet parents.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white">Join the Pet Parent Circle</p>
              <form onSubmit={handleNewsletterSubmit} className="mt-2 flex gap-2 max-w-md">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-[#FF6B4A] flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#FF6B4A] text-white text-sm font-bold hover:bg-[#E8502B] transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-400 mt-2 font-medium">✓ You're on the VIP list!</p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Explore Shop</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentPage('dogs')} className="hover:text-white transition-colors">
                  Dog Food & Treats
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('cats')} className="hover:text-white transition-colors">
                  Cat Food & Litter
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('subscriptions')} className="hover:text-white transition-colors">
                  Auto-Ship Subscriptions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('rewards')} className="hover:text-white transition-colors">
                  Treatz Loyalty Points
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="hover:text-white transition-colors">
                  All Products
                </button>
              </li>
            </ul>
          </div>

          {/* Account & Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">
                  About Treatz
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-white transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('account')} className="hover:text-white transition-colors">
                  My Pet Profile
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="text-[#FF6B4A] hover:underline font-medium">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Demo Reset & Controls */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Demo Control</h4>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              Treatz is running in live prototype demonstration mode with complete rule-based personalization and local persistence.
            </p>
            <button
              id="reset-demo-data-btn"
              onClick={resetToDefaultData}
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <ResetIcon className="w-3.5 h-3.5" />
              Reset Demo Catalog & Pets
            </button>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="max-w-3xl leading-relaxed">
            <span className="font-semibold text-gray-400">Veterinary Notice:</span> Treatz product recommendations are tailored algorithms designed for shopping convenience and general nutritional guidance. They do not constitute a veterinary diagnosis or prescription medical advice. Always consult your veterinarian for specific clinical health conditions.
          </p>
          <p className="shrink-0">
            © {new Date().getFullYear()} Treatz Technologies Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
