"use client";
import { UniversalLoginForm } from "@/app/(auth)/_components/UniversalLoginForm";
import LoginRoleGuard from "../../_components/LoginRoleGuard";
import { RoleEnum } from "@/auth/_types/auth";

export default function LoginScreen() {
  return (
    <LoginRoleGuard 
      allowedRoles={[RoleEnum.BUYER]} 
      loginType="buyer"
    >
      <UniversalLoginForm mode="BUYER" />
    </LoginRoleGuard>
  );
}