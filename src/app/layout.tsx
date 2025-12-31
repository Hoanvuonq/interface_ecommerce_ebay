import { SmoothScroll } from "@/features";
import NavigationProgress from "@/features/NavigationProgress";
import { ToastProvider } from "@/hooks/ToastProvider";
import ClientProviders from "@/providers/ClientProviders";
import "./employee-layout.css";
import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'] 
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`antialiased ${inter.className}`}>
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
