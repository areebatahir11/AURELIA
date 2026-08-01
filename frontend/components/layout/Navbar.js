"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, GitCompare, Search, User } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useAuthContext } from "@/context/AuthContext";
import { NAV_LINKS } from "@/constants/navigation";
import { navReveal } from "@/animations/variants";
import { SITE_CONFIG } from "@/config/site";
import Image from "next/image";

export default function Navbar() {
  const { isScrolled } = useScrollDirection();
  const { isAuthenticated } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function handleSearchSubmit(event) {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  }

  return (
    <motion.header
      initial="top"
      animate={isScrolled ? "scrolled" : "top"}
      variants={navReveal}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
    >
      <nav className="mx-auto flex h-15 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-removebg-preview.png"
            alt="Aurelia"
            width={34}
            height={34}
            priority
          />

          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-[0.18em] text-ivory">
              AURELIA
            </span>

            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-gold">
              Reserved for the Exceptional
            </span>
          </div>
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
          <button
            aria-label="Search"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="text-ivory transition-colors hover:text-gold"
          >
            {isSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <Link
            href="/compare"
            aria-label="Compare"
            className="text-ivory transition-colors hover:text-gold"
          >
            <GitCompare size={18} />
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="text-ivory transition-colors hover:text-gold"
          >
            <Heart size={18} />
          </Link>
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            aria-label={isAuthenticated ? "My account" : "Sign in"}
            className="text-ivory transition-colors hover:text-gold"
          >
            <User size={18} />
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

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-hairline bg-void px-6 py-5 lg:px-12"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-7xl items-center gap-4"
            >
              <Search size={18} className="text-graphite" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by brand, model, or keyword..."
                className="flex-1 bg-transparent font-body text-sm text-ivory placeholder:text-graphite focus:outline-none"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
