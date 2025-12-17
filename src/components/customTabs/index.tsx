import { cn } from "@/utils/cn";

export const CustomTabs: React.FC<any> = ({ activeKey, onChange, items, className }) => {
    return (
        <div className={cn("border-b border-gray-200", className)}>
            <div className="flex flex-wrap -mb-px">
                {items.map((item: any) => (
                    <button
                        key={item.key}
                        onClick={() => onChange(item.key)}
                        className={cn(
                            "py-2 px-4 text-base font-semibold border-b-2 transition-colors duration-200",
                            "focus:outline-none",
                            item.key === activeKey
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};