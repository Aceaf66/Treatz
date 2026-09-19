import React, { useState } from 'react';
import { Subscription, SubscriptionFrequency } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  Repeat, Calendar, Clock, Pause, Play, 
  Trash2, RotateCcw, ChevronDown, CheckCircle2 
} from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription }) => {
  const { 
    pauseSubscription, resumeSubscription, 
    cancelSubscription, updateSubscriptionFrequency,
    triggerQuickReorder
  } = useStore();

  const [isChangingFrequency, setIsChangingFrequency] = useState(false);
  const isActive = subscription.status === 'active';

  return (
    <div 
      id={`subscription-card-${subscription.id}`}
      className={`p-5 rounded-2xl border transition-all ${
        isActive 
          ? 'bg-white border-purple-100 shadow-xs hover:border-purple-200' 
          : 'bg-gray-50/70 border-gray-200 opacity-80'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        
        {/* Product & Pet Info */}
        <div className="flex items-start gap-4">
          <img
            src={subscription.product.image}
            alt={subscription.product.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-2xl object-cover bg-purple-50 shrink-0 border border-gray-100"
          />

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {subscription.status}
              </span>
              {subscription.petName && (
                <span className="text-xs font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md">
                  🐾 For {subscription.petName}
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-gray-900 mt-1 leading-snug">
              {subscription.product.name}
            </h3>
            <p className="text-xs text-gray-500">{subscription.product.weightSize} • Qty: {subscription.quantity}</p>

            <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#4A154B]" />
                <span>Next dispatch: <strong className="text-gray-900">{subscription.nextDeliveryDate}</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#4A154B]" />
                <span>Every <strong className="text-gray-900">{subscription.frequencyDays} days</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Auto-discount badge */}
        <div className="sm:text-right shrink-0">
          <span className="text-xs text-gray-400">Subscription Price (10% off)</span>
          <p className="text-xl font-black text-gray-900">
            ₹{Math.round(subscription.product.price * 0.9 * subscription.quantity)}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            Saved 10% on every dispatch
          </span>
        </div>
      </div>

      {/* Frequency Modifier dropdown */}
      {isChangingFrequency && (
        <div className="mt-4 p-3 bg-purple-50 rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <span className="font-semibold text-[#4A154B]">Change replenishment schedule:</span>
          <div className="flex items-center gap-2">
            <select
              value={subscription.frequencyDays}
              onChange={(e) => {
                updateSubscriptionFrequency(subscription.id, Number(e.target.value) as SubscriptionFrequency);
                setIsChangingFrequency(false);
              }}
              className="px-2 py-1 bg-white border border-purple-300 rounded-lg text-xs font-bold text-[#4A154B]"
            >
              <option value={7}>Every 7 Days</option>
              <option value={15}>Every 15 Days</option>
              <option value={30}>Every 30 Days (Recommended)</option>
              <option value={45}>Every 45 Days</option>
              <option value={60}>Every 60 Days</option>
            </select>
            <button
              onClick={() => setIsChangingFrequency(false)}
              className="text-gray-500 hover:text-gray-700 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isActive ? (
            <button
              onClick={() => pauseSubscription(subscription.id)}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause Auto-Ship
            </button>
          ) : (
            <button
              onClick={() => resumeSubscription(subscription.id)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Resume Auto-Ship
            </button>
          )}

          <button
            onClick={() => setIsChangingFrequency(!isChangingFrequency)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Change Interval</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          <button
            onClick={() => {
              if (confirm('Cancel this recurring auto-replenishment subscription?')) {
                cancelSubscription(subscription.id);
              }
            }}
            className="px-3 py-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

        <button
          onClick={() => triggerQuickReorder(subscription.product.id)}
          className="px-4 py-1.5 rounded-xl bg-[#4A154B] hover:bg-[#3B1443] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Send Extra Pack Now
        </button>
      </div>
    </div>
  );
};
