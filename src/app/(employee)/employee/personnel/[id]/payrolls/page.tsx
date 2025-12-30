"use client";

import { use } from "react";
import PayrollList from "../../_components/PayrollList";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    name?: string;
  }>;
}

export default function EmployeePayrollPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);

  const employeeId = resolvedParams.id;
  const employeeName = resolvedSearchParams.name || "Nhân viên";

  return <PayrollList employeeId={employeeId} employeeName={employeeName} />;
}
