import React from "react";

interface Variant {
  sku?: string;
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  optionValueNames?: string[];
}

interface ShippingTableProps {
  variants: Variant[];
  optionNames: string[];
  onUpdateVariant: (index: number, field: keyof Variant, value: any) => void;
}

const ShippingTable: React.FC<ShippingTableProps> = ({ variants, optionNames, onUpdateVariant }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full border-collapse bg-white text-left text-sm">
        <thead>
          <tr className="bg-gradient-to-br from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <th className="px-4 py-3 font-semibold text-gray-500 text-center w-12">#</th>
            {optionNames.length > 0 ? (
              optionNames.map((name, idx) => (
                <th key={idx} className="px-4 py-3 font-semibold text-gray-700 min-w-[110px]">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">{name}</span>
                </th>
              ))
            ) : (
              <th className="px-4 py-3 font-semibold text-gray-700">SKU</th>
            )}
            <th className="px-4 py-3 font-semibold text-gray-700 min-w-[150px]">Cân nặng (g)</th>
            <th className="px-4 py-3 font-semibold text-gray-700 min-w-[280px]">Kích thước D x R x C (cm)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {variants.map((variant, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-3 text-center font-medium text-gray-400">{index + 1}</td>
              
              {/* Hiển thị tên phân loại hoặc SKU */}
              {optionNames.length > 0 ? (
                optionNames.map((_, optIdx) => (
                  <td key={optIdx} className="px-4 py-3 text-gray-600">
                    {variant.optionValueNames?.[optIdx] || "-"}
                  </td>
                ))
              ) : (
                <td className="px-4 py-3 text-gray-600">{variant.sku || "-"}</td>
              )}

              {/* Input Cân nặng */}
              <td className="px-4 py-3">
                <input
                  type="number"
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Gram"
                  value={variant.weightGrams ?? ""}
                  onChange={(e) => onUpdateVariant(index, "weightGrams", parseFloat(e.target.value))}
                />
              </td>

              {/* Input Kích thước */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-20 h-9 px-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center"
                    placeholder="D"
                    value={variant.lengthCm ?? ""}
                    onChange={(e) => onUpdateVariant(index, "lengthCm", parseFloat(e.target.value))}
                  />
                  <span className="text-gray-400">×</span>
                  <input
                    type="number"
                    className="w-20 h-9 px-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center"
                    placeholder="R"
                    value={variant.widthCm ?? ""}
                    onChange={(e) => onUpdateVariant(index, "widthCm", parseFloat(e.target.value))}
                  />
                  <span className="text-gray-400">×</span>
                  <input
                    type="number"
                    className="w-20 h-9 px-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center"
                    placeholder="C"
                    value={variant.heightCm ?? ""}
                    onChange={(e) => onUpdateVariant(index, "heightCm", parseFloat(e.target.value))}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShippingTable;