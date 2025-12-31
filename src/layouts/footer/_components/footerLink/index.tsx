"use client";

import { cn } from "@/utils/cn";
import Link from "next/link"; 
import { ArrowRight } from "lucide-react"; 
import { BaseProps } from "../../_types/footer"; 

interface FooterLinkProps extends BaseProps {
  href: string;
  children: React.ReactNode;
}

export const FooterLinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link
      href={href}
      className="text-white/90 hover:text-amber-400 hover:translate-x-1 transition-all duration-200 inline-block text-[12px] font-medium"
    >
      {children}
    </Link>
  </li>
);