import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import React from "react";

export const CustomButton: React.FC<any> = ({ children, onClick, type = 'default', loading, className, disabled, htmlType = 'button', icon: Icon, ...rest }) => {
    const baseClasses = "cursor-pointer flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    let colorClasses = "";
    if (type === 'primary') {
        colorClasses = "bg-linear-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-md border-0";
    } else if (type === 'dashed') {
        colorClasses = "bg-white text-gray-700 border-dashed border-gray-300 hover:border-pink-400 hover:text-pink-600";
    } else {
        colorClasses = "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900";
    }

    return (
        <button
            type={htmlType}
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(baseClasses, colorClasses, className)}
            {...rest}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-0" />
            ) : Icon ? (
                React.cloneElement(Icon, { className: cn(Icon.props.className, 'mr-1') })
            ) : null}
            {children}
        </button>
    );
};
