import { forwardRef } from "react";

interface TextAreaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, name, placeholder, error, maxLength, rows = 3, value, onChange, required }, ref) => {
    
    const currentLength = value?.length || 0;

    return (
      <div className="flex flex-col gap-1.5 w-full mb-4">
        <label 
          htmlFor={name} 
          className="text-sm font-medium text-gray-700 flex justify-between"
        >
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          
          {maxLength && (
            <span className={`text-xs ${currentLength > maxLength ? 'text-red-500' : 'text-gray-400'}`}>
              {currentLength}/{maxLength}
            </span>
          )}
        </label>

        <div className="relative">
          <textarea
            id={name}
            name={name}
            ref={ref}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            className={`
              w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-all
              placeholder:text-gray-400
              disabled:cursor-not-allowed disabled:bg-gray-50
              ${error 
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }
            `}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-500 mt-1 italic font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";