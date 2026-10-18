"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "noir_wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setWishlist(parsed.filter((item) => typeof item === "string"));
        }
      }
    } catch (error) {
      console.error("Could not load wishlist:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Could not save wishlist:", error);
    }
  }, [wishlist, loaded]);

  const isFavorite = useCallback(
    (productId) => wishlist.includes(String(productId)),
    [wishlist]
  );

  const toggleFavorite = useCallback((productId) => {
    const id = String(productId);

    setWishlist((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }, []);

  const removeFavorite = useCallback((productId) => {
    const id = String(productId);

    setWishlist((previous) => previous.filter((item) => item !== id));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loaded,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
