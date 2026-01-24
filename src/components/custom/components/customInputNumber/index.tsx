"use client";

import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";
import { IInputProps } from "../../../AddToCartButton/type";

export const CustomInputNumber: React.FC<IInputProps> = ({
  min = 1,
  max,
  value,
  onChange,
  disabled = false,
}) => {
  const { error: toastError } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    if (valStr === "") {
      onChange(null);
      return;
    }

    let numValue = parseInt(valStr);

    if (!isNaN(numValue)) {
      if (max !== undefined && numValue > max) {
        numValue = max;
        toastError(`Kho chỉ còn ${max} sản phẩm`, { duration: 2000 });
      }
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    if (value === null || value < min) {
      onChange(min);
    }
  };

  return (
    <div className="relative">
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ""}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={cn(
          "w-12 h-10 text-center font-bold  text-gray-800 bg-transparent focus:outline-none transition-all tabular-nums",
          disabled && " text-gray-400"
        )}
      />
      <style jsx>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};
