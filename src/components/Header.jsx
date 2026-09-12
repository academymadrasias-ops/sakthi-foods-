import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Search, Mic, ShoppingCart, Menu, Bell, Sparkles, X, ChevronRight, RefreshCw, MapPin } from 'lucide-react';

export default function Header({ onRefreshSheet, isLoadingSheet, onNavigateSection }) {
  const {
    cartItems,
    totalItemsCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    showToast
  } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Web Speech API Voice Search
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice search is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak now (e.g. "Rice", "Millet")');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        showToast(`Searching for: "${transcript}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Could not hear voice input. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      showToast('Voice search failed to initialize.');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#87d8d2] via-[#a2e6df] to-[#c6f3ed] text-[#0f1111] shadow-sm border-b border-[#a2e6df]">
      {/* DECORATIVE TOP CORNER LEAF OVERLAYS */}
      <img
        src="/assets/left.png"
        alt="Top Left Decorative Organic Leaf"
        className="fixed top-0 left-0 z-50 pointer-events-none w-[85px] sm:w-[110px] md:w-[150px] lg:w-[170px] h-auto drop-shadow-md select-none opacity-90"
      />

      <img
        src="/assets/right.png"
        alt="Top Right Decorative Organic Leaf"
        className="fixed top-0 right-0 z-50 pointer-events-none w-[85px] sm:w-[110px] md:w-[150px] lg:w-[170px] h-auto drop-shadow-md select-none opacity-90"
      />

      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 py-2 md:px-6 md:py-2.5 flex items-center justify-between gap-3 relative z-10">
        {/* Left Side: Hamburger & Brand Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-1.5 rounded-lg hover:bg-black/5 transition-colors text-[#0f1111]"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div 
            onClick={() => { setActiveCategory('All Categories'); setSearchQuery(''); onNavigateSection('shop'); }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              src="/assets/logo.png"
              alt="Sakthi Foods Logo"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-[#0f1111]/20 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-base md:text-xl tracking-tight leading-none text-[#0f1111] font-['Inter']">
                Sakthi Foods
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] md:text-xs font-semibold text-[#007600] italic tracking-wider flex items-center gap-0.5">
                  100% Organic <Sparkles className="w-2.5 h-2.5 fill-[#007600] text-[#007600]" />
                </span>
                <span className="hidden md:inline-block bg-[#ffd814] text-[#0f1111] text-[9px] font-extrabold px-1 rounded border border-[#fcd200]">
                  PRIME
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Search Bar (Desktop View) - Pure White Pill */}
        <div className="hidden md:flex flex-1 max-w-2xl relative mx-4">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Organic Rice, Millets, Combos..."
              className="w-full pl-10 pr-10 py-2 bg-white text-[#0f1111] placeholder-[#565959] rounded-full text-sm font-medium focus:outline-none shadow-xs border border-gray-300 focus:border-[#ffa41c]"
            />
            <Search className="w-4.5 h-4.5 text-[#565959] absolute left-3.5" />
            
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-10 text-[#565959] hover:text-[#0f1111] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}

            <button
              onClick={handleVoiceSearch}
              className={`absolute right-3 p-1 rounded-full transition-colors ${
                isListening ? 'text-red-600 animate-pulse bg-red-50' : 'text-[#0f1111] hover:bg-gray-100'
              }`}
              title="Voice Search"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Live Sheet Sync Indicator Button */}
          <button
            onClick={onRefreshSheet}
            disabled={isLoadingSheet}
            className="hidden md:flex items-center gap-1.5 bg-white/70 hover:bg-white text-xs font-semibold px-2.5 py-1.5 rounded-full transition-colors text-[#0f1111] border border-gray-300 shadow-2xs"
            title="Sync Live Google Sheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0f1111] ${isLoadingSheet ? 'animate-spin' : ''}`} />
            <span>{isLoadingSheet ? 'Syncing...' : 'Live Sync'}</span>
          </button>

          {/* Notifications */}
          <button 
            onClick={() => showToast("🔔 Special Offer: Free Delivery on Combos above ₹499!")}
            className="p-1.5 hover:bg-black/5 rounded-full relative text-[#0f1111]"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ffa41c] rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ffa41c] rounded-full"></span>
          </button>

          {/* Cart Icon & Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] px-3 py-1.5 rounded-full font-medium text-xs md:text-sm transition-all shadow-2xs relative active:scale-95"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#b12704] text-white font-extrabold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Directly below header) */}
      <div className="md:hidden px-3 pb-2 pt-0.5 relative z-10">
        <div className="relative flex items-center bg-white rounded-full shadow-xs border border-gray-300">
          <Search className="w-4 h-4 text-[#565959] absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Organic Rice, Millets, Combos..."
            className="w-full pl-9 pr-10 py-1.5 bg-white text-[#0f1111] placeholder-[#565959] rounded-full text-xs font-medium focus:outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-9 text-[#565959] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
          <button
            onClick={handleVoiceSearch}
            className={`absolute right-2.5 p-1 rounded-full ${
              isListening ? 'text-red-600 animate-pulse' : 'text-[#0f1111]'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>


      {/* Mobile Navigation Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="relative w-4/5 max-w-xs bg-white text-[#0f1111] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-[#87d8d2] to-[#a2e6df] p-4 text-[#0f1111] flex items-center justify-between border-b border-[#87d8d2]">
              <div className="flex items-center gap-3">
                <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full border border-[#0f1111]/20 shadow-xs" />
                <div>
                  <h3 className="font-bold text-sm">Sakthi Foods</h3>
                  <p className="text-xs text-[#007600] font-semibold">100% Organic Store</p>
                </div>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 text-[#0f1111] hover:bg-black/5 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-4 py-2 text-[11px] font-bold text-[#565959] uppercase tracking-wider">
                Quick Navigation
              </div>
              <button
                onClick={() => { onNavigateSection('shop'); setIsMenuOpen(false); }}
                className="w-full px-4 py-3 text-left font-medium text-sm flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 text-[#0f1111]"
              >
                <span>🛍️ Shop Catalog</span>
                <ChevronRight className="w-4 h-4 text-[#565959]" />
              </button>

              <button
                onClick={() => { onNavigateSection('shorts'); setIsMenuOpen(false); }}
                className="w-full px-4 py-3 text-left font-bold text-sm flex items-center justify-between border-b border-gray-100 hover:bg-rose-50 text-[#ff0050]"
              >
                <span className="flex items-center gap-2">🎬 Cooking Shorts (Reels)</span>
                <ChevronRight className="w-4 h-4 text-[#ff0050]" />
              </button>

              <button
                onClick={() => { onNavigateSection('combos'); setIsMenuOpen(false); }}
                className="w-full px-4 py-3 text-left font-medium text-sm flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 text-[#0f1111]"
              >
                <span>🔥 Combo Deals</span>
                <ChevronRight className="w-4 h-4 text-[#565959]" />
              </button>

              <button
                onClick={() => { onNavigateSection('process'); setIsMenuOpen(false); }}
                className="w-full px-4 py-3 text-left font-medium text-sm flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 text-[#0f1111]"
              >
                <span>🌾 Our Organic Process</span>
                <ChevronRight className="w-4 h-4 text-[#565959]" />
              </button>

              <div className="p-4 mt-4 bg-amber-50 mx-3 rounded-xl border border-amber-200">
                <p className="text-xs font-bold text-[#0f1111] mb-1">Direct Orders & Inquiries</p>
                <p className="text-xs text-[#565959] mb-2">Call or WhatsApp our store in Kumbakonam</p>
                <a
                  href="tel:+919791795173"
                  className="block text-center bg-[#ffd814] text-[#0f1111] text-xs font-bold py-2 rounded-full border border-[#fcd200] shadow-xs"
                >
                  Call +91 9791795173
                </a>
              </div>
            </div>

            {/* Footer sync */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
              <button
                onClick={() => { onRefreshSheet(); setIsMenuOpen(false); }}
                className="text-xs text-[#0f1111] font-bold flex items-center justify-center gap-1.5 w-full py-1"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#007600]" />
                <span>Sync Live Google Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
