import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { getFallbackDriveUrl } from '../services/googleSheetService';
import { X, Star, ShieldCheck, ShoppingBag, Zap, CheckCircle2, Truck } from 'lucide-react';

export default function ProductDetailModal() {
  const { isDetailOpen, setIsDetailOpen, selectedProduct, addToCart, initiateBuyNow } = useCart();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!isDetailOpen || !selectedProduct) return null;

  const images = selectedProduct.images && selectedProduct.images.length > 0 
    ? selectedProduct.images 
    : [selectedProduct.primaryImage || '/assets/logo.png'];

  const currentImage = images[activeImgIndex] || '/assets/logo.png';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDetailOpen(false)}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200 border border-gray-200">
        {/* Close Button */}
        <button
          onClick={() => setIsDetailOpen(false)}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-[#0f1111] rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 bg-[#f7f8f8] p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
          <div className="relative flex-1 flex items-center justify-center min-h-[220px] md:min-h-[280px]">
            <img
              src={currentImage}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="max-h-64 md:max-h-80 max-w-full object-contain rounded-lg"
              onError={(e) => {
                if (!e.target.dataset.triedFallback) {
                  e.target.dataset.triedFallback = 'true';
                  const raw = selectedProduct.rawImages?.[activeImgIndex] || currentImage;
                  e.target.src = getFallbackDriveUrl(raw);
                } else {
                  e.target.src = '/assets/logo.png';
                }
              }}
            />
            <span className="absolute top-2 left-2 text-[#007600] bg-[#e7f4e8] border border-[#007600]/20 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#007600]" />
              100% ORGANIC
            </span>
          </div>

          {/* Thumbnails list if multiple images exist */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-gray-200">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-12 h-12 rounded-lg border-2 overflow-hidden bg-white ${
                    idx === activeImgIndex ? 'border-[#ffa41c] ring-2 ring-[#ffa41c]/30' : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/assets/logo.png'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="w-full md:w-1/2 p-5 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category & Unit */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#c6f3ed] text-[#0f1111] text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-[#87d8d2]">
                {selectedProduct.category}
              </span>
              <span className="text-[#007600] bg-[#e7f4e8] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#007600]/20">
                {selectedProduct.unit}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg md:text-xl font-black text-[#0f1111] leading-tight font-['Inter']">
              {selectedProduct.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-[#de7921] text-white text-xs font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                <span>{selectedProduct.rating || '4.9'}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-[#565959] font-medium">
                ({selectedProduct.ratingCount || 120} Customer Reviews)
              </span>
              <span className="text-xs text-[#007600] font-bold bg-[#e7f4e8] px-2 py-0.5 rounded-full border border-[#007600]/20">
                In Stock
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-4 p-3 bg-[#f7f8f8] rounded-xl border border-gray-200 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#b12704] font-['Inter']">
                ₹{selectedProduct.price}
              </span>
              {selectedProduct.mrp > selectedProduct.price && (
                <span className="text-sm text-[#565959] line-through">
                  ₹{selectedProduct.mrp}
                </span>
              )}
              <span className="text-xs font-extrabold text-[#cc0c39] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {selectedProduct.discountPercent}% OFF
              </span>
            </div>

            {/* Organic Assurance checklist */}
            <div className="mt-4 space-y-1.5 text-xs text-[#0f1111] font-medium">
              <div className="flex items-center gap-2 text-[#007600] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#007600] flex-shrink-0" />
                <span>Naturally Grown without synthetic pesticides or chemicals</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0f1111] flex-shrink-0" />
                <span>Fast & Safe Delivery directly from Kumbakonam store</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-extrabold text-[#0f1111] uppercase tracking-wider mb-1">
                Product Description
              </h4>
              <p className="text-xs text-[#565959] leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>
          </div>

          {/* Action CTAs: Amazon Yellow Add to Cart & Amazon Orange Buy Now */}
          <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                addToCart(selectedProduct, 1);
                setIsDetailOpen(false);
              }}
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] rounded-full font-extrabold py-2.5 px-3 shadow-2xs flex items-center justify-center gap-2 text-xs md:text-sm active:scale-95 transition-transform"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => {
                setIsDetailOpen(false);
                initiateBuyNow(selectedProduct);
              }}
              className="bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] border border-[#ff8f00] rounded-full font-extrabold py-2.5 px-3 shadow-2xs flex items-center justify-center gap-2 text-xs md:text-sm active:scale-95 transition-transform"
            >
              <Zap className="w-4 h-4 fill-[#0f1111]" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
