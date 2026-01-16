"use client";

import React, { useMemo, useRef, useCallback } from "react";
import { DataTable } from "@/components";
import { ProductVariantsTableProps, Variant } from "./type";
import { useProductVariantsColumns } from "./columns";
import { Column } from "@/components/DataTable/type";

export const ProductVariantsTable: React.FC<ProductVariantsTableProps> = ({
  variants,
  optionNames,
  onUpdateVariants,
  onUploadImage,
}) => {
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleInputChange = useCallback(
    (index: number, field: keyof Variant, value: any) => {
      const newVariants = [...variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      onUpdateVariants(newVariants);
    },
    [variants, onUpdateVariants]
  );

  const handleBulkUpdate = useCallback(
    (field: keyof Variant, value: any) => {
      const newVariants = variants.map((v) => ({ ...v, [field]: value }));
      onUpdateVariants(newVariants);
    },
    [variants, onUpdateVariants]
  );

  const groupMetadata = useMemo(() => {
    const firstOptionMap = new Map<string, boolean>();
    return variants.map((v) => {
      const firstVal = v.optionValueNames?.[0] || "Default";
      if (!firstOptionMap.has(firstVal)) {
        firstOptionMap.set(firstVal, true);
        return { isFirst: true, label: firstVal };
      }
      return { isFirst: false, label: firstVal };
    });
  }, [variants]);

  const columns: Column<Variant>[] = useProductVariantsColumns(
    variants,
    optionNames,
    groupMetadata,
    fileInputRefs,
    handleInputChange,
    handleBulkUpdate,
    onUploadImage
  );

  return (
    <DataTable
      data={variants}
      columns={columns}
      loading={false}
      page={0}
      size={variants.length}
      totalElements={variants.length}
      onPageChange={() => {}}
      rowKey={(item: Variant) =>
        `v-${item.sku}-${item.optionValueNames?.join("-")}`
      }
      emptyMessage="Vui lòng thiết lập phân loại để tạo biến thể"
    />
  );
};
