import { AnimatePresence, motion } from "framer-motion";

export const SlotNumber = ({ value }: { value: string | number }) => (
  <div
    className="relative w-10 h-12 sm:w-8 sm:h-9 overflow-hidden flex items-center justify-center"
    
  >
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="absolute font-sans text-2xl sm:text-base font-bold text-white z-10"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);
