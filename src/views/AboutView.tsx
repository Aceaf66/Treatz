import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShieldCheck, Award, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentPage, setIsPetModalOpen } = useStore();

  return (
    <div id="about-treatz-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">Our Story & Mission</span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Better Food. Happier Pets.
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Treatz was born out of a simple observation: modern pet parents want the nutritional integrity of veterinary science paired with the effortless convenience of modern commerce.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-xl aspect-21/9 bg-purple-100">
        <img
          src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80"
          alt="Happy dogs running in grass"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-black text-xl">
            🥩
          </div>
          <h3 className="text-lg font-bold text-gray-900">Whole Protein First</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We partner exclusively with certified ethical farms and transparent kitchens. No mystery meat meals or filler byproduct powders.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-black text-xl">
            🩺
          </div>
          <h3 className="text-lg font-bold text-gray-900">Veterinary Reviewed</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Every kibble formulation, slow-simmered pouch, and functional supplement is vetted for balanced macro-nutrients and digestive bioavailability.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-black text-xl">
            🔄
          </div>
          <h3 className="text-lg font-bold text-gray-900">Predictable Auto-Delivery</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Feeding algorithms predict when your pet's sack is running low, automatically dispatching fresh batches with 10% lifetime savings.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-purple-100 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900">Ready to build your pet’s custom bowl?</h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Create a pet profile in 60 seconds to get tailored fit scores for dogs and cats of any breed or sensitivity.
        </p>
        <button
          onClick={() => setIsPetModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-[#4A154B] text-white font-bold text-xs hover:bg-[#3B1443] shadow-md shadow-purple-950/10"
        >
          Create Free Pet Profile 🐾
        </button>
      </div>

    </div>
  );
};
