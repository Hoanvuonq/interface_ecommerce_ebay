"use client";

import React from "react";
import { LayoutGrid, Tags, Info, ShoppingBag, ShoppingCart } from "lucide-react";
import { CustomTabs, TabItem } from "../CustomTabs"; 

interface ProductFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode; 
}

export const ProductFormTabs: React.FC<ProductFormTabsProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => {
  const tabItems: TabItem[] = [
    {
      key: "basic",
      label: "Cơ bản",
      icon: <LayoutGrid size={18} />,
    },
    {
      key: "details",
      label: "Chi tiết",
      icon: <Tags size={18} />,
      disabled: true, 
    },
    {
      key: "description",
      label: "Mô tả",
      icon: <Info size={18} />,
    },
    {
      key: "sales",
      label: "Bán hàng",
      icon: <ShoppingBag size={18} />,
    },
    {
      key: "shipping",
      label: "Vận chuyển",
      icon: <ShoppingCart size={18} />,
      disabled: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      <CustomTabs
        items={tabItems}
        activeKey={activeTab}
        onChange={setActiveTab}
        className="px-2 pt-2 bg-gray-50/50 border-b border-gray-100"
      />
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};