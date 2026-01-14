"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { PAYMENT_METHODS } from "../../_types/checkout";

interface PaymentSectionProps {
  selectedMethod: string;
  onChange: (methodId: string) => void;
}

export const PaymentSection = ({ selectedMethod, onChange }: PaymentSectionProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50">
        <CreditCard className="text-gray-900" size={18} />
        <h2 className="text-sm font-bold uppercase  text-gray-900">
          Phương thức thanh toán
        </h2>
      </div>

      <div className="p-4 space-y-2">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onChange(method.id)}
              className={cn(
                "relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-gray-500 bg-orange-50/50"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "border-gray-500 bg-orange-500" : "border-gray-300"
                  )}
                >
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                <div className="flex flex-col">
                  <p className={cn(
                      "text-[13px] font-semibold  transition-colors",
                      isSelected ? "text-gray-700" : "text-gray-600"
                    )}
                  >
                    {method.label}
                  </p>
                  
                  <AnimatePresence>
                    {method.subLabel && isSelected && (
                      <motion.p 
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 4 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="text-[11px] font-medium text-gray-500 overflow-hidden"
                      >
                        {method.subLabel}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};