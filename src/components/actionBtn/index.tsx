import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

export const ActionBtn = ({ onClick, icon, color, label, loading, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className={cn(
      "flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
      label 
        ? "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-md" 
        : "p-2 rounded-xl border border-gray-100 shadow-sm",
      color || "bg-white text-gray-600 hover:bg-gray-50"
    )}
  >
    {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
    {label && <span>{label}</span>}
  </button>
);