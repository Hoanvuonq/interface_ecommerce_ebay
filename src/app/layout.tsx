import { SmoothScroll } from "@/features";
import NavigationProgress from "@/features/NavigationProgress";
import { ToastProvider } from "@/hooks/ToastProvider";
import ClientProviders from "@/providers/ClientProviders";
import "./employee-layout.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <NavigationProgress />
        <SmoothScroll />
        <ClientProviders>
            {children}
            <ToastProvider /> 
        </ClientProviders>
      </body>
    </html>
  );
}