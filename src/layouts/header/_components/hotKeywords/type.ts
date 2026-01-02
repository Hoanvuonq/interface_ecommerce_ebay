export interface KeywordItem {
    keyword: string;
}

export interface HotKeywordsProps {
    keywords: KeywordItem[];
    onKeywordSelect: (keyword: string) => void;
}
