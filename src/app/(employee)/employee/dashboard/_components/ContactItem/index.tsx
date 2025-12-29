import { cn } from "@/utils/cn";
import { Mail, Phone } from "lucide-react";

export const ContactItem = ({ icon: Icon, title, value, colorClass }: any) => (
  <div className={cn("p-4 rounded-xl border transition-colors", colorClass)}>
    <h4 className="font-bold text-slate-800 mb-2 text-xs uppercase tracking-wide flex items-center gap-2">
      {title}
    </h4>
    <div className="space-y-1.5">
      <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
        <Phone className="w-3.5 h-3.5 opacity-70" />
        <span>{value.phone}</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
        <Mail className="w-3.5 h-3.5 opacity-70" />
        <span>{value.email}</span>
      </div>
    </div>
  </div>
);
