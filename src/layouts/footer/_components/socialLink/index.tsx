import { cn } from "@/utils/cn";
import { BaseProps } from "../../_types/footer";

export const SocialLink = ({
  href,
  icon: Icon,
  label,
  className,
}: BaseProps) => (
  <a
    href={href}
    aria-label={label}
    className={cn(
      "w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white transition-all duration-300",
      "hover:bg-orange-600 hover:text-white hover:-translate-y-1",
      className
    )}
  >
    <Icon size={18} />
  </a>
);
