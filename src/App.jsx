import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { fetchLiveProducts } from './services/googleSheetService';
import Header from './components/Header';
import CategoryStrip from './components/CategoryStrip';
import HeroCarousel from './components/HeroCarousel';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import UpsellModal from './components/UpsellModal';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import ProcessSection from './components/ProcessSection';
import ContactSection from './components/ContactSection';
import CookingShortsSection from './components/CookingShortsSection';
import MobileBottomNav from './components/MobileBottomNav';
import { Sparkles, Phone, MessageSquare, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

function AppContent() {
  const [products, setProducts] = useState([]);
  const [isLoadingSheet, setIsLoadingSheet] = useState(true);
  const [dataNotice, setDataNotice] = useState(null);
  const [activeTab, setActiveTab] = useState('shop');
  const { toastMessage, showToast } = useCart();

  // Load product catalog live from Google Sheet
  const loadSheetCatalog = async () => {
    setIsLoadingSheet(true);
    try {
      const res = await fetchLiveProducts();
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
        if (res.source === 'live') {
          setDataNotice(`Synced ${res.products.length} products live from Google Sheet`);
        } else if (res.source === 'cache') {
          setDataNotice('Loaded latest catalog from local cache');
        }
      }
    } catch (err) {
      console.error('Sheet fetch error:', err);
      showToast('Offline mode: displaying local product catalog');
    } finally {
      setIsLoadingSheet(false);
      setTimeout(() => setDataNotice(null), 3500);
    }
  };

  useEffect(() => {
    loadSheetCatalog();
  }, []);

  // Dynamically extract unique categories from current product list
  const availableCategories = React.useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const handleNavigateSection = (sectionId) => {
    setActiveTab(sectionId);
    if (sectionId === 'shop') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'shorts') {
      const el = document.getElementById('cooking-shorts-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'process') {
      const el = document.getElementById('organic-process');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'contact') {
      const el = document.getElementById('contact-info');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111] flex flex-col font-['Roboto']">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0f1111] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-gray-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-[#ffd814]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Live Data Sync Banner Notification */}
      {dataNotice && (
        <div className="bg-[#c6f3ed] text-[#0f1111] text-xs font-bold py-1.5 px-3 text-center flex items-center justify-center gap-1.5 shadow-inner border-b border-[#87d8d2]">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#007600]" />
          <span>{dataNotice}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        onRefreshSheet={loadSheetCatalog}
        isLoadingSheet={isLoadingSheet}
        onNavigateSection={handleNavigateSection}
      />

      {/* Horizontal Category Strip */}
      <CategoryStrip availableCategories={availableCategories} />

      {/* Main Content Body */}
      <main className="flex-1 space-y-2">
        {/* Hero Banner Slider */}
        <HeroCarousel />

        {/* Dynamic Product Grid */}
        <ProductCatalog
          products={products}
          isLoading={isLoadingSheet}
          onRefresh={loadSheetCatalog}
        />

        {/* Organic Process Storytelling Section */}
        <ProcessSection />

        {/* Store Location & Contact Info */}
        <ContactSection />
      </main>

      {/* DEDICATED FULL-SCREEN COOKING SHORTS PAGE (Only when Shorts tab is clicked) */}
      {activeTab === 'shorts' && (
        <CookingShortsSection onClose={() => setActiveTab('shop')} />
      )}

      {/* Modals & Slide-overs */}
      <ProductDetailModal />
      <CartDrawer />
      <UpsellModal />
      <CheckoutModal />
      <OrderConfirmationModal />

      {/* Sakthi Foods Organic Light Footer */}
      <footer className="bg-white text-[#0f1111] pt-8 pb-20 md:pb-8 border-t border-gray-200 text-xs shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/assets/logo.png" alt="Sakthi Foods" className="w-8 h-8 rounded-full border border-gray-200 shadow-xs" />
              <span className="font-extrabold text-[#0f1111] text-base font-['Inter']">Sakthi Foods</span>
            </div>
            <p className="text-[#565959] leading-relaxed text-[11px]">
              100% pure traditional organic rice, unpolished millets, and healthy food mixes directly from Kaveri Delta, Kumbakonam.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-[#0f1111] uppercase text-[11px] tracking-wider mb-2">
              Quick Contact
            </h4>
            <ul className="space-y-1.5 text-[#565959]">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#007600]" />
                <a href="tel:+919791795173" className="hover:text-[#007600] font-semibold transition-colors">+91 9791795173</a>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#007600]" />
                <a href="tel:+919443142252" className="hover:text-[#007600] font-semibold transition-colors">+91 9443142252</a>
              </li>
              <li className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <a href="https://wa.me/919791795173" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] font-semibold transition-colors">
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-[#0f1111] uppercase text-[11px] tracking-wider mb-2">
              Store Location
            </h4>
            <p className="text-[#565959] leading-relaxed text-[11px]">
              Sakthi Foods, Kumbakonam, Thanjavur District, Tamil Nadu - 612001.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-[#0f1111] uppercase text-[11px] tracking-wider mb-2">
              Quality Assurance
            </h4>
            <div className="space-y-1.5 text-[#565959] text-[11px]">
              <p className="flex items-center gap-1.5 text-[#007600] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#007600]" /> 100% Chemical-Free
              </p>
              <p className="flex items-center gap-1.5 text-[#b12704] font-bold">
                <Truck className="w-4 h-4 text-[#b12704]" /> Free Shipping &gt; ₹499
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 text-center text-[#565959] text-[11px] font-medium">
          © {new Date().getFullYear()} Sakthi Foods Kumbakonam. All rights reserved. Powered by Live Google Sheets Sync.
        </div>
      </footer>

      {/* Fixed Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} onSelectTab={handleNavigateSection} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
