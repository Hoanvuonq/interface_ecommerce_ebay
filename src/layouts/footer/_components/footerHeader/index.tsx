import { cn } from "@/utils/cn";
import { BaseProps } from "../../_types/footer";

export const FooterHeader = ({
  children,
  className,
}: BaseProps & { children: React.ReactNode }) => (
  <h4
    className={cn(
      "text-white font-bold text-lg mb-6 relative inline-block",
      className
    )}
  >
    {children}
    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600 rounded-full"/>
  </h4>
);
