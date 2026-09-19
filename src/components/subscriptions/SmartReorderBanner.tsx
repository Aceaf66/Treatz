import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Clock, ArrowRight, RotateCcw } from 'lucide-react';

export const SmartReorderBanner: React.FC = () => {
  const { activePet, orders, products, triggerQuickReorder } = useStore();

  // Find most recent order product
  if (!orders || orders.length === 0) return null;
  const lastOrder = orders[0];
  if (!lastOrder.items || lastOrder.items.length === 0) return null;

  const reorderItem = lastOrder.items[0];
  const petName = activePet ? activePet.name : 'your pet';

  return (
    <div id="smart-reorder-banner" className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A154B] via-[#5C1B5E] to-[#7B2CBF] text-white p-5 sm:p-6 shadow-xl border border-purple-900/30 my-6">
      {/* Background paw watermark */}
      <div className="absolute -right-6 -bottom-6 text-white/5 text-9xl select-none pointer-events-none font-black">
        🐾
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-[#FF6B4A] shrink-0 border border-white/15 shadow-inner">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF6B4A] text-white">
                Smart Restock Alert
              </span>
              <span className="text-xs text-purple-200">Based on past feeding timeline</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {petName}'s food may be running low!
            </h3>
            <p className="text-xs text-purple-200/90 mt-0.5 max-w-xl leading-relaxed">
              Estimated <strong>4-5 days</strong> of nutrition remaining from your last purchase ({reorderItem.product.name}). Reorder now with 1-click to avoid missing a mealtime.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
          <button
            id="smart-reorder-btn"
            onClick={() => triggerQuickReorder(reorderItem.product.id)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-[#4A154B] hover:bg-purple-50 text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <RotateCcw className="w-4 h-4 text-[#FF6B4A]" />
            <span>Reorder in 1-Click (₹{reorderItem.product.price})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
