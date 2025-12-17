import { cn } from "@/utils/cn";
import { FC } from "react";
import { ButtonFieldProps } from "./type";

const LoadingSpinner: FC = () => (
  <span className="w-4 h-4 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin" />
);

export const ButtonField: FC<ButtonFieldProps> = ({
  type = "primary",
  htmlType = "button",
  size = "large",
  block = true,
  loading = false,
  disabled = false,
  icon,
  onClick,
  children,
  className,
}) => {
  const colorClasses = {
    primary: "bg-pink-600 hover:bg-pink-700 text-white border-pink-600",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white border-red-600",
    text: "bg-transparent hover:bg-gray-100 text-pink-600 border-transparent",
  }[type];

  const sizeClasses = {
    small: "px-3 py-1 text-sm gap-1",
    middle: "px-4 py-2 text-base gap-2",
    large: "px-6 py-2.5 text-lg font-semibold gap-2",
  }[size];

  const blockClasses = block ? "w-full" : "inline-flex";
  const disabledClasses =
    disabled || loading
      ? "opacity-60 cursor-not-allowed pointer-events-none"
      : "shadow-md transition-colors";

  return (
    <button
      type={htmlType}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer",
        colorClasses,
        sizeClasses,
        blockClasses,
        disabledClasses,
        className
      )}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}

      {children}
    </button>
  );
};
