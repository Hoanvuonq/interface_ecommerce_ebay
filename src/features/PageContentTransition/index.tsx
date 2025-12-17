"use client";

import { ReactNode } from "react";
import PageTransition from "../PageTransition";

interface PageContentTransitionProps {
    children: ReactNode;
}

/**
 * Component wrapper để thêm transition animation chỉ cho phần content
 * mà không ảnh hưởng đến Header/Footer
 */
export default function PageContentTransition({ children }: PageContentTransitionProps) {
    return <PageTransition>{children}</PageTransition>;
}

