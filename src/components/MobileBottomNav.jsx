import React from 'react';
import { useCart } from '../context/CartContext';
import { Home, Grid, Flame, ShoppingCart } from 'lucide-react';

export default function MobileBottomNav({ activeTab, onSelectTab }) {
  const { totalItemsCount, setIsCartOpen, setActiveCategory } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-xl md:hidden">
      <div className="grid grid-cols-5 h-16 items-center">
        {/* 1. Home / Shop */}
        <button
          onClick={() => {
            setActiveCategory('All Categories');
            onSelectTab('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === 'shop' ? 'text-[#007600] font-extrabold' : 'text-[#565959] font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Shop</span>
        </button>

        {/* 2. Categories */}
        <button
          onClick={() => {
            onSelectTab('shop');
            const el = document.getElementById('shop-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === 'categories' ? 'text-[#007600] font-extrabold' : 'text-[#565959] font-medium'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">Categories</span>
        </button>

        {/* 3. CENTER FEATURED BUTTON: Cooking Shorts (Popped Out Chef Image Icon with Blinking Red Dot) */}
        <button
          onClick={() => {
            onSelectTab('shorts');
          }}
          className={`flex flex-col items-center justify-center relative -top-3 transition-transform active:scale-95 ${
            activeTab === 'shorts' ? 'scale-110' : 'hover:scale-105'
          }`}
        >
          <div className="relative">
            <img
              src="/assets/chef.png"
              alt="Cooking Shorts"
              className="w-11 h-11 object-contain drop-shadow-md"
            />
            {/* Blinking Live Red Dot */}
            <span className="absolute -top-0.5 right-0.5 w-3 h-3 bg-[#ff0050] rounded-full animate-ping"></span>
            <span className="absolute -top-0.5 right-0.5 w-3 h-3 bg-[#ff0050] rounded-full border-2 border-white"></span>
          </div>
          <span className={`text-[10px] -mt-1 ${
            activeTab === 'shorts' ? 'text-[#ff0050] font-black' : 'text-[#0f1111] font-bold'
          }`}>
            Shorts
          </span>
        </button>

        {/* 4. Combos */}
        <button
          onClick={() => {
            setActiveCategory('Combo Deals');
            onSelectTab('combos');
            const el = document.getElementById('shop-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
            activeTab === 'combos' ? 'text-[#ffa41c] font-extrabold' : 'text-[#565959] font-medium'
          }`}
        >
          <Flame className="w-5 h-5 text-[#ffa41c]" />
          <span className="text-[10px]">Combos</span>
        </button>

        {/* 5. Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 text-[#565959] font-medium relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-[#0f1111]" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#b12704] text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[#0f1111] font-bold">Cart</span>
        </button>
      </div>
    </div>
  );
}
