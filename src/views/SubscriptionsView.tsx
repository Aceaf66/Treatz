import React from 'react';
import { useStore } from '../context/StoreContext';
import { SubscriptionCard } from '../components/subscriptions/SubscriptionCard';
import { ProductCard } from '../components/products/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Repeat, ShieldCheck, Sparkles, Clock, Calendar, 
  ArrowRight, CheckCircle2, Percent, Truck 
} from 'lucide-react';

export const SubscriptionsView: React.FC = () => {
  const { subscriptions, products, setCurrentPage, activePet } = useStore();

  const subscriptionEligibleProducts = products
    .filter(p => p.isSubscriptionEligible && (!activePet || p.species === activePet.species))
    .slice(0, 3);

  return (
    <div id="subscriptions-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#4A154B]">
              <Repeat className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Auto-Ship Subscriptions</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Automated pet food replenishment. Save 10% on every order with full flexibility to pause or skip.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('shop')}
          className="px-5 py-2.5 rounded-xl bg-[#4A154B] hover:bg-[#3B1443] text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
        >
          Add New Subscription Item
        </button>
      </div>

      {/* Value Proposition Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">10% Recurring Discount</h3>
            <p className="text-xs text-gray-500 mt-0.5">Applied automatically to every recurring delivery with no coupon required.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Always Free Delivery</h3>
            <p className="text-xs text-gray-500 mt-0.5">Auto-ship orders bypass the shipping threshold and ship free in insulated boxes.</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Total Control Anytime</h3>
            <p className="text-xs text-gray-500 mt-0.5">Going on vacation? Pause or modify your schedule in 1-click with no penalties.</p>
          </div>
        </div>
      </div>

      {/* Active Subscriptions List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Your Active Replenishments ({subscriptions.length})
          </h2>
        </div>

        {subscriptions.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="No active auto-ship subscriptions"
            description="Subscribe to your pet's regular kibble or wet food to unlock automatic 10% savings and effortless recurring deliveries."
            actionText="Browse Pet Food to Subscribe"
            onAction={() => setCurrentPage('shop')}
          />
        ) : (
          <div className="space-y-4">
            {subscriptions.map(sub => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended for Auto-Ship */}
      {subscriptionEligibleProducts.length > 0 && (
        <section className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">Popular For Auto-Ship</span>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">Frequently Subscribed Pet Meals</h3>
            </div>
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs font-bold text-[#4A154B] hover:underline flex items-center gap-1"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptionEligibleProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
