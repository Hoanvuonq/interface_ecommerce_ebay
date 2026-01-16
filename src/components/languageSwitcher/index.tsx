"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/utils/cn';

const locales = [
  { code: 'vi', label: 'Tiếng Việt', display: 'VI' },
  { code: 'en', label: 'English', display: 'EN' },
];

export const LanguageSwitcher = () => {
  const [currentLocale, setCurrentLocale] = useState('vi');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = locales.find(lang => lang.code === currentLocale);

  const setLocale = (locale: string) => {
    setCurrentLocale(locale);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div 
      className="relative text-xs rounded-full"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-gray-800 transition-colors focus:outline-none",
          "bg-white hover:bg-gray-50 shadow-custom cursor-pointer"
        )}
        aria-expanded={isOpen}
        aria-label={`Ngôn ngữ hiện tại: ${currentLang?.label}`}
      >
        <Globe size={16} />
        <span className="font-semibold">{currentLang?.display}</span>
        <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute right-0 top-full mt-1 w-28 bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden z-20",
            "before:content-[''] before:absolute before:top-2 before:right-3 before:w-0 before:h-0 before:border-x-8 before:border-x-transparent before:border-b-8 before:border-b-white"
          )}
        >
          {locales.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors",
                {
                  'font-bold text-red-500 bg-red-50/50': lang.code === currentLocale,
                  'hover:bg-gray-100': lang.code !== currentLocale,
                }
              )}
              aria-current={lang.code === currentLocale ? 'page' : undefined}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};