import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { getFallbackDriveUrl } from '../services/googleSheetService';
import { ShoppingBag, Zap, Star, ShieldCheck, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart, initiateBuyNow, openProductDetail } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

  const images = product.images && product.images.length > 0 ? product.images : [product.primaryImage];
  const currentImg = images[imgIndex] || '/assets/logo.png';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Upper Area: Image + Tags */}
      <div>
        {/* Image Container */}
        <div 
          onClick={() => openProductDetail(product)}
          className="relative w-full h-44 sm:h-48 md:h-52 bg-[#f7f8f8] flex items-center justify-center p-3 cursor-pointer overflow-hidden border-b border-gray-100"
        >
          {/* Main Product Image */}
          <img
            src={currentImg}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              if (!e.target.dataset.triedFallback) {
                e.target.dataset.triedFallback = 'true';
                const raw = product.rawImages?.[imgIndex] || currentImg;
                e.target.src = getFallbackDriveUrl(raw);
              } else {
                e.target.src = '/assets/logo.png';
              }
            }}
          />

          {/* Flipkart/Amazon Organic Badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            <span className="text-[#007600] bg-[#e7f4e8] border border-[#007600]/20 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#007600]" />
              <span>100% ORGANIC</span>
            </span>
          </div>

          {/* Discount Badge top-right */}
          {product.discountPercent > 0 && (
            <span className="absolute top-2 right-2 bg-[#cc0c39] text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-2xs">
              {product.discountPercent}% OFF
            </span>
          )}

          {/* Quick View Hover Button */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white text-[#0f1111] font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 border border-gray-200">
              <Eye className="w-3.5 h-3.5 text-[#565959]" /> Quick View
            </span>
          </div>

          {/* Image Dots thumbnail preview if multi-images */}
          {images.length > 1 && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full border border-gray-200 backdrop-blur-xs">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === imgIndex ? 'bg-[#ffa41c] w-3' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-3">
          {/* Unit / Weight Pill & Category */}
          <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-[#565959] mb-1">
            <span className="text-[#007600] bg-[#e7f4e8] border border-[#007600]/20 px-2 py-0.5 rounded-full font-bold">
              {product.unit}
            </span>
            <span className="text-[#565959] font-medium truncate max-w-[100px]">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => openProductDetail(product)}
            className="text-xs sm:text-sm font-bold text-[#0f1111] line-clamp-2 hover:text-[#b12704] cursor-pointer transition-colors leading-snug h-9 font-['Roboto']"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="bg-[#de7921] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span>{product.rating || '4.8'}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[10px] text-[#565959] font-medium">
              ({product.ratingCount || 89})
            </span>
          </div>

          {/* Price & Strike MRP */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base sm:text-lg font-bold text-[#b12704] font-['Inter']">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-[#565959] line-through">
                ₹{product.mrp}
              </span>
            )}
            <span className="text-[11px] font-bold text-[#cc0c39]">
              {product.discountPercent}% off
            </span>
          </div>

          {/* Delivery Indicator */}
          <div className="mt-1 text-[10px] text-[#565959] font-medium flex items-center gap-1">
            <span className="text-[#007600] font-bold">FREE Delivery</span>
            <span>over ₹499</span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Add to Cart: Amazon Yellow, Buy Now: Amazon Orange) */}
      <div className="p-2.5 bg-[#f7f8f8] border-t border-gray-100 flex flex-col gap-1.5">
        <button
          onClick={() => addToCart(product, 1)}
          className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] rounded-full font-bold text-[11px] sm:text-xs py-2 px-2 shadow-2xs transition-colors flex items-center justify-center gap-1 active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#0f1111]" />
          <span>Add to Cart</span>
        </button>

        <button
          onClick={() => initiateBuyNow(product)}
          className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] border border-[#ff8f00] rounded-full font-bold text-[11px] sm:text-xs py-2 px-2 shadow-2xs transition-colors flex items-center justify-center gap-1 active:scale-95"
        >
          <Zap className="w-3.5 h-3.5 fill-[#0f1111] text-[#0f1111]" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
