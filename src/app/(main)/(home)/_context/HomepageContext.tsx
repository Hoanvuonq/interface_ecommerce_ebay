"use client";

import { createContext, ReactNode, useContext } from "react";
import { useHomepageData } from "../_hooks/useHomePageData";

type HomepageContextType = ReturnType<typeof useHomepageData>;

const HomepageContext = createContext<HomepageContextType | undefined>(undefined);

export const HomepageProvider = ({
  children,
  locale = "vi",
}: {
  children: ReactNode;
  locale?: string;
  device?: string;
}) => {
  const homepageData = useHomepageData(locale);

  return (
    <HomepageContext.Provider value={homepageData}>
      {children}
    </HomepageContext.Provider>
  );
};

export const useHomepageContext = () => {
  const context = useContext(HomepageContext);
  if (!context) {
    throw new Error("useHomepageContext must be used within HomepageProvider");
  }
  return context;
};