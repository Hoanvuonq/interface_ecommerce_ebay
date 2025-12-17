"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

// ✅ Optimized: Faster, lighter animation
const pageVariants = {
    initial: {
        opacity: 0,
        y: 10, // Reduced from 20 to 10 for faster animation
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -5, // Reduced from -20 to -5
    },
};

const pageTransition = {
    type: "tween" as const,
    ease: "easeOut" as const, 
    duration: 0.2, 
};

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    // ✅ Memoize to prevent unnecessary re-renders
    const motionKey = useMemo(() => pathname, [pathname]);

    return (
        // ✅ Changed mode from "wait" to "popLayout" for faster rendering
        // "popLayout" allows new page to render immediately while old page exits
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
                key={motionKey}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
                style={{
                    width: "100%",
                    height: "100%",
                    willChange: "opacity, transform", // ✅ Optimize for GPU acceleration
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

