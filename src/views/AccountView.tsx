import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PetCard } from '../components/pets/PetCard';
import { ProductCard } from '../components/products/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { 
  User, Heart, ShoppingBag, MapPin, Plus, 
  RotateCcw, Eye, ShieldCheck, Sparkles, Phone
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { 
    pets, setIsPetModalOpen, setEditingPet,
    orders, setTrackingOrderId, reorderItems, setIsCartOpen,
    wishlist, products, addresses, setCurrentPage
  } = useStore();

  const [activeTab, setActiveTab] = useState<'pets' | 'orders' | 'wishlist' | 'addresses'>('pets');

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div id="user-account-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User Header Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4A154B] to-[#7B2CBF] flex items-center justify-center text-white text-2xl font-bold shadow-md">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Alex Morgan</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-[#4A154B]">
                VIP Pet Parent
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">alex.morgan@example.com • Member since 2024</p>
            <p className="text-xs text-[#4A154B] font-bold mt-1">
              🐾 Managing {pets.length} pet profile{pets.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingPet(null);
            setIsPetModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#4A154B] hover:bg-[#3B1443] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Pet Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        {[
          { id: 'pets', label: `Pet Profiles (${pets.length})` },
          { id: 'orders', label: `My Orders (${orders.length})` },
          { id: 'wishlist', label: `Wishlist (${wishlistProducts.length})` },
          { id: 'addresses', label: `Saved Addresses (${addresses.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab.id
                ? 'border-[#4A154B] text-[#4A154B]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PET PROFILES */}
      {activeTab === 'pets' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Your Pet Family</h2>
            <button
              onClick={() => {
                setEditingPet(null);
                setIsPetModalOpen(true);
              }}
              className="text-xs font-bold text-[#4A154B] hover:underline"
            >
              + Add another pet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                onEdit={(p) => {
                  setEditingPet(p);
                  setIsPetModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No orders placed yet"
              description="Your order history and live dispatch tracking will appear here once you make your first purchase."
              actionText="Shop Pet Food"
              onAction={() => setCurrentPage('shop')}
            />
          ) : (
            orders.map(order => (
              <div 
                key={order.id}
                className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gray-900">Order #{order.orderNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : order.status === 'Out for Delivery'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-[#4A154B]'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Placed on {order.date.slice(0, 10)} • Estimated: {order.estimatedDelivery}
                  </p>

                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-700">
                    <span className="font-semibold">{order.items.length} item{order.items.length !== 1 ? 's' : ''}:</span>
                    <span className="text-gray-500 truncate max-w-sm">
                      {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-gray-400">Total Paid</span>
                    <p className="text-base font-black text-gray-900">₹{order.total}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTrackingOrderId(order.id)}
                      className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4A154B] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Track
                    </button>

                    <button
                      onClick={() => {
                        reorderItems(order.id);
                        setIsCartOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#4A154B] hover:bg-[#3B1443] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Save products to your wishlist by clicking the heart icon on any recipe or care item."
              actionText="Discover Products"
              onAction={() => setCurrentPage('shop')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {addr.isDefault ? 'Default Address' : 'Shipping Address'}
                  </span>
                  <MapPin className="w-4 h-4 text-[#4A154B]" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-2">{addr.fullName}</h3>
                <p className="text-xs text-gray-600 mt-1">{addr.street}, {addr.apartment}</p>
                <p className="text-xs text-gray-600">{addr.city}, {addr.state} - {addr.postalCode}</p>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {addr.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
