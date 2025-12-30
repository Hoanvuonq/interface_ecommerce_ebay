"use client";

import { motion, AnimatePresence, MotionConfig } from "framer-motion"; 
import { usePathname } from "next/navigation";
import { ReactNode, createContext, useContext, useRef } from "react";

const FrozenRouteContext = createContext<ReactNode | null>(null);

function FrozenRoute({ children }: { children: ReactNode }) {
  const context = useContext(FrozenRouteContext);
  const frozen = useRef(children);

  if (!context) {
    frozen.current = children;
  }

  return (
    <FrozenRouteContext.Provider value={frozen.current}>
      {frozen.current}
    </FrozenRouteContext.Provider>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <MotionConfig transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="w-full h-full"
          style={{ willChange: "opacity, transform" }}
        >
          <FrozenRoute>{children}</FrozenRoute>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}