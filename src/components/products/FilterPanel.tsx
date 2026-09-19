import React from 'react';
import { Species, AgeGroup, DietaryPreference } from '../../types';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';

export interface FilterState {
  species: Species;
  category: string;
  brand: string;
  maxPrice: number;
  ageGroup: AgeGroup;
  dietaryPreference: DietaryPreference | 'all';
  subscriptionOnly: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  brands: string[];
  categories: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  brands,
  categories,
}) => {
  const update = (patch: Partial<FilterState>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <aside id="catalog-filter-panel" className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#4A154B]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-gray-500 hover:text-[#FF6B4A] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Pet Species */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Pet Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
          {[
            { id: 'all', label: 'All 🐾' },
            { id: 'dog', label: 'Dogs 🐶' },
            { id: 'cat', label: 'Cats 🐱' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => update({ species: opt.id as Species })}
              className={`py-2 px-1 rounded-xl border text-center transition-all ${
                filters.species === opt.id
                  ? 'bg-purple-50 border-[#4A154B] text-[#4A154B]'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Category
        </label>
        <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
          <button
            onClick={() => update({ category: 'all' })}
            className={`w-full px-3 py-1.5 rounded-xl text-xs text-left flex items-center justify-between font-medium transition-colors ${
              filters.category === 'all'
                ? 'bg-purple-100/70 text-[#4A154B] font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>All Categories</span>
            {filters.category === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => update({ category: cat })}
              className={`w-full px-3 py-1.5 rounded-xl text-xs text-left flex items-center justify-between font-medium transition-colors ${
                filters.category === cat
                  ? 'bg-purple-100/70 text-[#4A154B] font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{cat}</span>
              {filters.category === cat && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          <span>Max Price</span>
          <span className="text-[#4A154B] font-extrabold text-sm">₹{filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="300"
          max="3000"
          step="100"
          value={filters.maxPrice}
          onChange={(e) => update({ maxPrice: Number(e.target.value) })}
          className="w-full accent-[#4A154B] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>₹300</span>
          <span>₹1500</span>
          <span>₹3000</span>
        </div>
      </div>

      {/* Life Stage */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Age Stage
        </label>
        <select
          value={filters.ageGroup}
          onChange={(e) => update({ ageGroup: e.target.value as any })}
          className="w-full px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
        >
          <option value="all">All Ages</option>
          <option value="puppy">Puppy / Kitten</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      {/* Dietary Focus */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Dietary Preference
        </label>
        <select
          value={filters.dietaryPreference}
          onChange={(e) => update({ dietaryPreference: e.target.value as any })}
          className="w-full px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
        >
          <option value="all">Any Formulation</option>
          <option value="grain_free">100% Grain-Free</option>
          <option value="sensitive">Sensitive Digestion</option>
          <option value="high_protein">High-Protein Recipe</option>
          <option value="weight_management">Weight Management</option>
          <option value="hypoallergenic">Hypoallergenic</option>
        </select>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Brand
          </label>
          <select
            value={filters.brand}
            onChange={(e) => update({ brand: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
          >
            <option value="all">All Brands</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      {/* Auto-Ship Only Toggle */}
      <div className="pt-2 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.subscriptionOnly}
            onChange={(e) => update({ subscriptionOnly: e.target.checked })}
            className="w-4 h-4 rounded text-[#4A154B] accent-[#4A154B]"
          />
          <span className="text-xs font-semibold text-gray-800">
            Auto-Ship Eligible (10% Off)
          </span>
        </label>
      </div>
    </aside>
  );
};
