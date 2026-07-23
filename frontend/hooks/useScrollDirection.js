"use client";

import { useState, useEffect, useRef } from "react";

export function useScrollDirection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [direction, setDirection] = useState("up");
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 24);
      setDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isScrolled, direction };
}
