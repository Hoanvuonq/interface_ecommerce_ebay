"use client";

import { LoginForm } from "@/app/(auth)/_components/LoginForm";
import LoginRoleGuard from "../../_components/LoginRoleGuard";
import { RoleEnum } from "@/auth/_types/auth";

export default function LoginScreen() {
  return (
    <LoginRoleGuard 
      allowedRoles={[RoleEnum.BUYER]} 
      loginType="buyer"
    >
      <LoginForm />
    </LoginRoleGuard>
  );
}