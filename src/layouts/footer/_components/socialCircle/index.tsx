"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";

export const SocialCircle = ({ icon: Icon }: { icon: any }) => (
  <Link
    href="#"
    className={cn(
      "w-9 h-9 flex items-center justify-center bg-white rounded-full border border-gray-200",
      " text-gray-600 hover:bg-(--color-mainColor) hover:text-white hover:border-(--color-mainColor) transition-all duration-300 shadow-sm"
    )}
  >
    <Icon size={16} />
  </Link>
);
