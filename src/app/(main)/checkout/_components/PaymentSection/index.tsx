"use client";

import React from 'react';
import { CreditCard, CheckCircle2 } from "lucide-react";
import { PAYMENT_METHODS } from "../../_types/checkout";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
interface PaymentSectionProps {
  selectedMethod: string;
  onChange: (methodId: string) => void;
}

export const PaymentSection = ({ selectedMethod, onChange }: PaymentSectionProps) => {
  return (
    <div className="space-y-3">
      {PAYMENT_METHODS.map((method) => {
        const isSelected = selectedMethod === method.id;
        
        return (
          <div
            key={method.id}
            onClick={() => onChange(method.id)}
            className={cn(
              "relative flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group",
              isSelected 
                ? "border-orange-500 bg-orange-50/30 shadow-sm ring-1 ring-orange-500/20" 
                : "border-slate-100 bg-white hover:border-orange-200"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                isSelected ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-white"
              )}>
                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>

              <div>
                <p className={cn(
                  "text-sm font-black uppercase tracking-tight transition-colors",
                  isSelected ? "text-slate-900" : "text-slate-600"
                )}>
                  {method.label}
                </p>
                {method.subLabel && (
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {method.subLabel}
                  </p>
                )}
              </div>
            </div>

            {isSelected && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-orange-500"
              >
                <CheckCircle2 size={20} strokeWidth={3} />
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};