import React from 'react';
import { useStore } from '../context/StoreContext';
import { RewardCard } from '../components/rewards/RewardCard';
import { 
  Sparkles, Gift, Award, CheckCircle2, ArrowRight, 
  HelpCircle, Star, Heart, TrendingUp
} from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { rewards, rewardCoupons, setCurrentPage, setIsPetModalOpen } = useStore();

  return (
    <div id="rewards-program-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Banner: Points Dashboard */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A154B] via-[#631B64] to-[#7B2CBF] text-white p-8 sm:p-12 shadow-xl border border-purple-900/30">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Treatz Pet Loyalty Program</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Every bowl feeds your points.
          </h1>

          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
            Earn Treatz points every time you feed your pet or engage with our pet parent community. Redeem points directly for discounts on your next pet food order.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs uppercase font-bold text-purple-200">Current Balance</span>
              <p className="text-3xl font-black text-white mt-0.5">{rewards.currentPoints} <span className="text-sm font-semibold">Points</span></p>
              <span className="text-[11px] text-emerald-300">Worth ₹{rewards.currentPoints} in direct discounts</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs uppercase font-bold text-purple-200">Lifetime Earned</span>
              <p className="text-3xl font-black text-white mt-0.5">{rewards.pointsEarnedTotal} <span className="text-sm font-semibold">Points</span></p>
              <span className="text-[11px] text-purple-200">VIP Pet Parent Level</span>
            </div>
          </div>
        </div>

        {/* Subtle decorative paw */}
        <div className="absolute -right-8 -bottom-8 text-white/5 text-9xl select-none pointer-events-none font-black">
          🐾
        </div>
      </div>

      {/* How to Earn Points Section */}
      <section>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">Easy Earning</span>
          <h2 className="text-2xl font-black text-gray-900 mt-1">Ways to Collect Points</h2>
          <p className="text-xs text-gray-500 mt-0.5">Points are automatically credited to your Treatz account</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-bold mb-3">
                🛍️
              </div>
              <h3 className="text-sm font-bold text-gray-900">Shop Pet Food</h3>
              <p className="text-xs text-gray-500 mt-1">
                Earn <strong>1 Point for every ₹10 spent</strong> across dry food, wet food, treats, and care.
              </p>
            </div>
            <button 
              onClick={() => setCurrentPage('shop')}
              className="mt-4 text-xs font-bold text-[#4A154B] hover:underline flex items-center gap-1"
            >
              Shop now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-bold mb-3">
                🐾
              </div>
              <h3 className="text-sm font-bold text-gray-900">Create Pet Profile</h3>
              <p className="text-xs text-gray-500 mt-1">
                Receive <strong>50 bonus points</strong> when you add a complete pet profile with diet and age details.
              </p>
            </div>
            <button 
              onClick={() => setIsPetModalOpen(true)}
              className="mt-4 text-xs font-bold text-[#4A154B] hover:underline flex items-center gap-1"
            >
              Add a pet <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-bold mb-3">
                ⭐
              </div>
              <h3 className="text-sm font-bold text-gray-900">Leave a Verified Review</h3>
              <p className="text-xs text-gray-500 mt-1">
                Share your pet’s feedback and photo to earn <strong>20 points</strong> per verified review.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-emerald-600">Available after order delivery</span>
          </div>
        </div>
      </section>

      {/* Redeemable Coupons Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">Voucher Catalog</span>
            <h2 className="text-2xl font-black text-gray-900 mt-0.5">Redeem Your Points</h2>
          </div>
          <span className="text-xs text-gray-500">Instant checkout discount</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {rewardCoupons.map(coupon => (
            <RewardCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </section>

      {/* Point History / Ledger */}
      <section className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Points Activity History</h3>
        
        <div className="space-y-3 divide-y divide-gray-100">
          {rewards.transactions.map(item => (
            <div key={item.id} className="pt-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-900">{item.description}</p>
                <p className="text-gray-400 text-[11px]">{item.date}</p>
              </div>
              <span className={`font-black text-sm ${
                item.type === 'earned' ? 'text-emerald-600' : 'text-[#FF6B4A]'
              }`}>
                {item.type === 'earned' ? '+' : '-'}{item.points} pts
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
