import React from 'react';
import { RewardVoucher } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Gift, Tag, Check, ArrowRight } from 'lucide-react';

interface RewardCardProps {
  coupon: RewardVoucher;
}

export const RewardCard: React.FC<RewardCardProps> = ({ coupon }) => {
  const { rewards, redeemRewardCoupon, applyCoupon, setIsCartOpen } = useStore();

  const canAfford = rewards.currentPoints >= coupon.pointsCost;

  const handleRedeem = () => {
    const success = redeemRewardCoupon(coupon.id);
    if (success) {
      applyCoupon(coupon.code);
      setIsCartOpen(true);
    }
  };

  return (
    <div 
      id={`reward-card-${coupon.id}`}
      className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-200 shadow-xs flex flex-col justify-between transition-all"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#4A154B] shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-[#4A154B]">
            {coupon.pointsCost} Points
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mt-3">{coupon.title}</h3>
        <p className="text-xs text-gray-500 mt-1">
          Save ₹{coupon.discountAmount} on orders above ₹{coupon.minSpend}
        </p>

        <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between text-xs">
          <span className="text-gray-400 font-mono">CODE:</span>
          <span className="font-mono font-bold text-gray-800 tracking-wider">{coupon.code}</span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-100">
        <button
          onClick={handleRedeem}
          disabled={!canAfford}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            canAfford
              ? 'bg-[#4A154B] hover:bg-[#3B1443] text-white shadow-xs active:scale-98'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canAfford ? (
            <>
              <span>Redeem & Apply to Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <span>Need {coupon.pointsCost - rewards.currentPoints} More Points</span>
          )}
        </button>
      </div>
    </div>
  );
};
