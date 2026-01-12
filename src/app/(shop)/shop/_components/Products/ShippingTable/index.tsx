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

export const ShippingTable: React.FC<ShippingTableProps> = ({ variants, optionNames, onUpdateVariant }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-orange-200 shadow-lg">
      <table className="w-full border-collapse bg-white text-left text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200">
            <th className="px-4 py-4 font-semibold text-gray-600 text-center w-12">#</th>
            {optionNames.length > 0 ? (
              optionNames.map((name, idx) => (
                <th key={idx} className="px-4 py-4 font-semibold text-gray-700 min-w-[110px]">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium">
                    {name}
                  </span>
                </th>
              ))
            ) : (
              <th className="px-4 py-4 font-semibold text-gray-700">
                <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  SKU
                </span>
              </th>
            )}
            <th className="px-4 py-4 font-semibold text-gray-700 min-w-[150px]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Cân nặng (g)
              </span>
            </th>
            <th className="px-4 py-4 font-semibold text-gray-700 min-w-[300px]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Kích thước D × R × C (cm)
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-100">
          {variants.map((variant, index) => (
            <tr key={index} className={`transition-colors hover:bg-orange-25 ${
              index % 2 === 0 ? "bg-white" : "bg-orange-25/30"
            }`}>
              <td className="px-4 py-4 text-center">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                  {index + 1}
                </span>
              </td>
              
              {/* Hiển thị tên phân loại hoặc SKU */}
              {optionNames.length > 0 ? (
                optionNames.map((_, optIdx) => (
                  <td key={optIdx} className="px-4 py-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
                      {variant.optionValueNames?.[optIdx] || "-"}
                    </span>
                  </td>
                ))
              ) : (
                <td className="px-4 py-4">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
                    {variant.sku || "-"}
                  </span>
                </td>
              )}

              {/* Input Cân nặng */}
              <td className="px-4 py-4">
                <div className="relative">
                  <input
                    type="number"
                    className="w-full h-10 pl-3 pr-8 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                    placeholder="0"
                    value={variant.weightGrams ?? ""}
                    onChange={(e) => onUpdateVariant(index, "weightGrams", parseFloat(e.target.value) || 0)}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-600 text-xs font-medium">
                    g
                  </span>
                </div>
              </td>

              {/* Input Kích thước */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      className="w-20 h-10 px-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-center transition-all bg-white"
                      placeholder="0"
                      value={variant.lengthCm ?? ""}
                      onChange={(e) => onUpdateVariant(index, "lengthCm", parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 font-medium">
                      D
                    </span>
                  </div>
                  <span className="text-orange-500 font-bold">×</span>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-20 h-10 px-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-center transition-all bg-white"
                      placeholder="0"
                      value={variant.widthCm ?? ""}
                      onChange={(e) => onUpdateVariant(index, "widthCm", parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 font-medium">
                      R
                    </span>
                  </div>
                  <span className="text-orange-500 font-bold">×</span>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-20 h-10 px-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-center transition-all bg-white"
                      placeholder="0"
                      value={variant.heightCm ?? ""}
                      onChange={(e) => onUpdateVariant(index, "heightCm", parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 font-medium">
                      C
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">cm</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
