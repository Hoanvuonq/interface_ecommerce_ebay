"use client";
import React, { useRef, useState, useEffect } from "react";
import { ISearch } from "./type";
import { cn } from "@/utils/cn";
import { History, X, Search as SearchIcon, Trash2, Zap, TrendingUp } from "lucide-react";

export const Search: React.FC<ISearch> = ({
  searchValue = "",
  searchOptions = [],
  onChange,
  onSelect,
  onSubmit,
  placeholder = "Tìm kiếm sản phẩm...",
  className = "",
  ctaColor = "#ff8800",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLFormElement>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("search_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (value?: any) => {
    const term = String(value || searchValue || "").trim();
    if (!term) return;

    const newHistory = [term, ...history.filter((h) => h !== term)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("search_history", JSON.stringify(newHistory));
    
    setIsDropdownOpen(false);
    inputRef.current?.blur();
    
    // Gọi onSubmit
    onSubmit(term);
    
    // Fix: Gọi onSelect với đủ 2 đối số và kiểm tra undefined
    onSelect?.(term, { value: term });
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const newHistory = history.filter((h) => h !== item);
    setHistory(newHistory);
    localStorage.setItem("search_history", JSON.stringify(newHistory));
  };

  if (!mounted) return <div className={cn("h-12 bg-gray-100 rounded-xl animate-pulse", className)} />;

  const displayValue = typeof searchValue === 'string' ? searchValue : "";

  return (
    <form
      ref={dropdownRef}
      className={cn("flex items-center relative w-full group", className)}
      onSubmit={(e) => {
        e.preventDefault();
        handleSearchSubmit();
      }}
    >
      <div className="relative flex-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={(e) => {
            onChange?.(e.target.value); // Fix: Sử dụng optional chaining
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 pl-5 pr-4 outline-none border-2 transition-all duration-300 text-base font-medium",
            "bg-gray-50 border-transparent rounded-l-2xl",
            "focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5"
          )}
        />

        {isDropdownOpen && (history.length > 0 || (displayValue.length > 0 && searchOptions.length > 0)) && (
          <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl border border-gray-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-3 duration-300">
            
            {!displayValue && history.length > 0 && (
              <div className="p-2">
                <div className="px-4 py-2 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tìm kiếm gần đây</span>
                  <button 
                    type="button"
                    onClick={() => { setHistory([]); localStorage.removeItem("search_history"); }} 
                    className="p-1 hover:bg-rose-50 rounded-full text-rose-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSearchSubmit(item)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer rounded-2xl group/item transition-all"
                    >
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <History size={16} className="text-slate-300 group-hover/item:text-orange-500 transition-colors" />
                        {item}
                      </div>
                      <X size={14} onClick={(e) => removeHistoryItem(e, item)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {displayValue.length > 0 && searchOptions.length > 0 && (
              <div className="p-2">
                <div className="px-4 py-2 text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gray-50 mb-1">
                  <TrendingUp size={12} /> Từ khóa liên quan
                </div>
                {searchOptions.map((opt: any, idx: number) => {
                  const labelText = opt.item?.keyword || opt.value || "";
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        // Fix: Đảm bảo truyền đủ 2 đối số cho onSelect theo định nghĩa
                        onSelect?.(labelText, opt); 
                        setIsDropdownOpen(false);
                        handleSearchSubmit(labelText);
                      }}
                      className="flex items-center justify-between px-4 py-3 hover:bg-orange-50 cursor-pointer rounded-2xl group/opt transition-all"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                           <SearchIcon size={16} className="text-slate-300 group-hover/opt:text-orange-500" />
                           {labelText}
                        </div>
                        {opt.item?.searchCount > 0 && (
                          <span className="ml-7 text-[10px] text-slate-400 font-medium italic">
                            Hơn {opt.item.searchCount.toLocaleString()} lượt tìm kiếm
                          </span>
                        )}
                      </div>
                      <Zap size={14} className="text-yellow-400 opacity-0 group-hover/opt:opacity-100 transition-all" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="h-12 px-8 rounded-r-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-orange-500/20"
        style={{ backgroundColor: ctaColor }}
      >
        Tìm ngay
      </button>
    </form>
  );
};