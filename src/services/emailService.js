// Email Service for Sakthi Foods Order Notifications
// Target Admin Email: guganvs2@gmail.com

const TARGET_ADMIN_EMAIL = 'guganvs2@gmail.com';

/**
 * Sends order notification email directly to guganvs2@gmail.com
 */
export async function sendOrderEmailNotification(orderData) {
  const { orderId, date, customer, items, subtotalPrice, deliveryCharge, totalSavings, finalTotal, paymentMethod, upiRefNo } = orderData;

  const itemsFormatted = items.map((item, idx) => {
    const pName = item.product?.name || item.name || 'Product';
    const pUnit = item.product?.unit || item.unit || 'unit';
    const pPrice = item.product?.price || item.price || 0;
    const itemTotal = pPrice * item.quantity;
    return `${idx + 1}. ${pName} (${pUnit}) x ${item.quantity} = ₹${itemTotal}`;
  }).join('\n');

  const payload = {
    _subject: `🌾 NEW ORDER RECEIVED - Sakthi Foods (${orderId})`,
    _template: 'table',
    _captcha: 'false',
    Order_Status: 'NEW ORDER',
    Order_ID: orderId,
    Order_Date: date,
    Customer_Name: customer.fullName,
    Mobile_Number: customer.mobileNumber,
    Delivery_Address: `${customer.address}, Pincode: ${customer.pincode}`,
    Order_Notes: customer.orderNotes || 'None',
    Items_Ordered: itemsFormatted,
    Subtotal_Amount: subtotalPrice ? `₹${subtotalPrice}` : `₹${finalTotal}`,
    Delivery_Charge: deliveryCharge !== undefined ? `₹${deliveryCharge}` : 'Free',
    Total_Savings: totalSavings ? `₹${totalSavings}` : '₹0',
    Final_Total_Amount: `₹${finalTotal}`,
    Payment_Method: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : `UPI Payment (UTR/Ref: ${upiRefNo || 'N/A'})`,
    Recipient_Email: TARGET_ADMIN_EMAIL
  };

  try {
    // Primary Email API Dispatch to guganvs2@gmail.com via FormSubmit
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('Order notification email successfully dispatched to', TARGET_ADMIN_EMAIL);
      return { success: true };
    }
  } catch (err) {
    console.warn('FormSubmit email dispatch error:', err);
  }

  // Backup Web3Forms Dispatch to guganvs2@gmail.com
  try {
    const backupRes = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '0a7a3e7a-9721-4f9e-a89e-4e4b78901234', // fallback API key
        email: TARGET_ADMIN_EMAIL,
        subject: `🌾 NEW ORDER RECEIVED - Sakthi Foods (${orderId})`,
        message: `NEW ORDER DETAILS:\n\nOrder ID: ${orderId}\nDate: ${date}\n\nCUSTOMER DETAILS:\nName: ${customer.fullName}\nPhone: ${customer.mobileNumber}\nAddress: ${customer.address}, Pincode: ${customer.pincode}\nNotes: ${customer.orderNotes || 'None'}\n\nITEMS ORDERED:\n${itemsFormatted}\n\nPAYMENT & SUMMARY:\nSubtotal: ₹${subtotalPrice || finalTotal}\nDelivery: ₹${deliveryCharge || 0}\nTotal Amount: ₹${finalTotal}\nPayment Method: ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : `UPI Payment (UTR: ${upiRefNo})`}`
      })
    });
    return { success: backupRes.ok };
  } catch (e) {
    return { success: false };
  }
}

