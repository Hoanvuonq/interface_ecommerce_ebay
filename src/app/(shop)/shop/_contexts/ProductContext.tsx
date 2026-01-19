"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CreateUserProductBulkDTO } from "@/types/product/user-product.dto";

interface ProductContextType {
  formData: Partial<CreateUserProductBulkDTO>;
  setFormData: (data: Partial<CreateUserProductBulkDTO>) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  mediaModal: { type: "image" | "video"; file: any } | null;
  setMediaModal: (modal: { type: "image" | "video"; file: any } | null) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<Partial<CreateUserProductBulkDTO>>({
    name: "",
    description: "",
    basePrice: 0,
    categoryId: "",
    active: false,
    variants: [],
    media: [],
    options: [],
    saveAsDraft: false,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [mediaModal, setMediaModal] = useState<{
    type: "image" | "video";
    file: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const value: ProductContextType = {
    formData,
    setFormData,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    mediaModal,
    setMediaModal,
    loading,
    setLoading,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error(
      "useProductContext must be used within a ProductProvider"
    );
  }
  return context;
};
