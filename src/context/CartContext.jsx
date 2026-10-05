import { createContext, useContext, useEffect, useState } from "react";

import { getCart } from "../api/cart.api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);

      const response = await getCart();

      setCart(response?.data || response);
    } catch (error) {
      console.error("Get cart context error:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const items = cart?.items || [];

  const cartCount = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        items,
        cartCount,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider");
  }

  return context;
}
