import React from "react";
import { cn } from "@/utils/cn";

interface CardComponentsProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  [key: string]: any;
}

export const CardComponents: React.FC<CardComponentsProps> = ({
  title,
  children,
  className,
  bodyClassName,
  ...rest
}) => {
  const baseClasses = cn(
    "bg-white rounded-xl shadow-lg border border-gray-100 transition-shadow duration-300",
    className
  );

  return (
    <div className={baseClasses} {...rest}>
      {title && (
        <div className="border-b border-gray-100 pt-3 pb-3 px-4 text-lg font-bold text-gray-800">
          {title}
        </div>
      )}

      <div
        className={cn(
          {
            "p-4": !title,
            "p-0": title,
          },
          bodyClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};
