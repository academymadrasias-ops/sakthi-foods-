import React from 'react';
import { useCart } from '../context/CartContext';
import { getFallbackDriveUrl } from '../services/googleSheetService';
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotalPrice,
    totalMrp,
    totalSavings,
    deliveryCharge,
    finalTotal,
    openCheckoutFromCart
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-[#87d8d2] to-[#a2e6df] text-[#0f1111] p-4 flex items-center justify-between border-b border-[#87d8d2]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0f1111]" />
            <h2 className="font-extrabold text-base tracking-tight font-['Inter']">
              My Shopping Cart ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors text-[#0f1111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="bg-[#c6f3ed] px-4 py-2 border-b border-[#87d8d2] flex items-center justify-between text-xs font-semibold text-[#0f1111]">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#007600]" />
            <span>
              {subtotalPrice >= 500
                ? '🎉 You qualify for FREE Delivery!'
                : `Add ₹${500 - subtotalPrice} more for FREE Delivery`}
            </span>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#eaeded]">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-16 h-16 bg-[#e7f4e8] text-[#007600] rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#0f1111]">Your cart is empty</h3>
              <p className="text-xs text-[#565959] mt-1 max-w-xs mx-auto">
                Explore our traditional organic rice, millets, and health mixes to add items.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] font-extrabold text-xs px-5 py-2.5 rounded-full shadow-2xs transition-colors"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-3 relative"
              >
                {/* Product Thumbnail */}
                <div className="w-16 h-16 bg-[#f7f8f8] rounded-lg border border-gray-200 p-1 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={product.primaryImage || '/assets/logo.png'}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      if (!e.target.dataset.triedFallback) {
                        e.target.dataset.triedFallback = 'true';
                        e.target.src = getFallbackDriveUrl(product.rawImages?.[0] || product.primaryImage);
                      } else {
                        e.target.src = '/assets/logo.png';
                      }
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#0f1111] truncate pr-6">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-[#565959] font-medium">
                    Unit: {product.unit}
                  </p>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-[#b12704]">
                      ₹{product.price * quantity}
                    </span>
                    {product.mrp > product.price && (
                      <span className="text-[11px] text-[#565959] line-through">
                        ₹{product.mrp * quantity}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-[#565959] hover:text-[#b12704] p-1"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="px-2 py-0.5 text-[#0f1111] hover:bg-gray-100 font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-0.5 text-xs font-bold text-[#0f1111] bg-gray-50">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="px-2 py-0.5 text-[#0f1111] hover:bg-gray-100 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Price Breakdown & Order Button */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-200 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#565959] font-medium">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{totalMrp}</span>
              </div>
              <div className="flex justify-between text-[#007600] font-bold">
                <span>Discount Savings</span>
                <span>- ₹{totalSavings}</span>
              </div>
              <div className="flex justify-between text-[#565959] font-medium">
                <span>Delivery Charges</span>
                <span className={deliveryCharge === 0 ? 'text-[#007600] font-bold' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-bold text-[#b12704]">
                <span className="text-[#0f1111]">Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {totalSavings > 0 && (
              <div className="bg-[#e7f4e8] text-[#007600] text-[11px] font-bold p-2 rounded-lg text-center border border-[#007600]/20">
                🌱 You are saving ₹{totalSavings} on this order!
              </div>
            )}

            <button
              onClick={openCheckoutFromCart}
              className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] border border-[#ff8f00] rounded-full font-extrabold py-3 shadow-sm flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-colors active:scale-98"
            >
              <span>Order Now / Place Order</span>
              <ArrowRight className="w-4 h-4 text-[#0f1111]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
