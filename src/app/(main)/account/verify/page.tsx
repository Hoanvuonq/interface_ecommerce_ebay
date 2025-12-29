"use client";

import { VerifyForm } from "@/app/(auth)/_components/VerifyForm";
import { Design } from "@/components";
import { Button } from "@/components/button/button";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { cn } from "@/utils/cn";

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const typeParam = searchParams.get("type");

  const accountType = typeParam === "shop" ? "shop" : "user";

  if (!email) {
    return (
      <div
        className={cn(
          "min-h-screen w-full relative overflow-hidden  flex items-center justify-center p-4",
          "bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        )}
      >
        <Design />

        <div
          className={cn(
            "w-full max-w-md relative z-10 text-center",
            "bg-white/80 dark:bg-slate-800/80 shadow-2xl",
            "border border-white/50 dark:border-slate-700/50",
            "p-8 rounded-4xl backdrop-blur-xl"
          )}
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-500 text-3xl animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Liên kết không hợp lệ
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Thiếu thông tin email để xác thực. Vui lòng kiểm tra lại đường dẫn
            hoặc đăng nhập lại.
          </p>

          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-gray-900 text-white hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl h-12 font-bold"
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return <VerifyForm email={email} type={accountType} mode="ACTIVATION" />;
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      }
    >
      <VerifyPageContent />
    </Suspense>
  );
}
