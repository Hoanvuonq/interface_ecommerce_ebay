import { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { SmoothScroll } from "@/features";
import NavigationProgress from "@/features/NavigationProgress";
import ClientProviders from "@/providers/ClientProviders";

export const metadata: Metadata = {
  title: {
    default: "Calatha - Hệ thống thương mại điện tử",
    template: "Calatha - %s",
  },
  description: "Hệ thống thương mại điện tử Calatha ...",
};

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ scrollBehavior: "smooth" }}
    >
      <body className={` antialiased`} suppressHydrationWarning>
        <NavigationProgress/>
        <SmoothScroll />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
};

export default RootLayout;