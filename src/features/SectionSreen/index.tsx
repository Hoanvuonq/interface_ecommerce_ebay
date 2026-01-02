"use client";

import ScrollReveal from "@/features/ScrollReveal";
import { cn } from "@/utils/cn";

interface ISectionSreen {
  backgroundColor?: string;
  id?: string;
  children?: React.ReactNode;
  isWhite?: boolean;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scaleUp";
}

export const SectionSreen = ({
  backgroundColor,
  id,
  children,
  isWhite = false,
  animation,
}: ISectionSreen) => {
  const getBackgroundClass = () => {
    if (backgroundColor) return backgroundColor;

    if (isWhite) return "bg-white";

    return "bg-linear-to-br from-(--color-gradient-1) via-white to-(--color-gradient-2)";
  };

  return (
    <section className="py-1.5 transition-colors" id={id}>
      <ScrollReveal animation={animation} delay={200}>
        <div
          className={cn(
            "max-w-7xl relative overflow-hidden rounded-2xl shadow-md py-4 mx-auto px-4 transition-colors duration-300",
            getBackgroundClass()
          )}
        >
          {children}
        </div>
      </ScrollReveal>
    </section>
  );
};
