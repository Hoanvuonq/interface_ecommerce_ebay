"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CartBadge,
  MobileMenuButton,
  NotificationDropdown,
  TopHeader,
  HotKeywords,
} from "../_components";
import { Search, MobileMenuDrawer } from "@/components";
import { useProductSearch } from "@/hooks/useProductSearch";
import { isAuthenticated } from "@/utils/local.storage";
import {
  searchService,
  SuggestionItemDTO,
} from "@/services/search/search.service";
import { AccountDropdown } from "../_components/accountDropdown";

export const Header = () => {
  const isLoggedIn = !!isAuthenticated();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hotKeywords, setHotKeywords] = useState<SuggestionItemDTO[]>([]);
  const hasFetchedHotKeywords = useRef(false);
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
    if (hasFetchedHotKeywords.current) return;
    (async () => {
      try {
        hasFetchedHotKeywords.current = true;

        const res = await searchService.getHot({ limit: 5 });
        setHotKeywords(res.suggestions || []);
      } catch (error) {
        console.error("Failed to load hot keywords:", error);
        setHotKeywords([]);
      }
    })();
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}
    >
      <div className="hidden md:block">
        <TopHeader />
      </div>

      <div className="backdrop-blur-md bg-opacity-95 background-main-gradient">
        <div className="container mx-auto px-3 sm:px-4 lg:px-30">
          <div className="flex flex-col md:flex-row items-center justify-between py-3 md:h-18 h-auto gap-3">
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center gap-3">
                <div className="md:hidden block">
                  <MobileMenuButton onOpen={() => setIsMenuOpen(true)} />
                </div>

                <Link href="/" className="flex items-center shrink-0">
                  <Image
                    src="/icon/final.svg"
                    alt="CaLaTha Logo"
                    width={160}
                    height={60}
                    className="object-contain w-28 h-auto md:w-40 md:h-12"
                    priority
                  />
                </Link>
              </div>

              <div className="flex md:hidden items-center gap-3">
                <CartBadge />
                <AccountDropdown />
              </div>
            </div>

            <div className="flex-1 w-full md:max-w-2xl md:mx-6">
              <div className="relative z-10">
                <Search
                  searchValue={searchValue}
                  searchOptions={searchOptions}
                  onChange={handleSearchChange}
                  onSelect={(_, option: any) => handleSuggestionSelect(option)}
                  onSubmit={handleSearchSubmit}
                />
              </div>

              {/* <div className="hidden md:block mt-1">
                 <HotKeywords 
                    keywords={hotKeywords} 
                    onKeywordSelect={handleHotKeywordSelect} 
                 /> 
              </div> */}
            </div>

            <div className="hidden md:flex items-center space-x-3 lg:space-x-5 shrink-0">
              {isLoggedIn && <NotificationDropdown />}
              <CartBadge />
              <AccountDropdown />
            </div>
          </div>
        </div>
      </div>

      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};
