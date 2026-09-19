import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/products/ProductCard';
import { SmartReorderBanner } from '../components/subscriptions/SmartReorderBanner';
import { getRecommendationsForPet } from '../services/recommendationEngine';
import { 
  Sparkles, ArrowRight, ShieldCheck, Heart, Repeat, 
  Dog, Cat, Star, CheckCircle2, ChevronRight, Plus
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    setCurrentPage, activePet, pets, setActivePet, 
    setIsPetModalOpen, products, categories
  } = useStore();

  // Get personalized recommendations for the active pet
  const recommendations = activePet 
    ? getRecommendationsForPet(activePet, products) 
    : [];

  const bestSellers = products.slice(0, 6);
  const puppyKittenFavorites = products.filter(p => p.ageGroup.includes('puppy') || p.ageGroup.includes('kitten')).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/40 via-purple-50/20 to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-purple-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-purple-200 text-xs font-bold text-[#4A154B] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
                <span>Next-Gen Pet Nutrition Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
                Better Food. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A154B] to-[#FF6B4A]">
                  Happier Pets.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                Discover vet-reviewed recipes customized to your pet’s breed, life stage, and food sensitivities. Convenient auto-delivery so you never run out of food.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {activePet ? (
                  <button
                    id="hero-shop-for-pet-btn"
                    onClick={() => setCurrentPage('shop')}
                    className="px-6 py-3.5 rounded-2xl bg-[#4A154B] hover:bg-[#3B1443] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-950/15 transition-all active:scale-98"
                  >
                    <span>Shop Custom Menu for {activePet.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="hero-create-pet-btn"
                    onClick={() => setIsPetModalOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-[#4A154B] hover:bg-[#3B1443] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-950/15 transition-all active:scale-98"
                  >
                    <span>Add Pet Profile & Get Fit Score</span>
                    <Sparkles className="w-4 h-4 text-[#FF6B4A]" />
                  </button>
                )}

                <button
                  id="hero-browse-catalog-btn"
                  onClick={() => setCurrentPage('shop')}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm border border-gray-200 shadow-xs transition-colors"
                >
                  Explore All Products
                </button>
              </div>

              {/* Trust micro-badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real whole protein</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No artificial preservatives</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Save 10% on Auto-Ship</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-purple-100 to-peach-50">
                <img
                  src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
                  alt="Golden Retriever happy pet"
                  referrerPolicy="no-referrer"
                  className="w-full h-96 object-cover object-center"
                />

                {/* Floating Personalization Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg font-bold">
                        🐶
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Tailored Nutrition</p>
                        <p className="text-[11px] text-gray-500">Formulated for joints, digestion & shine</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                      98% Fit
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Smart Reorder Restock Alert if past order exists */}
        <SmartReorderBanner />

        {/* 2. Pet Selector Ribbon / Switcher */}
        <section className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">
                Personalized Experience
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                Who are you shopping for today?
              </h2>
              <p className="text-xs text-gray-500">
                Switch between your pets to dynamically update food recommendations and compatibility fit.
              </p>
            </div>

            <button
              onClick={() => setIsPetModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4A154B] text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Another Pet
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {pets.map(pet => {
              const isSelected = activePet?.id === pet.id;
              return (
                <div
                  key={pet.id}
                  onClick={() => setActivePet(pet)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#4A154B] bg-purple-50/50 shadow-xs ring-2 ring-[#4A154B]/20'
                      : 'border-gray-100 hover:border-purple-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900">{pet.name}</span>
                        {isSelected && <span className="text-[10px] font-bold text-[#4A154B] bg-purple-100 px-1.5 py-0.2 rounded">Active</span>}
                      </div>
                      <p className="text-xs text-gray-500 capitalize">{pet.breed} • {pet.age}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#4A154B]">
                    {isSelected ? 'Selected ✓' : 'Switch'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Personalized Recommendation Section (If Active Pet) */}
        {activePet && recommendations.length > 0 && (
          <section id="personalized-recommendations-section">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A154B] bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Recommended for {activePet.name} 🐾
                  </span>
                  <span className="text-xs text-gray-500">Based on {activePet.breed}, {activePet.dietaryPreference.replace('_', ' ')} diet</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mt-1">
                  Tailored Just for {activePet.name}
                </h2>
              </div>

              <button
                onClick={() => setCurrentPage('shop')}
                className="text-xs font-bold text-[#4A154B] hover:text-[#3B1443] flex items-center gap-1"
              >
                View all tailored items <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.slice(0, 4).map(rec => (
                <ProductCard 
                  key={rec.product.id} 
                  product={rec.product} 
                  recommendationReason={rec.reasons[0]}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. Browse by Category */}
        <section id="categories-section">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">
              Full Nutritional Spectrum
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              From crunchy kibble to hydrating stews, dental sticks, and natural clumping litter
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'dry-food', label: 'Dry Kibble', icon: '🥣', desc: 'Protein-packed' },
              { id: 'wet-food', label: 'Wet Food', icon: '🍲', desc: 'Hydrating broths' },
              { id: 'treats', label: 'Treats & Chews', icon: '🦴', desc: 'Training rewards' },
              { id: 'supplements', label: 'Wellness Care', icon: '💊', desc: 'Joints & coat' },
              { id: 'dental', label: 'Dental Care', icon: '✨', desc: 'Clean teeth' },
              { id: 'litter', label: 'Litter & Hygiene', icon: '📦', desc: 'Odor lock' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCurrentPage('shop')}
                className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-center flex flex-col items-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#4A154B] transition-colors">
                  {cat.label}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{cat.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 5. Featured Best Sellers */}
        <section id="best-sellers-section">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">
                Customer Favorites
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                Most-Loved Pet Food & Treats
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('shop')}
              className="text-xs font-bold text-[#4A154B] hover:text-[#3B1443] flex items-center gap-1"
            >
              See full catalog <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. Auto-Ship Subscription Feature Banner */}
        <section className="rounded-3xl bg-[#FAF6F0] border border-orange-200/60 p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-extrabold uppercase tracking-wider">
                <Repeat className="w-3.5 h-3.5" />
                <span>Treatz Auto-Replenish</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                Never worry about empty food bowls again.
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                Set up recurring scheduled deliveries tailored to your pet's feeding pace. Enjoy an automatic <strong>10% off every single delivery</strong>, free express shipping, and complete flexibility to pause, adjust, or cancel anytime with zero commitments.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => setCurrentPage('subscriptions')}
                  className="px-6 py-3 rounded-xl bg-[#4A154B] hover:bg-[#3B1443] text-white text-xs font-bold shadow-md transition-colors"
                >
                  Manage Auto-Ship Subscriptions
                </button>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Browse Auto-Ship Products
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
                <span className="text-2xl mb-1 block">💰</span>
                <strong className="text-gray-900 block font-bold">10% Extra Discount</strong>
                <span className="text-gray-500">Applied automatically to every recurrence</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
                <span className="text-2xl mb-1 block">🚚</span>
                <strong className="text-gray-900 block font-bold">Priority Dispatch</strong>
                <span className="text-gray-500">Reserved stock guaranteed before shipping</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
                <span className="text-2xl mb-1 block">⏸️</span>
                <strong className="text-gray-900 block font-bold">Pause or Skip</strong>
                <span className="text-gray-500">Travelling? Pause in 1-click easily</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs">
                <span className="text-2xl mb-1 block">🎁</span>
                <strong className="text-gray-900 block font-bold">Free Loyalty Points</strong>
                <span className="text-gray-500">Earn 2x reward points on repeat items</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
