

"use client";
import { UniversalLoginForm } from "@/app/(auth)/_components/UniversalLoginForm";
import LoginRoleGuard from "../../_components/LoginRoleGuard";
import { RoleEnum } from "@/auth/_types/auth";

export default function EmployeeLoginScreen() {
  return (
    <LoginRoleGuard 
      allowedRoles={[RoleEnum.EMPLOYEE]} 
      loginType="employee"
    >
      <UniversalLoginForm mode="EMPLOYEE" />
    </LoginRoleGuard>
  );
}