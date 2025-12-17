import { cn } from "@/utils/cn";

export const TagComponents: React.FC<any> = ({ children, colorClass, className, icon: Icon, ...rest }) => (
    <span
        className={cn(
            "inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full shadow-sm",
            colorClass,
            className
        )}
        {...rest}
    >
        {Icon}
        {children}
    </span>
);
