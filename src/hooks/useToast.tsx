"use client";
import { toast } from "sonner";
import React from "react";
type ToastType = "success" | "error";

const getToastStyles = (type: ToastType) => {
  const base =
    "flex items-center gap-3 px-5 py-3 rounded-[0.5vw] shadow-lg backdrop-blur-md font-semibold";
  const variants = {
    success: "border border-green-400 bg-green-400/20 text-green-100",
    error: "border border-red-500 bg-red-500/20 text-red-100",
  };
  return `${base} ${variants[type]}`;
};

export const useToast = () => {
  const showToast = (message: string, type: ToastType) => {
    toast.dismiss();
    toast.custom(
      () => (
        <div className={getToastStyles(type)}>
          <span>{message}</span>
        </div>
      ),
      { duration: 1000 }
    );
  };

  return {
    success: (msg: string) => showToast(msg, "success"),
    error: (msg: string) => showToast(msg, "error"),
  };
};