"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CartBadge,
  MobileMenuButton,
  NotificationDropdown,
  TopHeader,
  HotKeywords, 
} from "../_components";
import Image from "next/image";
import { Search } from "@/components";
import { useProductSearch } from "@/hooks/useProductSearch";
import { UserAuthDropdown } from "../_components";
import { MobileMenuDrawer } from "@/components";
import { isAuthenticated } from "@/utils/local.storage";
import {
  searchService,
  SuggestionItemDTO,
} from "@/services/search/search.service";

const PRIMARY_COLOR = "var(--color-primary)";

export const Header = () => {
  const isLoggedIn = !!isAuthenticated();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hotKeywords, setHotKeywords] = useState<SuggestionItemDTO[]>([]);

  const {
    searchValue,
    searchOptions,
    handleSearchChange,
    handleSuggestionSelect,
    handleSearchSubmit,
  } = useProductSearch();

  const handleHotKeywordSelect = (keyword: string) => {
    handleSearchChange(keyword);
    handleSearchSubmit(keyword);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await searchService.getHot({ limit: 7 });
        setHotKeywords(res.suggestions || []);
      } catch (error) {
        console.error("Failed to load hot keywords:", error);
        setHotKeywords([]);
      }
    })();
  }, [handleSearchSubmit, handleSearchChange]);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}
    >
      <TopHeader />

      <div className="backdrop-blur" style={{ backgroundColor: PRIMARY_COLOR }}>
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 py-3">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center h-16">
                <Image
                  src="/icon/final.svg"
                  alt="CaLaTha Logo"
                  width={160}
                  height={60}
                  className="h-full w-auto object-contain"
                  style={{ maxHeight: "60px",  }}
                  priority
                />
              </Link>
            </div>

            <div className="flex-1 max-w-200 mx-8">
              <Search
                searchValue={searchValue}
                searchOptions={searchOptions}
                onChange={handleSearchChange}
                onSelect={(_, option: any) => handleSuggestionSelect(option)}
                onSubmit={handleSearchSubmit}
              />
            </div>
            <div className="flex items-center space-x-4">
              <MobileMenuButton onOpen={() => setIsMenuOpen(true)} />
              {isLoggedIn && <NotificationDropdown />}
              <CartBadge />
              <UserAuthDropdown isAuthenticated={isLoggedIn} />
            </div>
          </div>
          {/* <HotKeywords
            keywords={hotKeywords}
            onKeywordSelect={handleHotKeywordSelect}
          /> */}
        </div>
      </div>

      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};
