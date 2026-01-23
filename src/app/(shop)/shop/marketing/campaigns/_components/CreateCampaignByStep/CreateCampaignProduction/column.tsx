import { Column } from "@/components/DataTable/type";
import { Checkbox, FormInput } from "@/components";

export const getProductSelectionColumns = (
  selectedVariants: any,
  setSelectedVariants: React.Dispatch<React.SetStateAction<any>>,
): Column<any>[] => [
  {
    header: "Chọn",
    align: "center",
    className: "w-[60px]",
    render: (variant: any) => (
      <Checkbox
        checked={!!selectedVariants[variant.id]?.selected}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setSelectedVariants((prev: any) => ({
            ...prev,
            [variant.id]: {
              ...prev[variant.id],
              selected: isChecked,
              // Mặc định giảm 10% khi chọn lần đầu
              salePrice:
                prev[variant.id]?.salePrice || Math.round(variant.price * 0.9),
              stockLimit: prev[variant.id]?.stockLimit || 10,
              discountPercent: prev[variant.id]?.discountPercent || 10,
            },
          }));
        }}
      />
    ),
  },
  {
    header: "Sản phẩm & SKU",
    className: "min-w-[220px]",
    render: (variant: any) => (
      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-bold text-slate-700 line-clamp-2 uppercase leading-snug">
          {variant.productName}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded">
            SKU: {variant.sku}
          </span>
          {variant.optionName && (
            <span className="text-[9px] text-orange-500 font-bold uppercase tracking-tighter bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
              {variant.optionName}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "Giá gốc",
    align: "right",
    className: "w-[120px]",
    render: (variant: any) => (
      <span className="text-xs font-bold text-slate-400 line-through decoration-slate-300">
        {variant.price.toLocaleString()}đ
      </span>
    ),
  },
  {
    header: "% Giảm",
    align: "center",
    className: "w-[150px]",
    render: (variant: any) => {
      const isSelected = !!selectedVariants[variant.id]?.selected;
      return (
        <div className="px-2">
          <FormInput
            type="number"
            disabled={!isSelected}
            className="h-8 text-center font-bold text-red-500 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            value={selectedVariants[variant.id]?.discountPercent ?? ""}
            onChange={(e) => {
              const pct = e.target.value === "" ? "" : parseInt(e.target.value);
              const newPrice =
                pct !== ""
                  ? Math.round(variant.price * (1 - (pct as number) / 100))
                  : "";
              setSelectedVariants((prev: any) => ({
                ...prev,
                [variant.id]: {
                  ...prev[variant.id],
                  discountPercent: pct,
                  salePrice: newPrice,
                },
              }));
            }}
          />
        </div>
      );
    },
  },
  {
    header: "Giá khuyến mãi",
    align: "center",
    className: "w-[320px]",
    render: (variant: any) => {
      const isSelected = !!selectedVariants[variant.id]?.selected;
      const rawValue = selectedVariants[variant.id]?.salePrice;
      const displayValue =
        rawValue !== undefined ? Number(rawValue).toLocaleString("vi-VN") : "";

      return (
        <div className="px-2 text-center">
          <FormInput
            type="text"
            inputMode="numeric"
            disabled={!isSelected}
            className="h-8 text-center font-bold text-orange-600 bg-white border-orange-200 shadow-sm focus:ring-2 focus:ring-orange-500/20"
            value={displayValue}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^\d]/g, "");
              const val = numericValue === "" ? "" : parseInt(numericValue);
              const newPct =
                val !== ""
                  ? Math.round(
                      ((variant.price - (val as number)) / variant.price) * 100,
                    )
                  : "";
              setSelectedVariants((prev: any) => ({
                ...prev,
                [variant.id]: {
                  ...prev[variant.id],
                  salePrice: val,
                  discountPercent: newPct,
                },
              }));
            }}
            placeholder="Nhập giá"
          />
        </div>
      );
    },
  },
  {
    header: "Số lượng sale",
    align: "center",
    className: "w-[120px]",
    render: (variant: any) => (
      <div className="px-2">
        <FormInput
          type="number"
          disabled={!selectedVariants[variant.id]?.selected}
          className="h-8 text-center font-bold text-slate-600 bg-white border-slate-200"
          value={selectedVariants[variant.id]?.stockLimit ?? ""}
          onChange={(e) => {
            const val = e.target.value === "" ? "" : parseInt(e.target.value);
            setSelectedVariants((prev: any) => ({
              ...prev,
              [variant.id]: { ...prev[variant.id], stockLimit: val },
            }));
          }}
        />
      </div>
    ),
  },
];
