// src/app/(shop)/shop/_components/Products/ShippingTable/index.tsx
"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components";
import { VariantData } from "../../../_stores/product.store";
import { getShippingColumns } from "./columns";

interface ShippingTableProps {
  variants: VariantData[];
  optionNames: string[];
  onUpdateVariant: (
    index: number,
    field: keyof VariantData,
    value: any,
  ) => void;
}

export const ShippingTable: React.FC<ShippingTableProps> = ({
  variants,
  optionNames,
  onUpdateVariant,
}) => {
  const columns = useMemo(
    () => getShippingColumns(optionNames, onUpdateVariant),
    [optionNames, onUpdateVariant],
  );

  return (
    <div className="space-y-4">
      <DataTable<VariantData>
        data={variants}
        columns={columns}
        loading={false}
        rowKey={(item, index) => item.sku || `v-${index}`}
        emptyMessage="Vui lòng thiết lập phân loại hàng trước"
        page={0}
        size={variants.length}
        totalElements={variants.length}
        onPageChange={() => {}}
      />
    </div>
  );
};
