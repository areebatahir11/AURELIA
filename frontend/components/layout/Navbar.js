"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Heart, GitCompare, Search } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { NAV_LINKS } from "@/constants/navigation";
import { navReveal } from "@/animations/variants";
import { SITE_CONFIG } from "@/config/site";

export default function Navbar() {
  const { isScrolled } = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      variants={navReveal}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <Link href="/" className="font-display text-2xl tracking-[0.2em] text-ivory">
          {SITE_CONFIG.name}
        </Link>

        <ul className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-body text-sm uppercase tracking-[0.12em] text-ivory/80 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <button aria-label="Search" className="text-ivory transition-colors hover:text-gold">
            <Search size={18} />
          </button>
          <Link href="/compare" aria-label="Compare" className="text-ivory transition-colors hover:text-gold">
            <GitCompare size={18} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="text-ivory transition-colors hover:text-gold">
            <Heart size={18} />
          </Link>
          <button
            aria-label="Toggle menu"
            className="text-ivory lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col gap-6 border-t border-hairline bg-void px-6 py-8 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-body text-lg uppercase tracking-wide text-ivory"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}