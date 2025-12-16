"use client";
import { ToastProvider } from "@/hooks/useToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JSX, ReactNode } from "react";
import { Header } from "@/layouts/header/_pages";
import "./globals.css";
import { Footer } from "@/layouts/footer";

interface ITemplateProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Template = ({ children }: ITemplateProps): JSX.Element => {
  return (
      <QueryClientProvider client={queryClient}>
          <Header />
          <div className="relative p-2">
            {children}
          </div>
          <Footer/>
        <ToastProvider />
      </QueryClientProvider>
  );
};

export default Template;