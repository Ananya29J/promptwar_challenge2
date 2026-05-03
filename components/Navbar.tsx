"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Menu, X, Zap } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/twin", label: "My Twin" },
  { href: "/simulator", label: "Simulator" },
  { href: "/scenarios", label: "What If?" },
  { href: "/flowmap", label: "Flow Map" },
  { href: "/candidates", label: "Candidates" },
];

/* Spinning Chakra in logo */
function MiniChakra() {
  return (
    <svg width="16" height="16" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="4" />
      <circle cx="50" cy="50" r="8" fill="white" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 360) / 24;
        const r = (a * Math.PI) / 180;
        return <line key={i} x1={50 + 8 * Math.cos(r)} y1={50 + 8 * Math.sin(r)} x2={50 + 42 * Math.cos(r)} y2={50 + 42 * Math.sin(r)} stroke="white" strokeWidth="2" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "72px",
          display: "flex", alignItems: "center",
          background: scrolled ? "rgba(255,255,255,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Tricolor bar at very top of navbar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", display: "flex" }} aria-hidden="true">
          <div style={{ flex: 1, background: "var(--saffron)", opacity: scrolled ? 0.8 : 0.4 }} />
          <div style={{ flex: 1, background: "rgba(255,255,255,0.3)", opacity: scrolled ? 0.8 : 0.4 }} />
          <div style={{ flex: 1, background: "var(--india-green)", opacity: scrolled ? 0.8 : 0.4 }} />
        </div>

        <div className="container-main" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {/* Logo */}
          <Link href="/" aria-label="VoteWise Home" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: 40, height: 40, borderRadius: "11px",
                background: "linear-gradient(135deg, var(--saffron) 0%, var(--saffron-dark) 50%, var(--india-green) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(255,153,51,0.3)",
              }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                <MiniChakra />
              </motion.div>
            </motion.div>
            <span style={{ fontFamily: "var(--font-outfit)", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)" }}>
              <span style={{ color: "var(--saffron)" }}>Vote</span>
              <span style={{ color: "var(--text)" }}>Wise</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }} className="desktop-nav" role="list">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="listitem"
                  aria-current={active ? "page" : undefined}
                  style={{
                    padding: "8px 14px", borderRadius: "8px", fontSize: "0.88rem",
                    fontWeight: active ? 700 : 400,
                    color: active ? "var(--saffron)" : "var(--text-muted)",
                    background: active ? "rgba(255,153,51,0.1)" : "transparent",
                    textDecoration: "none", transition: "all 0.2s ease", position: "relative",
                  }}
                >
                  {link.label}
                  {active && (
                    <motion.div layoutId="nav-active" style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", width: "18px", height: "2px", background: "var(--saffron)", borderRadius: "1px" }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/twin" className="btn-primary" style={{ padding: "9px 18px", fontSize: "0.83rem" }}>
              <Zap size={13} aria-hidden="true" />
              Get Started
            </Link>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="mobile-menu-btn"
              style={{ display: "none", background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", padding: "8px", color: "var(--text)", cursor: "none" }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ position: "fixed", top: "72px", left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.05)", padding: "12px 20px 20px" }}
          >
            {/* Tricolor bar */}
            <div style={{ height: "2px", display: "flex", marginBottom: "16px" }}>
              <div style={{ flex: 1, background: "var(--saffron)" }} />
              <div style={{ flex: 1, background: "rgba(255,255,255,0.4)" }} />
              <div style={{ flex: 1, background: "var(--india-green)" }} />
            </div>
            {NAV_LINKS.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  style={{ display: "block", padding: "13px 14px", borderRadius: "10px", color: pathname === link.href ? "var(--saffron)" : "var(--text)", background: pathname === link.href ? "rgba(255,153,51,0.08)" : "transparent", fontWeight: pathname === link.href ? 700 : 400, fontSize: "1rem", textDecoration: "none", marginBottom: "4px" }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width:768px) { .desktop-nav{display:none!important} .mobile-menu-btn{display:flex!important} }
      `}</style>
    </>
  );
}
