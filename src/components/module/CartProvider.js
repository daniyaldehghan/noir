"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { data: session, status } = useSession();

  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const userId = session?.user?.id || null;

  const refreshCart = useCallback(async () => {
    if (status === "loading") return;

    setLoaded(false);
    setError("");

    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "سبد خرید دریافت نشد.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setItems([]);
      setError(err.message || "خطا در دریافت سبد خرید.");
    } finally {
      setLoaded(true);
    }
  }, [status]);

  // Reload the cart whenever the authentication state or user changes.
  useEffect(() => {
    if (status === "loading") {
      setLoaded(false);
      return;
    }

    setItems([]);
    refreshCart();
  }, [status, userId, refreshCart]);

  const addToCart = async (product, quantity = 1) => {
    try {
      setError("");

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id || product.id || product.slug,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "افزودن محصول ناموفق بود.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
      return true;
    } catch (err) {
      setError(err.message || "خطا در افزودن محصول.");
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setError("");

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        throw new Error("تعداد باید بین ۱ تا ۲۰ باشد.");
      }

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "تغییر تعداد ناموفق بود.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
      return true;
    } catch (err) {
      setError(err.message || "خطا در تغییر تعداد.");
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError("");

      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حذف محصول ناموفق بود.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
      return true;
    } catch (err) {
      setError(err.message || "خطا در حذف محصول.");
      return false;
    }
  };

  const clearCart = async () => {
    try {
      setError("");

      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "پاک کردن سبد خرید ناموفق بود.");
      }

      setItems([]);
      return true;
    } catch (err) {
      setError(err.message || "خطا در پاک کردن سبد خرید.");
      return false;
    }
  };

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loaded,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        setItems,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}