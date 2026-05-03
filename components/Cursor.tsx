"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const followerX = useSpring(mouseX, { stiffness: 80, damping: 18, mass: 0.8 });
  const followerY = useSpring(mouseY, { stiffness: 80, damping: 18, mass: 0.8 });
  const dotX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const dotY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Glow ring — tricolor border */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed", left: followerX, top: followerY, zIndex: 9999,
          width: 38, height: 38, borderRadius: "50%",
          border: "1.5px solid rgba(255,153,51,0.5)",
          background: "rgba(255,153,51,0.04)",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          backdropFilter: "blur(2px)",
        }}
      />
      {/* Precise dot — saffron */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed", left: dotX, top: dotY, zIndex: 10000,
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--saffron)",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 6px rgba(255,153,51,0.8)",
        }}
      />
    </>
  );
}
