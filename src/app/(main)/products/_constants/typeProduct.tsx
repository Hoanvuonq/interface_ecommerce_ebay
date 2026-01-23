import { Zap, ShieldCheck, Sparkles, Star } from "lucide-react";

export const TYPE_CONFIG: Record<
  string,
  { text: string; className: string; icon?: React.ReactNode }
> = {
  mall: {
    text: "Mall",
    className:
      "bg-linear-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-sm shadow-orange-200",
    icon: <ShieldCheck size={10} className="fill-white/20" />,
  },
  flashsale: {
    text: "Flash Sale",
    className:
      "bg-linear-to-r from-red-600 to-rose-600 text-white border-red-500 font-bold italic tracking-tighter animate-pulse shadow-sm shadow-red-200",
    icon: <Zap size={10} className="fill-current" />,
  },
  new: {
    text: "New",
    className:
      "bg-linear-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-sm shadow-orange-200",
    icon: <Sparkles size={10} />,
  },
  special: {
    text: "Đặc biệt",
    className:
      "bg-purple-50 text-purple-600 border-purple-200 font-bold shadow-sm shadow-purple-100",
    icon: <Star size={10} className="fill-purple-600" />,
  },
};
