import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sakthi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [upsellSourceProduct, setUpsellSourceProduct] = useState(null);

  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sakthi_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addToCart = (product, qty = 1, showNotice = true) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { product, quantity: qty }];
    });
    if (showNotice) {
      showToast(`Added "${product.name}" to cart!`);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Direct "Buy Now" flow: triggers upsell modal first, then checkout
  const initiateBuyNow = (product) => {
    setUpsellSourceProduct(product);
    // Add target product to cart if not already present
    const inCart = cartItems.some(i => i.product.id === product.id);
    if (!inCart) {
      addToCart(product, 1, false);
    }
    setIsUpsellOpen(true);
  };

  const openCheckoutFromCart = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    setIsCartOpen(false);
    setIsUpsellOpen(true);
  };

  const proceedToCheckoutDirect = () => {
    setIsUpsellOpen(false);
    setIsCheckoutOpen(true);
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalMrp = cartItems.reduce((acc, item) => acc + (item.product.mrp * item.quantity), 0);
  const totalSavings = Math.max(0, totalMrp - subtotalPrice);
  const deliveryCharge = subtotalPrice > 499 || subtotalPrice === 0 ? 0 : 40;
  const finalTotal = subtotalPrice + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotalPrice,
        totalMrp,
        totalSavings,
        deliveryCharge,
        finalTotal,
        isCartOpen,
        setIsCartOpen,
        isUpsellOpen,
        setIsUpsellOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isDetailOpen,
        setIsDetailOpen,
        selectedProduct,
        setSelectedProduct,
        upsellSourceProduct,
        initiateBuyNow,
        openCheckoutFromCart,
        proceedToCheckoutDirect,
        openProductDetail,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        completedOrder,
        setCompletedOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
