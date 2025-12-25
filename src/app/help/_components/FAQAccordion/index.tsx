import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { FAQItem } from "../../_types/help";

export const FAQAccordion = ({ item }: { item: FAQItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-50 last:border-none">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-4 flex items-center justify-between text-left group">
        <span className={`text-sm font-bold transition-colors ${isOpen ? 'text-orange-600' : 'text-slate-700 group-hover:text-orange-500'}`}>
          {item.question}
        </span>
        {isOpen ? <ChevronUp size={18} className="text-orange-600" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <p className="text-xs text-slate-500 leading-relaxed font-light">{item.answer}</p>
      </div>
    </div>
  );
};
