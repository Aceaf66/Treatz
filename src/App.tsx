/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { SubscriptionsView } from './views/SubscriptionsView';
import { RewardsView } from './views/RewardsView';
import { AccountView } from './views/AccountView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals & Drawers
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { PetModal } from './components/pets/PetModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';

const AppContent: React.FC = () => {
  const { currentPage } = useStore();

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderActiveView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'shop':
      case 'dogs':
      case 'cats':
        return <ShopView />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'rewards':
        return <RewardsView />;
      case 'account':
        return <AccountView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-gray-800 selection:bg-[#4A154B] selection:text-white font-sans antialiased">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Dynamic View Body */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Global Interactive Overlays */}
      <ProductDetailModal />
      <PetModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <ToastContainer />

      {/* Bottom Sticky Mobile Navigation Bar */}
      <MobileNav />

      {/* Brand Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
