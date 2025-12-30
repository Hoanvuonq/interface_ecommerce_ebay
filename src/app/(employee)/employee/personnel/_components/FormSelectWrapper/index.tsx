import { SelectComponent } from "@/components/SelectComponent";
import { cn } from "@/utils/cn";
import { Controller } from "react-hook-form";

export const FormSelectWrapper = ({ label, name, control, errorMessage, ...props }: any) => (
  <div className="mb-6 flex flex-col gap-1.5">
    {label && (
      <label className="block text-sm font-bold text-black dark:text-gray-300">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SelectComponent 
          {...props} 
          value={field.value} 
          onChange={field.onChange}
          className={cn(props.className, errorMessage && "border-red-500")} 
        />
      )}
    />
    {errorMessage && (
      <p className="text-sm text-red-600 dark:text-red-400">
        {errorMessage}
      </p>
    )}
  </div>
);