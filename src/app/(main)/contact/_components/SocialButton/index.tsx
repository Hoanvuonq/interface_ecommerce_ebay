"use client";
import { LucideIcon } from "lucide-react";

export const SocialButton = ({
  icon: Icon,
  hoverColor,
  href,
}: {
  icon: LucideIcon;
  hoverColor: string;
  href: string;
}) => (
  <a
    href={href}
    className={`flex items-center justify-center aspect-square rounded-2xl bg-white border border-gray-200 text-gray-600 shadow-sm transition-all duration-300 ${hoverColor} hover:text-white hover:-translate-y-1`}
  >
    <Icon size={20} />
  </a>
);
