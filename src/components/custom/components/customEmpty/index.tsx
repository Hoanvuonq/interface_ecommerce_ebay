import { Package } from "lucide-react";

export const CustomEmpty: React.FC<{ description?: string }> = ({
  description = "Không có dữ liệu",
}) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-gray-50/50 rounded-4xl border border-dashed border-gray-200/60">
    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-gray-100">
      <Package className="w-8 h-8 text-gray-400 stroke-[1.5]" />
    </div>
    <p className="text-gray-500 font-medium text-sm tracking-tight">
      {description}
    </p>
  </div>
);
