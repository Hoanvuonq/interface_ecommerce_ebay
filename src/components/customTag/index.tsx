import { cn } from "@/utils/cn";
import React from "react";

export const CustomTag: React.FC<any> = ({
  icon: Icon,
  color,
  children,
  className,
  ...rest
}) => {
  const safeColor: string = color || "gray";

  const colorClasses: string =
    (
      {
        blue: "bg-blue-100 text-blue-800 border-blue-300",
        red: "bg-red-100 text-red-800 border-red-300",
        green: "bg-green-100 text-green-800 border-green-300",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
        purple: "bg-purple-100 text-purple-800 border-purple-300",
        gray: "bg-gray-100 text-gray-800 border-gray-300",
      } as Record<string, string>
    )[safeColor] || "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs sm:text-sm font-bold py-1 px-2 rounded-lg border cursor-default",
        colorClasses,
        className
      )}
      {...rest}
    >
      {Icon && React.cloneElement(Icon, { className: "w-3 h-3" })}
      {children}
    </span>
  );
};