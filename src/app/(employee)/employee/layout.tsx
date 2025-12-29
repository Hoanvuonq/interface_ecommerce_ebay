import { Metadata } from "next";
import { ReactNode } from "react";
import { BaseEmployeeLayout } from "./_layouts";

export const metadata: Metadata = {
  title: "Employee Workspace | Calatha",
};

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  return (
    <BaseEmployeeLayout>
        {children}
    </BaseEmployeeLayout>
  );
}