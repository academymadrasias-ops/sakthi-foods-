import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { sendOrderEmailNotification } from '../services/emailService';
import { appendOrderToSheet } from '../services/googleSheetService';
import { X, QrCode, MapPin, User, Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    subtotalPrice,
    deliveryCharge,
    finalTotal,
    totalSavings,
    clearCart,
    setCompletedOrder,
    showToast
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi'
  const [upiRefNo, setUpiRefNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Dynamic QR Code payload for UPI payment
  const upiId = '9791795173@ybl';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=Sakthi%20Foods&am=${finalTotal}&cu=INR`
  )}`;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !mobileNumber.trim() || !address.trim() || !pincode.trim()) {
      showToast('Please fill in all required delivery fields.');
      return;
    }

    if (mobileNumber.trim().length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `SF-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      orderId,
      date: new Date().toLocaleString(),
      customer: {
        fullName,
        mobileNumber,
        address,
        pincode,
        orderNotes
      },
      items: cartItems,
      subtotalPrice,
      deliveryCharge,
      finalTotal,
      totalSavings,
      paymentMethod,
      upiRefNo: paymentMethod === 'upi' ? upiRefNo : 'N/A'
    };

    // 1. Save order history locally
    try {
      const existing = JSON.parse(localStorage.getItem('sakthi_orders') || '[]');
      localStorage.setItem('sakthi_orders', JSON.stringify([orderData, ...existing]));
    } catch (err) {}

    // 2. Automatically store order in Google Sheet (1VpMrxHYk_0WObBaPvUkGpPxGnG2FikmnYMkrFJt3u74)
    try {
      await appendOrderToSheet(orderData);
    } catch (err) {
      console.warn('Sheet append error:', err);
    }

    // 3. Dispatch automated email notification to kpriyadharshini2431997@gmail.com
    try {
      await sendOrderEmailNotification(orderData);
    } catch (err) {
      console.warn('Email notification error:', err);
    }

    // Complete order in context & clear cart
    setCompletedOrder(orderData);
    clearCart();
    setIsSubmitting(false);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCheckoutOpen(false)}
      ></div>

      {/* Checkout Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#87d8d2] via-[#a2e6df] to-[#c6f3ed] text-[#0f1111] p-4 flex items-center justify-between border-b border-[#87d8d2]">
          <div>
            <h2 className="font-extrabold text-base md:text-lg tracking-tight font-['Inter']">
              Complete Your Order
            </h2>
            <p className="text-xs text-[#007600] font-semibold">
              Sakthi Foods Direct Delivery • Kumbakonam
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 hover:bg-black/5 rounded-full text-[#0f1111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {/* Customer Delivery Details Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#0f1111] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-200">
              <MapPin className="w-4 h-4 text-[#007600]" />
              1. Delivery Address &amp; Contact Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">
                  Full Name <span className="text-[#b12704]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#565959] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 bg-[#f7f8f8] border border-gray-300 rounded-full text-xs font-medium text-[#0f1111] focus:outline-none focus:border-[#ffa41c] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">
                  Mobile Number <span className="text-[#b12704]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#565959] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit Phone Number"
                    className="w-full pl-9 pr-3 py-2 bg-[#f7f8f8] border border-gray-300 rounded-full text-xs font-medium text-[#0f1111] focus:outline-none focus:border-[#ffa41c] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#0f1111] mb-1">
                  Delivery Address <span className="text-[#b12704]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street Name, Landmark"
                  className="w-full px-3 py-2 bg-[#f7f8f8] border border-gray-300 rounded-full text-xs font-medium text-[#0f1111] focus:outline-none focus:border-[#ffa41c] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f1111] mb-1">
                  Pincode <span className="text-[#b12704]">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 612001"
                  className="w-full px-3 py-2 bg-[#f7f8f8] border border-gray-300 rounded-full text-xs font-medium text-[#0f1111] focus:outline-none focus:border-[#ffa41c] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#0f1111] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-200">
              <MapPin className="w-4 h-4 text-[#007600]" />
              2. Payment Option
            </h3>

            <div className="p-3.5 rounded-xl border-2 border-[#87d8d2] bg-[#c6f3ed]/30 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#007600] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                ✓
              </div>
              <div>
                <div className="font-extrabold text-xs text-[#0f1111]">Cash on Delivery (COD)</div>
                <div className="text-[11px] text-[#007600] font-semibold">Pay cash directly when item is delivered to your address</div>
              </div>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-[#f7f8f8] p-3.5 rounded-xl border border-gray-200 space-y-1.5 text-xs">
            <h4 className="font-bold text-[#0f1111] border-b border-gray-200 pb-1">Order Summary</h4>
            <div className="flex justify-between text-[#565959]">
              <span>Total Items:</span>
              <span className="font-bold text-[#0f1111]">{cartItems.length}</span>
            </div>
            <div className="flex justify-between text-[#565959]">
              <span>Subtotal Amount:</span>
              <span>₹{subtotalPrice}</span>
            </div>
            <div className="flex justify-between text-[#565959]">
              <span>Delivery Charges:</span>
              <span className={deliveryCharge === 0 ? 'text-[#007600] font-bold' : ''}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#b12704] pt-1 border-t border-gray-200">
              <span className="text-[#0f1111]">Payable Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ffa41c] hover:bg-[#fa8900] disabled:bg-[#ffd89b] disabled:border-[#ffc873] disabled:cursor-not-allowed text-[#0f1111] border border-[#ff8f00] rounded-full font-extrabold py-3.5 shadow-sm flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all active:scale-98"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#0f1111]" />
                <span>Processing Your Order...</span>
              </>
            ) : (
              <>
                <span>Confirm &amp; Place Order</span>
                <ArrowRight className="w-4 h-4 text-[#0f1111]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
