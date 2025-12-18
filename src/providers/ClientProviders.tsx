"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import AppThemeProvider from "@/providers/AppThemeProvider";
import I18nProvider from "@/providers/I18nextProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import WelcomeNotificationFixed from "@/features/WelcomeNotificationFixed";
import TopLoadingBar from "@/features/TopLoadingBar";
import AuthRouteGuard from "@/features/AuthRouteGuard";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}
