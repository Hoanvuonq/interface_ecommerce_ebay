"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import AppThemeProvider from "@/providers/AppThemeProvider";
import I18nProvider from "@/providers/I18nextProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import WelcomeNotificationFixed from "@/features/WelcomeNotificationFixed";
import TopLoadingBar from "@/features/TopLoadingBar";
import AuthRouteGuard from "@/features/AuthRouteGuard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <AppThemeProvider>
            <WebSocketProvider
              autoConnect={false}
              reconnectInterval={5000}
              maxReconnectAttempts={5}
            >
              <TopLoadingBar />
              <WelcomeNotificationFixed enabled={true} showOnce={true} delay={2000} />
              <AuthRouteGuard>{children}</AuthRouteGuard>
            </WebSocketProvider>
          </AppThemeProvider>
        </I18nProvider>
      </QueryClientProvider>
    </Provider>
  );
}