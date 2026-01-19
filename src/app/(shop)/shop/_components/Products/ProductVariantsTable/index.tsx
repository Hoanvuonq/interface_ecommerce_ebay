"use client";

import React, { useMemo, useRef, useCallback, useState } from "react";
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
  
  const [selectedBulkFields, setSelectedBulkFields] = useState<string[]>([]);

  const onToggleBulkField = useCallback((field: string) => {
    setSelectedBulkFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  }, []);

  const handleInputChange = useCallback(
    (index: number, field: keyof Variant, value: any) => {
      const newVariants = [...variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      onUpdateVariants(newVariants);
    },
    [variants, onUpdateVariants],
  );

  const handleBulkUpdate = useCallback(
    (field: keyof Variant | 'BULK_UPDATE', value: any) => {
      console.log(`handleBulkUpdate called for ${field} with value:`, value);
      
      if (field === 'BULK_UPDATE') {
        // Handle bulk update with multiple fields
        const updates = value as { [key: string]: any };
        const newVariants = variants.map((variant) => {
          const updatedVariant = { ...variant };
          Object.keys(updates).forEach((updateField) => {
            updatedVariant[updateField as keyof Variant] = updates[updateField];
          });
          return updatedVariant;
        });
        onUpdateVariants(newVariants);
      } else {
        // Handle single field update
        const newVariants = variants.map((v) => ({ ...v, [field]: value }));
        onUpdateVariants(newVariants);
      }
    },
    [variants, onUpdateVariants],
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
    onUploadImage,
    selectedBulkFields,
    onToggleBulkField
  );

  return (
    <div className="space-y-4">
      <DataTable
        data={variants}
        columns={columns}
        loading={false}
        page={0}
        size={variants.length}
        totalElements={variants.length}
        onPageChange={() => {}}
        rowKey={(_, index) => `v-row-${index}`}
        emptyMessage="Vui lòng thiết lập phân loại để tạo biến thể"
      />
    </div>
  );
};