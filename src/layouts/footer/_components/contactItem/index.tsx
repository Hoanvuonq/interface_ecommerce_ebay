import { cn } from "@/utils/cn";
import { BaseProps } from "../../_types/footer";

export const ContactItem = ({ icon: Icon, text, href, className }: BaseProps) => {
  const contentClass = cn(
    "flex items-start gap-3 group", 
    className
  );

  const iconWrapperClass = cn(
    "mt-1 p-2 rounded-lg bg-slate-900 transition-colors",
    "group-hover:bg-orange-600/10"
  );

  const textClass = cn(
    "text-white text-sm leading-relaxed transition-colors",
    "group-hover:text-white"
  );

  const InnerContent = () => (
    <div className={contentClass}>
      <div className={iconWrapperClass}>
        <Icon size={18} className="text-orange-500 group-hover:text-orange-400" />
      </div>
      <span className={textClass}>
        {text}
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block mb-4">
        <InnerContent />
      </a>
    );
  }
  return <div className="mb-4"><InnerContent /></div>;
};
