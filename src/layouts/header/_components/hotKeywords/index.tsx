"use client";

import { cn } from "@/utils/cn";

interface KeywordItem {
    keyword: string;
}

interface HotKeywordsProps {
    keywords: KeywordItem[];
    onKeywordSelect: (keyword: string) => void;
}

export const HotKeywords = ({ keywords, onKeywordSelect }: HotKeywordsProps) => {
    const displayKeywords = keywords.slice(0, 7);
    if (displayKeywords.length === 0) {
        return null;
    }

    return (
        <div className="hidden lg:flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pb-3 -mt-1 text-white">
            {displayKeywords.map((item, index) => (
                <span
                    key={index}
                    onClick={() => onKeywordSelect(item.keyword)}
                    className={cn(
                        "cursor-pointer font-medium max-w-60 truncate transition-colors",
                        "text-[11px] sm:text-xs",
                        "text-white/85 hover:text-white hover:underline"
                    )}
                    title={item.keyword}
                >
                    {item.keyword}
                </span>
            ))}
        </div>
    );
};