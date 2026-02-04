import { FormInput } from "@/components";
import { cn } from "@/utils/cn";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tableInputClass =
  "h-9 rounded-xl px-3 text-[11px] font-bold bg-white border-gray-300 focus:border-orange-500 shadow-none transition-all";

export const SkuHeader = ({
  title,
  field,
  bulkValues,
  setBulkValues,
  selectedBulkFields,
  onToggleBulkField,
  variants,
}: any) => {
  const [isAdvanced, setIsAdvanced] = useState(false);

  useEffect(() => {
    if (variants && variants.length > 0) {
      const firstSku = variants.find((v: any) => v.sku)?.sku || "";
      if (firstSku.includes("-")) {
        const firstDashIndex = firstSku.indexOf("-");
        const detectedPrefix = firstSku.substring(0, firstDashIndex);
        const suffixPart = firstSku.substring(firstDashIndex + 1);
        
      

        setBulkValues((prev: any) => ({
          ...prev,
          [`${field}_prefix`]: prev[`${field}_prefix`] || detectedPrefix,
          [`${field}_suffix`]: prev[`${field}_suffix`] || suffixPart,
          [field]: prev[field] || firstSku,
        }));
      }
    }
  }, [variants]);

  return (
    <div className="flex flex-col items-center w-full px-2 gap-1.5 py-1">
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-gray-800 text-[11px] font-bold uppercase tracking-tight">
          {title}
        </span>

        <div
          className="flex items-center gap-1.5 cursor-pointer group"
          onClick={() => setIsAdvanced(!isAdvanced)}
        >
          <span
            className={cn(
              "text-[10px] font-bold uppercase transition-colors",
              isAdvanced ? "text-orange-600" : "text-gray-500",
            )}
          >
            {isAdvanced ? "Đơn" : "Cặp"}
          </span>
          <div
            className={cn(
              "relative w-9 h-5 rounded-full transition-all duration-300 border-2",
              isAdvanced
                ? "bg-orange-500 border-orange-500"
                : "bg-gray-400 border-gray-400",
            )}
          >
            <motion.div
              animate={{ x: isAdvanced ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {!isAdvanced ? (
            <motion.div
              key="pair"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1 w-full"
            >
              <div className="flex-[1.2] min-w-0">
                <FormInput
                  placeholder="Mã SKU"
                  isCheckbox={true}
                  checkboxChecked={selectedBulkFields.includes(field)}
                  onCheckboxChange={() => onToggleBulkField(field)}
                  value={bulkValues[`${field}_prefix`] || ""}
                  onChange={(e) => {
                    const newPrefix = e.target.value.toUpperCase();
                    
                    const currentSuffix = bulkValues[`${field}_suffix`] || "";
                    const newSku = currentSuffix ? `${newPrefix}-${currentSuffix}` : newPrefix;
                  
                    setBulkValues((prev: any) => ({
                      ...prev,
                      [`${field}_prefix`]: newPrefix,
                      [field]: newSku,
                    }));
                  }}
                  className={cn(
                    tableInputClass,
                    "w-full pr-10 text-center uppercase border-gray-100",
                    selectedBulkFields.includes(field) &&
                      "border-orange-500 ring-2 ring-orange-500/10",
                  )}
                />
              </div>

              <span className="text-orange-400 font-bold shrink-0">-</span>

              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 w-full",
                    "h-9", // Phải khớp với h-9 của tableInputClass
                  )}
                >
                  <span className="text-[10px] text-gray-500 font-bold uppercase whitespace-nowrap px-1">
                    GIỮ ĐUÔI
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="single"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="w-full"
            >
              <FormInput
                placeholder="Nhập mã SKU chung..."
                isCheckbox={true}
                checkboxChecked={selectedBulkFields.includes(field)}
                onCheckboxChange={() => onToggleBulkField(field)}
                value={bulkValues[field] || ""}
                onChange={(e) =>
                  setBulkValues((prev: any) => ({
                    ...prev,
                    [field]: e.target.value.toUpperCase(),
                  }))
                }
                className={cn(
                  tableInputClass,
                  "w-full pr-10",
                  selectedBulkFields.includes(field) &&
                    "border-orange-500 ring-2 ring-orange-500/10",
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
