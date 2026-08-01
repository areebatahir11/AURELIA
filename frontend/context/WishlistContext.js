"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const WishlistContext = createContext(undefined);
const STORAGE_KEY = "aurelia_wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  const addToWishlist = useCallback((vehicleId) => {
    setWishlist((prev) =>
      prev.includes(vehicleId) ? prev : [...prev, vehicleId],
    );
  }, []);

  const removeFromWishlist = useCallback((vehicleId) => {
    setWishlist((prev) => prev.filter((id) => id !== vehicleId));
  }, []);

  const toggleWishlist = useCallback((vehicleId) => {
    setWishlist((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId],
    );
  }, []);

  const isWishlisted = useCallback(
    (vehicleId) => wishlist.includes(vehicleId),
    [wishlist],
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error(
      "useWishlistContext must be used within a WishlistProvider",
    );
  }
  return context;
}
