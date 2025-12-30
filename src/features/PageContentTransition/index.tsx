"use client";

import { ReactNode } from "react";
import PageTransition from "../PageTransition";

interface PageContentTransitionProps {
    children: ReactNode;
}

export default function PageContentTransition({ children }: PageContentTransitionProps) {
    return <PageTransition>{children}</PageTransition>;
}

