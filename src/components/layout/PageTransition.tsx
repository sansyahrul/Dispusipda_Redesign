"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();

  // Respect user's reduced motion setting
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : "initial"}
        animate={prefersReducedMotion ? { opacity: 1, y: 0 } : "animate"}
        exit={prefersReducedMotion ? { opacity: 1, y: 0 } : "exit"}
        variants={variants}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ minHeight: "100vh" }} // hindari layout jump
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
