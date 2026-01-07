"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
interface FloatingChatButtonsProps {
  isInGroup?: boolean;
}
export const ScrollToTop = ({ isInGroup = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)] transition-all duration-300 hover:bg-orange-600"
          aria-label="Scroll to top"
        >
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeDasharray="1"
              pathLength="1"
              className="opacity-20"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeDasharray="1"
              style={{ pathLength: scrollYProgress }}
              className="drop-shadow-sm"
            />
          </svg>

          <ArrowUp size={22} strokeWidth={3} className="relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};