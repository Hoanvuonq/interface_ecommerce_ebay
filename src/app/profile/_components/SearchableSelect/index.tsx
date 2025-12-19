import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

export const SearchableSelect = ({ 
    options, 
    value, 
    onChange, 
    placeholder, 
    disabled = false 
}: { 
    options: { value: string; label: string }[]; 
    value: string; 
    onChange: (val: string) => void; 
    placeholder: string;
    disabled?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(opt => opt.value === value)?.label || "";
    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if(isOpen) setSearch("");
    }, [isOpen]);

    return (
        <div className="relative" ref={wrapperRef}>
            <div 
                className={cn(
                    "w-full h-12 px-4 border border-gray-300 rounded-xl bg-white text-gray-900 flex items-center justify-between cursor-pointer transition-all",
                    disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "hover:border-orange-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-100",
                    isOpen && !disabled ? "border-orange-500 ring-4 ring-orange-100" : ""
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={cn("text-sm font-medium truncate", !selectedLabel && "text-gray-400")}>
                    {selectedLabel || placeholder}
                </span>
                <FaChevronDown className="text-xs text-gray-400" />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col animate-scale-up">
                    <div className="p-2 border-b border-gray-50 sticky top-0 bg-white">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input 
                                autoFocus
                                type="text" 
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-100 rounded-lg focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                                placeholder="Tìm kiếm..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={cn(
                                        "px-4 py-2.5 text-sm cursor-pointer hover:bg-orange-50 transition-colors font-medium",
                                        opt.value === value ? "bg-orange-50 text-orange-700" : "text-gray-700"
                                    )}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-400">Không tìm thấy kết quả</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};