"use client";

import React, { createContext, useContext, useState } from "react";

interface ProductFormContextType {
  categoryModalOpen: boolean;
  setCategoryModalOpen: (open: boolean) => void;

  addOptionModalOpen: boolean;
  setAddOptionModalOpen: (open: boolean) => void;
}

const ProductFormContext = createContext<ProductFormContextType | null>(null);
export const ProductFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [addOptionModalOpen, setAddOptionModalOpen] = useState(false);

  return (
    <ProductFormContext.Provider
      value={{
        categoryModalOpen,
        setCategoryModalOpen,
        addOptionModalOpen,
        setAddOptionModalOpen,
      }}
    >
      {children}
    </ProductFormContext.Provider>
  );
};

export const useProductForm = () => {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error(
      "useProductForm phải được sử dụng bên trong ProductFormProvider"
    );
  }
  return context;
};
