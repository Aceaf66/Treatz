import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, OrderStatus } from '../../types';
import { 
  BarChart3, Package, ShoppingBag, Users, Plus, 
  Trash2, Edit, CheckCircle2, Truck, RefreshCw, Eye, ArrowLeft,
  DollarSign, TrendingUp, Sparkles, X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, orders, subscriptions, updateOrderStatus,
    addProduct, updateProduct, deleteProduct,
    setCurrentPage, setTrackingOrderId, showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'subscriptions'>('orders');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for new product
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Treatz Signature');
  const [category, setCategory] = useState('dry_food');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'both'>('dog');
  const [price, setPrice] = useState(999);
  const [stock, setStock] = useState(50);
  const [weightSize, setWeightSize] = useState('2 kg');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80');

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeSubsCount = subscriptions.filter(s => s.status === 'active').length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name,
        brand,
        category: category as any,
        species,
        price: Number(price),
        stock: Number(stock),
        weightSize,
        image
      });
      showToast('Product Updated', `Successfully updated ${name}`);
    } else {
      addProduct({
        name,
        brand,
        category: category as any,
        species,
        ageGroup: ['adult'],
        dietaryPreference: ['regular'],
        price: Number(price),
        discount: 0,
        rating: 4.9,
        reviewCount: 1,
        stock: Number(stock),
        weightSize,
        image,
        description: 'Premium nutrition formulated for holistic pet health and longevity.',
        ingredients: ['Fresh Meat', 'Brown Rice', 'Flaxseed', 'Vitamins & Minerals'],
        nutritionalInfo: { protein: '28%', fat: '14%', fiber: '4%', moisture: '10%', calories: '380 kcal/100g' },
        isSubscriptionEligible: true,
        tags: ['premium', 'nutrient_rich']
      });
      showToast('Product Created', `Added ${name} to live catalog`);
    }

    setIsAddProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setBrand(prod.brand);
    setCategory(prod.category);
    setSpecies(prod.species);
    setPrice(prod.price);
    setStock(prod.stock);
    setWeightSize(prod.weightSize);
    setImage(prod.image);
    setIsAddProductModalOpen(true);
  };

  return (
    <div id="admin-control-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('home')}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Return to Customer Storefront"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Treatz Operations Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#4A154B] text-white">
                Admin Mode
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Live store management, inventory control, and fulfillment tracking</p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setName('');
            setIsAddProductModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#4A154B] hover:bg-[#3B1443] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-black">
            ₹
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</p>
            <p className="text-2xl font-black text-gray-900 leading-tight">₹{totalRevenue.toLocaleString()}</p>
            <span className="text-[10px] text-emerald-600 font-bold">↑ 14% vs last week</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-black">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Orders Processed</p>
            <p className="text-2xl font-black text-gray-900 leading-tight">{totalOrdersCount}</p>
            <span className="text-[10px] text-emerald-600 font-bold">100% On-time dispatch</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-black">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Auto-Ships</p>
            <p className="text-2xl font-black text-gray-900 leading-tight">{activeSubsCount}</p>
            <span className="text-[10px] text-[#FF6B4A] font-bold">High recurring retention</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4 mb-6">
        {[
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'products', label: `Catalog & Inventory (${products.length})` },
          { id: 'subscriptions', label: `Auto-Ship Subscriptions (${subscriptions.length})` }
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

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer & City</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Fulfillment Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-gray-900">
                      #{order.orderNumber}
                      <p className="text-[10px] text-gray-400 font-normal">{order.date.slice(0, 10)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">{order.address.fullName}</p>
                      <p className="text-gray-500">{order.address.city}, {order.address.state}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-800">{order.items.length} items</span>
                      <p className="text-[11px] text-gray-500 truncate max-w-xs">
                        {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-black text-gray-900">
                      ₹{order.total}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          order.status === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : order.status === 'Out for Delivery'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setTrackingOrderId(order.id)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-purple-100 text-[#4A154B] font-bold text-xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Table */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Pet & Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Inventory Stock</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{prod.name}</p>
                        <p className="text-[11px] text-gray-400">{prod.brand} • {prod.weightSize}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize">
                      <span className="font-semibold text-gray-800">{prod.species}</span>
                      <p className="text-[11px] text-gray-500">{prod.category.replace('_', ' ')}</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-gray-900">
                      ₹{prod.price}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {prod.stock > 0 ? `${prod.stock} units` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#4A154B] hover:bg-purple-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${prod.name} from store catalog?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Customer & Pet</th>
                  <th className="px-5 py-3.5">Replenishment Item</th>
                  <th className="px-5 py-3.5">Cycle</th>
                  <th className="px-5 py-3.5">Next Delivery</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscriptions.map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900">Alex Morgan</p>
                      <p className="text-gray-500 text-[11px]">🐾 For {sub.petName || 'Pet'}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {sub.product.name} (Qty: {sub.quantity})
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">
                      Every {sub.frequencyDays} days
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {sub.nextDeliveryDate}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Pet Food / Product'}
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Fresh Atlantic Salmon Dry Kibble"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Target Pet</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs bg-white"
                  >
                    <option value="dog">Dog 🐕</option>
                    <option value="cat">Cat 🐈</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Pack Size</label>
                  <input
                    type="text"
                    value={weightSize}
                    onChange={(e) => setWeightSize(e.target.value)}
                    placeholder="e.g. 2.5 kg"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#3B1443]"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
