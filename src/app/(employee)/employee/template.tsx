"use client";

import { ToastProvider } from "@/hooks/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, JSX } from "react";
import { BaseEmployeeLayout } from "./_layouts";

interface IEmployeeTemplateProps {
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

const EmployeeTemplate = ({ children }: IEmployeeTemplateProps): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <BaseEmployeeLayout>
        {children}
      </BaseEmployeeLayout>
      <ToastProvider />
    </QueryClientProvider>
  );
};

export default EmployeeTemplate;