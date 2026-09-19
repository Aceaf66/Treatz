import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, Category, Pet, CartItem, Address, Order, 
  Subscription, UserRewards, UserProfile, OrderStatus, SubscriptionFrequency,
  RewardVoucher
} from '../types';
import { 
  INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_PETS, 
  INITIAL_ADDRESS, INITIAL_ORDERS, INITIAL_SUBSCRIPTIONS, 
  INITIAL_REWARDS 
} from '../data/mockData';
import { DeliveryService } from '../services/deliveryService';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  updateProductStock: (productId: string, newStock: number) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;

  // Selected Product Detail Modal
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;

  // Pets & Active Pet
  pets: Pet[];
  activePet: Pet | null;
  setActivePet: (pet: Pet | null) => void;
  addPet: (petData: Omit<Pet, 'id'>) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (petId: string) => void;
  setDefaultPet: (petId: string) => void;
  isPetModalOpen: boolean;
  setIsPetModalOpen: (open: boolean) => void;
  editingPet: Pet | null;
  setEditingPet: (pet: Pet | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, isSubscription?: boolean, frequency?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;
  appliedCoupon: RewardVoucher | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (address: Address, paymentMethod: 'upi' | 'card' | 'cod') => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  reorderOrder: (order: Order) => void;
  reorderItems: (orderId: string) => void;
  triggerQuickReorder: (productId: string) => void;

  // Subscriptions
  subscriptions: Subscription[];
  createSubscription: (product: Product, frequencyDays: SubscriptionFrequency, petName?: string) => void;
  pauseSubscription: (subId: string) => void;
  resumeSubscription: (subId: string) => void;
  cancelSubscription: (subId: string) => void;
  updateSubscriptionFrequency: (subId: string, frequency: SubscriptionFrequency) => void;

  // Rewards
  rewards: UserRewards;
  rewardCoupons: RewardVoucher[];
  redeemVoucher: (voucherId: string) => void;
  redeemRewardCoupon: (voucherId: string) => boolean;

  // User & Addresses
  user: UserProfile;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  setDefaultAddress: (addressId: string) => void;
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;

  // Checkout Modal
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Reset Demo
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Filter state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modals & detail views
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPetModalOpen, setIsPetModalOpen] = useState<boolean>(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('treatz_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Categories
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Pets
  const [pets, setPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem('treatz_pets');
    return saved ? JSON.parse(saved) : INITIAL_PETS;
  });

  // Active Pet for Personalization
  const [activePet, setActivePetState] = useState<Pet | null>(() => {
    const savedId = localStorage.getItem('treatz_active_pet_id');
    if (savedId && pets.length > 0) {
      const found = pets.find(p => p.id === savedId);
      if (found) return found;
    }
    return pets.find(p => p.isDefault) || pets[0] || null;
  });

  const setActivePet = (pet: Pet | null) => {
    setActivePetState(pet);
    if (pet) {
      localStorage.setItem('treatz_active_pet_id', pet.id);
    } else {
      localStorage.removeItem('treatz_active_pet_id');
    }
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('treatz_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<RewardVoucher | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('treatz_wishlist');
    return saved ? JSON.parse(saved) : ['prod-dog-4', 'prod-cat-3'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('treatz_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('treatz_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  // Rewards
  const [rewards, setRewards] = useState<UserRewards>(() => {
    const saved = localStorage.getItem('treatz_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  // User & Addresses
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    memberSince: 'July 2025'
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('treatz_addresses');
    return saved ? JSON.parse(saved) : [INITIAL_ADDRESS];
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('treatz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('treatz_pets', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('treatz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('treatz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('treatz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('treatz_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('treatz_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('treatz_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Product detail modal triggers
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  // Products stock management
  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
    showToast('Stock Updated', 'Inventory count has been updated in database.');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast('Product Updated', `${updatedProduct.name} catalog details saved.`);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-custom-' + Date.now()
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast('Product Created', `${newProduct.name} added to catalog.`);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product Removed', 'Product has been deactivated from catalog.', 'info');
  };

  // Pet management
  const addPet = (petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...petData,
      id: 'pet-' + Date.now(),
      isDefault: pets.length === 0 ? true : petData.isDefault
    };

    setPets(prev => {
      if (newPet.isDefault) {
        return [...prev.map(p => ({ ...p, isDefault: false })), newPet];
      }
      return [...prev, newPet];
    });

    // Auto set as active pet
    setActivePet(newPet);

    // Award bonus points for adding a pet profile
    setRewards(prev => ({
      ...prev,
      currentPoints: prev.currentPoints + 100,
      pointsEarnedTotal: prev.pointsEarnedTotal + 100,
      transactions: [
        {
          id: 'tx-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          description: `Completed Pet Profile for ${newPet.name} 🐾`,
          points: 100,
          type: 'earned'
        },
        ...prev.transactions
      ]
    }));

    showToast(`Welcome ${newPet.name}! 🐾`, `Profile created. You earned +100 Treatz Points!`);
  };

  const updatePet = (updatedPet: Pet) => {
    setPets(prev => prev.map(p => {
      if (p.id === updatedPet.id) return updatedPet;
      if (updatedPet.isDefault) return { ...p, isDefault: false };
      return p;
    }));

    if (activePet?.id === updatedPet.id) {
      setActivePet(updatedPet);
    }
    showToast('Pet Profile Updated', `${updatedPet.name}'s preferences have been saved.`);
  };

  const deletePet = (petId: string) => {
    const toDelete = pets.find(p => p.id === petId);
    setPets(prev => {
      const remaining = prev.filter(p => p.id !== petId);
      if (toDelete?.isDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });

    if (activePet?.id === petId) {
      const remaining = pets.filter(p => p.id !== petId);
      setActivePet(remaining[0] || null);
    }
    showToast('Profile Deleted', 'Pet profile has been removed.', 'info');
  };

  const setDefaultPet = (petId: string) => {
    setPets(prev => prev.map(p => ({
      ...p,
      isDefault: p.id === petId
    })));
    const target = pets.find(p => p.id === petId);
    if (target) {
      setActivePet(target);
      showToast('Default Pet Set', `${target.name} is now your primary shopping profile.`);
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, isSubscription = false, frequency = 30) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.isSubscription === isSubscription);
      if (existing) {
        return prev.map(item => 
          (item.product.id === product.id && item.isSubscription === isSubscription)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, isSubscription, subscriptionFrequency: frequency }];
    });

    showToast(
      'Added to Cart 🛒', 
      `${product.name} ${isSubscription ? `(Auto-deliver every ${frequency} days)` : ''}`
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.isSubscription 
      ? Math.round(item.product.price * 0.9) 
      : item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const cartDiscount = appliedCoupon ? Math.min(appliedCoupon.discountAmount, cartSubtotal) : 0;
  const cartDeliveryFee = (cartSubtotal > 999 || cartSubtotal === 0) ? 0 : 49;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const found = rewards.availableVouchers.find(v => v.code === clean);
    if (!found) {
      showToast('Invalid Coupon', 'Coupon code was not recognized.', 'error');
      return false;
    }
    if (cartSubtotal < found.minSpend) {
      showToast('Min Spend Required', `This coupon requires a minimum cart value of ₹${found.minSpend}.`, 'warning');
      return false;
    }
    setAppliedCoupon(found);
    showToast('Coupon Applied! 🎉', `₹${found.discountAmount} saved with code ${found.code}`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Coupon discount removed from cart.', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'Item removed from your saved list.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist ❤️', 'Added to your favorites.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = async (address: Address, paymentMethod: 'upi' | 'card' | 'cod'): Promise<Order> => {
    const orderNum = 'TRZ' + Math.floor(10000 + Math.random() * 90000);
    const orderPoints = Math.round(cartTotal / 10); // ₹100 spent = 10 Treatz Points

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      address,
      paymentMethod,
      paymentStatus: 'completed',
      status: 'Order Placed',
      trackingEvents: DeliveryService.generateTrackingEvents(new Date().toISOString(), 'Order Placed'),
      estimatedDelivery: 'In 2-3 Days',
      pointsEarned: orderPoints,
      petName: activePet?.name || 'Pet'
    };

    // If order has subscription items, automatically register active subscriptions
    cart.forEach(item => {
      if (item.isSubscription) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + (item.subscriptionFrequency || 30));
        
        const newSub: Subscription = {
          id: 'sub-' + Date.now() + Math.random().toString(36).substring(7),
          product: item.product,
          petName: activePet?.name || 'My Pet',
          quantity: item.quantity,
          frequencyDays: (item.subscriptionFrequency || 30) as SubscriptionFrequency,
          nextDeliveryDate: nextDate.toISOString().split('T')[0],
          status: 'active',
          address,
          paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Secure Online Mandate',
          discountPercent: 10,
          createdDate: new Date().toISOString().split('T')[0]
        };
        setSubscriptions(prev => [newSub, ...prev]);
      }
    });

    // Award loyalty points
    setRewards(prev => ({
      ...prev,
      currentPoints: prev.currentPoints + orderPoints,
      pointsEarnedTotal: prev.pointsEarnedTotal + orderPoints,
      transactions: [
        {
          id: 'tx-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          description: `Order #${orderNum} purchase points`,
          points: orderPoints,
          type: 'earned'
        },
        ...prev.transactions
      ]
    }));

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          trackingEvents: DeliveryService.generateTrackingEvents(order.date, newStatus)
        };
      }
      return order;
    }));
    showToast('Order Status Updated', `Order #${orderId} marked as ${newStatus}.`);
  };

  const reorderOrder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.product, item.quantity, item.isSubscription, item.subscriptionFrequency);
    });
    setIsCartOpen(true);
    showToast('Items Added to Cart', `Added ${order.items.length} items from Order #${order.orderNumber}.`);
  };

  const reorderItems = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      reorderOrder(order);
    }
  };

  const triggerQuickReorder = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      addToCart(prod, 1);
      setIsCartOpen(true);
    }
  };

  // Subscriptions
  const createSubscription = (product: Product, frequencyDays: SubscriptionFrequency, petName?: string) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + frequencyDays);

    const newSub: Subscription = {
      id: 'sub-' + Date.now(),
      product,
      petName: petName || activePet?.name || 'My Pet',
      quantity: 1,
      frequencyDays,
      nextDeliveryDate: nextDate.toISOString().split('T')[0],
      status: 'active',
      address: addresses[0] || INITIAL_ADDRESS,
      paymentMethod: 'Treatz Quick Mandate',
      discountPercent: 10,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setSubscriptions(prev => [newSub, ...prev]);
    showToast('Subscription Started 🔄', `Auto-delivery set for ${product.name} every ${frequencyDays} days (10% off).`);
  };

  const pauseSubscription = (subId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: 'paused' } : s));
    showToast('Subscription Paused', 'Your recurring delivery has been temporarily paused.');
  };

  const resumeSubscription = (subId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: 'active' } : s));
    showToast('Subscription Resumed', 'Your recurring delivery is active.');
  };

  const cancelSubscription = (subId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: 'cancelled' } : s));
    showToast('Subscription Cancelled', 'Recurring delivery has been cancelled.', 'info');
  };

  const updateSubscriptionFrequency = (subId: string, frequency: SubscriptionFrequency) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + frequency);

    setSubscriptions(prev => prev.map(s => 
      s.id === subId 
        ? { ...s, frequencyDays: frequency, nextDeliveryDate: nextDate.toISOString().split('T')[0] } 
        : s
    ));
    showToast('Frequency Updated', `Delivery updated to every ${frequency} days.`);
  };

  // Rewards
  const redeemVoucher = (voucherId: string) => {
    const voucher = rewards.availableVouchers.find(v => v.id === voucherId);
    if (!voucher) return;
    if (rewards.currentPoints < voucher.pointsCost) {
      showToast('Insufficient Points', `You need ${voucher.pointsCost} points for this reward.`, 'warning');
      return;
    }

    setRewards(prev => ({
      ...prev,
      currentPoints: prev.currentPoints - voucher.pointsCost,
      pointsRedeemedTotal: prev.pointsRedeemedTotal + voucher.pointsCost,
      transactions: [
        {
          id: 'tx-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          description: `Redeemed ${voucher.title} (${voucher.code})`,
          points: voucher.pointsCost,
          type: 'redeemed'
        },
        ...prev.transactions
      ],
      availableVouchers: prev.availableVouchers.map(v => v.id === voucherId ? { ...v, claimed: true } : v)
    }));

    showToast('Voucher Claimed! 🎁', `Use code ${voucher.code} at checkout to get ₹${voucher.discountAmount} off!`);
  };

  const redeemRewardCoupon = (voucherId: string): boolean => {
    const voucher = rewards.availableVouchers.find(v => v.id === voucherId);
    if (!voucher || rewards.currentPoints < voucher.pointsCost) {
      redeemVoucher(voucherId);
      return false;
    }
    redeemVoucher(voucherId);
    return true;
  };

  const rewardCoupons = rewards.availableVouchers;

  // Address
  const addAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addressData,
      id: 'addr-' + Date.now()
    };
    setAddresses(prev => {
      if (newAddr.isDefault) {
        return [...prev.map(a => ({ ...a, isDefault: false })), newAddr];
      }
      return [...prev, newAddr];
    });
    showToast('Address Saved', 'New delivery address added.');
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === addressId
    })));
    showToast('Default Address Set', 'Primary delivery destination updated.');
  };

  // Auth mock
  const login = (email: string) => {
    setUser({
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '+1 (555) 019-2831',
      memberSince: 'Today'
    });
    setIsLoggedIn(true);
    showToast('Welcome back!', `Logged in as ${email}`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  // Reset to default seed data
  const resetToDefaultData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setPets(INITIAL_PETS);
    setActivePet(INITIAL_PETS[0]);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setRewards(INITIAL_REWARDS);
    setAddresses([INITIAL_ADDRESS]);
    showToast('Demo Data Restored', 'Reset sample catalog, pets, orders, and rewards.');
  };

  return (
    <StoreContext.Provider value={{
      currentPage,
      setCurrentPage,
      searchQuery,
      setSearchQuery,
      selectedCategoryFilter,
      setSelectedCategoryFilter,
      products,
      categories,
      updateProductStock,
      updateProduct,
      addProduct,
      deleteProduct,
      selectedProduct,
      openProductDetail,
      closeProductDetail,
      pets,
      activePet,
      setActivePet,
      addPet,
      updatePet,
      deletePet,
      setDefaultPet,
      isPetModalOpen,
      setIsPetModalOpen,
      editingPet,
      setEditingPet,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartDiscount,
      cartDeliveryFee,
      cartTotal,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      isCartOpen,
      setIsCartOpen,
      wishlist,
      toggleWishlist,
      isInWishlist,
      orders,
      placeOrder,
      updateOrderStatus,
      trackingOrderId,
      setTrackingOrderId,
      reorderOrder,
      reorderItems,
      triggerQuickReorder,
      subscriptions,
      createSubscription,
      pauseSubscription,
      resumeSubscription,
      cancelSubscription,
      updateSubscriptionFrequency,
      rewards,
      rewardCoupons,
      redeemVoucher,
      redeemRewardCoupon,
      user,
      addresses,
      addAddress,
      setDefaultAddress,
      isLoggedIn,
      login,
      logout,
      isCheckoutOpen,
      setIsCheckoutOpen,
      toasts,
      showToast,
      removeToast,
      resetToDefaultData,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
