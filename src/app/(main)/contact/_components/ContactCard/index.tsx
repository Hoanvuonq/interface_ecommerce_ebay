"use client";
import { LucideIcon } from "lucide-react";

export const ContactCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 rounded-4xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group">
    <div className="mb-4 p-3 w-fit rounded-2xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <h4 className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
      {title}
    </h4>
    <div className="text-slate-700 font-bold leading-relaxed">{children}</div>
  </div>
);
