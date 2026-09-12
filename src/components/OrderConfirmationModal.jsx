import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageSquare, X } from 'lucide-react';

export default function OrderConfirmationModal() {
  const { completedOrder, setCompletedOrder } = useCart();

  useEffect(() => {
    if (completedOrder) {
      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [completedOrder]);

  if (!completedOrder) return null;

  const { orderId, customer, items, finalTotal, paymentMethod } = completedOrder;

  // Format WhatsApp Payload
  const itemsText = items.map((item, idx) => 
    `${idx + 1}. *${item.product.name}* (${item.product.unit}) x ${item.quantity} = ₹${item.product.price * item.quantity}`
  ).join('\n');

  const whatsappMessage = `*NEW ORDER - SAKTHI FOODS* 🌾
-----------------------------------
*Order ID:* ${orderId}
*Date:* ${completedOrder.date}

*CUSTOMER DETAILS:*
👤 Name: ${customer.fullName}
📞 Phone: ${customer.mobileNumber}
📍 Address: ${customer.address}, Pincode: ${customer.pincode}

*ITEMS ORDERED:*
${itemsText}

-----------------------------------
*Total Amount:* ₹${finalTotal}
*Payment Method:* ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI Payment'}

Please confirm my order. Thank you!`;

  const whatsappUrl = `https://wa.me/919791795173?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setCompletedOrder(null)}
      ></div>

      {/* Confirmation Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden z-10 my-auto p-6 text-center animate-in zoom-in-95 duration-200 border-2 border-[#007600]">
        {/* Close Button */}
        <button
          onClick={() => setCompletedOrder(null)}
          className="absolute top-3 right-3 text-[#565959] hover:text-[#0f1111] p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 bg-[#e7f4e8] text-[#007600] rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce-subtle">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-xl font-black text-[#0f1111] font-['Inter']">
          Order Placed Successfully!
        </h2>
        <p className="text-xs text-[#565959] mt-1">
          Thank you <span className="font-bold text-[#0f1111]">{customer.fullName}</span>! Your order <span className="font-mono font-bold text-[#007600]">{orderId}</span> is received.
        </p>

        {/* Summary Card */}
        <div className="mt-4 p-3.5 bg-[#f7f8f8] rounded-xl border border-gray-200 text-left text-xs space-y-2">
          <div className="flex justify-between border-b border-gray-200 pb-1.5 font-bold text-[#0f1111]">
            <span>Delivery to:</span>
            <span>{customer.mobileNumber}</span>
          </div>
          <p className="text-[#565959] text-[11px] leading-snug">
            {customer.address}, Pincode: {customer.pincode}
          </p>

          <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-[#b12704]">
            <span className="text-[#0f1111]">Total Payable:</span>
            <span>₹{finalTotal} ({paymentMethod === 'cod' ? 'COD' : 'UPI'})</span>
          </div>
        </div>

        {/* Highlight 1-Click WhatsApp Button */}
        <div className="mt-5 p-3.5 bg-[#e7f4e8] rounded-xl border border-[#007600]/20 space-y-2">
          <p className="text-xs font-bold text-[#007600]">
            📲 Instant WhatsApp Confirmation
          </p>
          <p className="text-[11px] text-[#007600]/80">
            Click below to send your order summary directly to Sakthi Foods store on WhatsApp (+91 9791795173) for quick dispatch.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold py-3 px-4 rounded-full shadow-2xs text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <MessageSquare className="w-5 h-5 fill-white text-white" />
            <span>Send Order on WhatsApp</span>
          </a>
        </div>

        <button
          onClick={() => setCompletedOrder(null)}
          className="mt-4 text-xs font-bold text-[#565959] hover:text-[#0f1111]"
        >
          Close &amp; Return to Shop
        </button>
      </div>
    </div>
  );
}
