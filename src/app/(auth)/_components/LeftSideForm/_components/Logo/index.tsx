"use client";
import { cn } from "@/utils/cn";

type LogoProps = {
  icon: React.ReactNode;
  gradientClass?: string;
  iconClassName?: string;
  titleClassName?: string;
};

export const Logo: React.FC<LogoProps> = ({
  icon,
  gradientClass = "bg-gradient-to-br from-blue-500 to-purple-600",
  iconClassName = "text-white text-3xl",
  titleClassName = "!mb-0 !text-5xl !text-gray-800 dark:!text-gray-100 font-bold bg-linear-to-rrom-blue-600 to-purple-600 bg-clip-text text-transparent",
}) => {
  return (
    <div className={cn("flex items-center gap-4 mb-8")}>
      <div
        className={cn(
          `w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`,
          `${gradientClass}`
        )}
      >
        <span className={iconClassName}>{icon}</span>
      </div>

      <h2 className={`${titleClassName}`}>EbayExpress</h2>
    </div>
  );
};
