"use client";

import { UniversalLoginForm } from "@/app/(auth)/_components/UniversalLoginForm"; 
import LoginRoleGuard from "@/app/(auth)/_components/LoginRoleGuard"; 
import { RoleEnum } from "@/auth/_types/auth";

export default function ShopLoginScreen() {
  return (
    <LoginRoleGuard 
      allowedRoles={[RoleEnum.SHOP]} 
      loginType="shop"
    >
      <UniversalLoginForm mode="SHOP" />
    </LoginRoleGuard>
  );
}