import { ArrowLeft, ArrowRight } from "lucide-react";
import { CustomButton } from "../customButton";

export const CustomPagination: React.FC<{
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}> = ({ page, pageSize, total, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto">
      <CustomButton
        variant="outline"
        onClick={() => onChange(page - 1, pageSize)}
        disabled={page <= 1}
        className="h-10 w-10 p-0 rounded-xl"
        icon={<ArrowLeft size={18} />}
      />
      <div className="flex items-center gap-2 px-4">
        <span className="text-sm font-bold text-orange-600 bg-ortext-orange-50 px-3 py-1 rounded-lg">
          {page}
        </span>
        <span className="text-gray-600 text-sm">/</span>
        <span className="text-sm font-medium text-gray-600">{totalPages}</span>
      </div>
      <CustomButton
        variant="outline"
        onClick={() => onChange(page + 1, pageSize)}
        disabled={page >= totalPages}
        className="h-10 w-10 p-0 rounded-xl"
        icon={<ArrowRight size={18} />}
      />
    </div>
  );
};
