"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserId } from "@/utils/jwt";

interface WelcomeNotificationProps {
  enabled?: boolean;
  delay?: number;
  showOnce?: boolean;
}

export function WelcomeNotificationFixed({
  enabled = true,
  delay = 2000,
  showOnce = true,
}: WelcomeNotificationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !enabled) return;

    const userId = getUserId();
    if (!userId) return;

    const storageKey = "welcome_notification_shown_for_" + userId;

    if (showOnce) {
      const hasShown = localStorage.getItem(storageKey);
      if (hasShown) return;
    }

    const timer = setTimeout(() => {
      toast.success("Chào mừng bạn!", {
        description: `Xin chào! Chúc bạn có trải nghiệm mua sắm vui vẻ.`,
        duration: 5000,
      });

      if (showOnce) {
        localStorage.setItem(storageKey, "true");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [mounted, enabled, delay, showOnce]);

  return null;
}

export default WelcomeNotificationFixed;
