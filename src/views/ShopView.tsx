import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { FilterPanel, FilterState } from '../components/products/FilterPanel';
import { ProductCard } from '../components/products/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { checkPetCompatibility } from '../services/recommendationEngine';
import { 
  SlidersHorizontal, ArrowUpDown, Search, Sparkles, 
  X, Compass, Filter
} from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, searchQuery, setSearchQuery, activePet, currentPage } = useStore();

  // Initial species based on current page if 'dogs' or 'cats'
  const initialSpecies = currentPage === 'dogs' ? 'dog' : currentPage === 'cats' ? 'cat' : 'all';

  const [filters, setFilters] = useState<FilterState>({
    species: initialSpecies as any,
    category: 'all',
    brand: 'all',
    maxPrice: 3000,
    ageGroup: 'all',
    dietaryPreference: 'all',
    subscriptionOnly: false
  });

  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'pet_fit'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands & categories
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), [products]);
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.ingredients.some(ing => ing.toLowerCase().includes(q)) ||
          product.tags.some(t => t.toLowerCase().includes(q));

        if (!matchesQuery) return false;
      }

      // Species
      if (filters.species !== 'all' && product.species !== filters.species) {
        return false;
      }

      // Category
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Brand
      if (filters.brand !== 'all' && product.brand !== filters.brand) {
        return false;
      }

      // Max price
      if (product.price > filters.maxPrice) {
        return false;
      }

      // Age group
      if (filters.ageGroup !== 'all' && !product.ageGroup.includes(filters.ageGroup)) {
        return false;
      }

      // Dietary preference
      if (filters.dietaryPreference !== 'all' && !product.dietaryPreference.includes(filters.dietaryPreference)) {
        return false;
      }

      // Subscription only
      if (filters.subscriptionOnly && !product.isSubscriptionEligible) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price_asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'pet_fit':
        if (!activePet) return list;
        return list.sort((a, b) => {
          const fitA = checkPetCompatibility(a, activePet).score;
          const fitB = checkPetCompatibility(b, activePet).score;
          return fitB - fitA;
        });
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sortBy, activePet]);

  const handleResetFilters = () => {
    setFilters({
      species: 'all',
      category: 'all',
      brand: 'all',
      maxPrice: 3000,
      ageGroup: 'all',
      dietaryPreference: 'all',
      subscriptionOnly: false
    });
    setSearchQuery('');
  };

  return (
    <div id="shop-catalog-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {filters.species === 'dog' ? 'Dog Food & Essentials 🐕' : filters.species === 'cat' ? 'Cat Food & Essentials 🐈' : 'Shop Pet Food & Care'}
            </h1>
            {activePet && (
              <span className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                <Sparkles className="w-3 h-3 text-[#FF6B4A]" />
                Personalized for {activePet.name}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Showing <strong>{sortedProducts.length}</strong> premium vet-reviewed formulations
          </p>
        </div>

        {/* Sort Controls & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A154B]"
            >
              <option value="featured">Featured Picks</option>
              {activePet && <option value="pet_fit">Best Fit for {activePet.name} 🐾</option>}
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills if applied */}
      {(searchQuery || filters.species !== 'all' || filters.category !== 'all' || filters.brand !== 'all' || filters.subscriptionOnly) && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs text-gray-400 font-semibold">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#4A154B] text-xs font-bold">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.species !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#4A154B] text-xs font-bold capitalize">
              {filters.species}
              <button onClick={() => setFilters({ ...filters, species: 'all' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#4A154B] text-xs font-bold">
              {filters.category}
              <button onClick={() => setFilters({ ...filters, category: 'all' })}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.subscriptionOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-[#4A154B] text-xs font-bold">
              Auto-Ship Only
              <button onClick={() => setFilters({ ...filters, subscriptionOnly: false })}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-[#FF6B4A] hover:underline font-bold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              brands={brands}
              categories={categories}
            />
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <EmptyState
              title="No pet foods match your criteria"
              description="Try loosening your filters, adjusting price range, or clearing your search term to see more items."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs lg:hidden">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              brands={brands}
              categories={categories}
            />
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#4A154B] text-white text-xs font-bold"
              >
                Apply Filters ({sortedProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
