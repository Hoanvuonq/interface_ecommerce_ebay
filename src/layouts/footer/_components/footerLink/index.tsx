"use client";

import { cn } from "@/utils/cn";
import Link from "next/link"; 
import { ArrowRight } from "lucide-react"; 
import { BaseProps } from "../../_types/footer"; 

interface FooterLinkProps extends BaseProps {
  href: string;
  children: React.ReactNode;
}

export const FooterLink = ({ href, children, className }: FooterLinkProps) => (
  <li className="w-fit">
    <Link
      href={href}
      className={cn(
        "group flex items-center text-white transition-colors duration-200",
        "hover:text-orange-400",
        className
      )}
    >
      <span className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100">
        <ArrowRight size={14} className="mr-2" />
      </span>
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        {children}
      </span>
    </Link>
  </li>
);