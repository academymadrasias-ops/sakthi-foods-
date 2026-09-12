import React from 'react';
import { useCart } from '../context/CartContext';
import { Sparkles, Plus, Check, ArrowRight, X } from 'lucide-react';

const RECOMMENDATIONS = [
  {
    id: 'rec-1',
    name: 'Pure Organic Country Palm Jaggery (Karupatti)',
    price: 140,
    mrp: 180,
    unit: '500 g',
    category: 'Sweetener',
    image: '/assets/logo.png',
    description: '100% natural, unrefined palm jaggery rich in iron & minerals.'
  },
  {
    id: 'rec-2',
    name: 'Sprouted Multi-Grain Health Mix (Sathumaavu)',
    price: 220,
    mrp: 270,
    unit: '500 g',
    category: 'Health Mix',
    image: '/assets/logo.png',
    description: 'Traditional blend of 18 grains for immunity and energy.'
  },
  {
    id: 'rec-3',
    name: 'Sukku Malli Herbal Tea Powder',
    price: 90,
    mrp: 120,
    unit: '200 g',
    category: 'Tea & Health',
    image: '/assets/logo.png',
    description: 'Dry ginger & coriander herbal brew for digestion & wellness.'
  }
];

export default function UpsellModal() {
  const {
    isUpsellOpen,
    setIsUpsellOpen,
    proceedToCheckoutDirect,
    addToCart,
    cartItems
  } = useCart();

  if (!isUpsellOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsUpsellOpen(false)}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden z-10 my-auto p-5 animate-in zoom-in-95 duration-200 border border-gray-200">
        {/* Close Button */}
        <button
          onClick={() => setIsUpsellOpen(false)}
          className="absolute top-3 right-3 text-[#565959] hover:text-[#0f1111] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-3 border-b border-gray-200">
          <span className="inline-flex items-center gap-1 bg-[#c6f3ed] text-[#0f1111] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-1 border border-[#87d8d2]">
            <Sparkles className="w-3.5 h-3.5 fill-[#007600] text-[#007600]" />
            Frequently Bought Together
          </span>
          <h3 className="text-lg font-extrabold text-[#0f1111] font-['Inter']">
            Enhance Your Organic Order!
          </h3>
          <p className="text-xs text-[#565959] mt-0.5">
            Customers buying traditional items often add these 100% natural essentials.
          </p>
        </div>

        {/* Recommended Items List */}
        <div className="py-4 space-y-3 max-h-72 overflow-y-auto">
          {RECOMMENDATIONS.map((item) => {
            const isAdded = cartItems.some(i => i.product.id === item.id);

            return (
              <div
                key={item.id}
                className="bg-[#f7f8f8] p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-3 hover:border-[#87d8d2] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 bg-white"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0f1111] leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-[#565959] font-medium">
                      Unit: {item.unit}
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[#b12704]">
                        ₹{item.price}
                      </span>
                      <span className="text-[10px] text-[#565959] line-through">
                        ₹{item.mrp}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(item, 1, true);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                    isAdded
                      ? 'bg-[#e7f4e8] text-[#007600] border border-[#007600]/20 shadow-2xs'
                      : 'bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] shadow-2xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Add +
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={proceedToCheckoutDirect}
            className="text-[#565959] hover:text-[#0f1111] font-bold text-xs px-3 py-2"
          >
            Skip &amp; Continue
          </button>

          <button
            onClick={proceedToCheckoutDirect}
            className="bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] border border-[#ff8f00] font-extrabold text-xs px-5 py-2.5 rounded-full shadow-2xs flex items-center gap-1.5"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 text-[#0f1111]" />
          </button>
        </div>
      </div>
    </div>
  );
}
