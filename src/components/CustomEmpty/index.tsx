import { Package } from "lucide-react";

export const CustomEmpty: React.FC<{ description?: string }> = ({
  description = "Không có dữ liệu",
}) => (
  <div className="flex flex-col items-center justify-center text-center py-10">
    <Package className="w-12 h-12 text-gray-300 mb-4" />
    <p className="text-gray-500">{description}</p>
  </div>
);