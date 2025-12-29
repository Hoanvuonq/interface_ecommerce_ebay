import React from "react";
import { cn } from "@/utils/cn";
import { Phone, Mail, ExternalLink, LucideIcon } from "lucide-react";

interface ContactValue {
  phone: string;
  email: string;
}

interface ContactItemProps {
  title: string;
  value: ContactValue;
  icon: LucideIcon; 
  colorClass?: string;
}

export const ContactItem: React.FC<ContactItemProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass 
}) => {
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all duration-300 group hover:shadow-md hover:-translate-y-1",
      colorClass
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-orange-100 transition-all">
            <Icon size={18} className="text-slate-600 group-hover:text-orange-500" />
          </div>
          <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            {title}
          </span>
        </div>
        <ExternalLink size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-1.5 ml-1">
        <div className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors cursor-pointer group/item">
          <Phone size={12} className="opacity-50 group-hover/item:opacity-100" />
          <span className="text-xs font-black">{value.phone}</span>
        </div>
        
        <div className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors cursor-pointer group/item">
          <Mail size={12} className="opacity-50 group-hover/item:opacity-100" />
          <span className="text-[11px] font-medium italic truncate">{value.email}</span>
        </div>
      </div>
    </div>
  );
};