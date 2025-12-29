"use client";

import { ToastProvider } from "@/hooks/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JSX, ReactNode } from "react";
import { Header } from "@/layouts/header/_pages";
import { Footer } from "@/layouts/footer/";
import "./globals.css";
import { usePathname } from "next/navigation";

interface ITemplateProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const ConditionalLayout: React.FC<ITemplateProps> = ({ children }) => {
  const pathname = usePathname();
  const EXCLUDED_PATHS = ["/login", "/register", "/forgot-password", "/account/verify", "/shop/login", "/shop/register", "/employee/login", "/employee/register"];
  const isAuthPage = EXCLUDED_PATHS.includes(pathname);

  
  return (
    <>
      {!isAuthPage && <Header />}
      <main className="grow">
        <div className="relative">{children}</div>
      </main>
      {!isAuthPage && <Footer />}
      <ToastProvider />
    </>
  );
};

const RootLayout = ({ children }: ITemplateProps): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConditionalLayout>{children}</ConditionalLayout>
    </QueryClientProvider>
  );
};

export default RootLayout;
