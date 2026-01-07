import { cn } from "@/utils/cn";

export const ActionBtn = ({ onClick, icon, color }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "p-2.5 bg-white text-gray-600 rounded-xl shadow-sm border border-gray-100 transition-all hover:scale-110 active:scale-90",
      color
    )}
  >
    {icon}
  </button>
);
