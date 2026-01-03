"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { usePresence } from "./useWebSocket";
import { WebSocketService } from "../_services";


export function useActivityTracking(enabled: boolean = true) {
  const { updatePresence } = usePresence();
  const wsRef = useRef<WebSocketService | null>(null);
  const [connected, setConnected] = useState(false);
  const lastUpdateRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get WebSocket service instance and check connection status
  useEffect(() => {
    wsRef.current = WebSocketService.getInstance();
    
    // Check connection status periodically
    const checkConnection = () => {
      if (wsRef.current) {
        setConnected(wsRef.current.isConnected() || false);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Debounce function
  const debounce = useCallback((func: () => void, delay: number) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(func, delay);
  }, []);

  // Update presence với debounce
  const updateActivity = useCallback(() => {
    if (!enabled || !connected) return;

    const now = Date.now();
    // Chỉ update nếu đã qua 5 giây từ lần update trước
    if (now - lastUpdateRef.current < 5000) {
      return;
    }

    debounce(() => {
      updatePresence("ONLINE");
      lastUpdateRef.current = Date.now();
    }, 1000); // Debounce 1 giây
  }, [enabled, connected, updatePresence, debounce]);

  useEffect(() => {
    if (!enabled || !connected) return;

    // Track mouse movement
    const handleMouseMove = () => updateActivity();
    
    // Track keyboard input
    const handleKeyPress = () => updateActivity();
    
    // Track scroll
    const handleScroll = () => updateActivity();
    
    // Track click
    const handleClick = () => updateActivity();
    
    // Track touch (mobile)
    const handleTouchStart = () => updateActivity();

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("keypress", handleKeyPress, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    // Initial update
    updateActivity();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keypress", handleKeyPress);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouchStart);
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [enabled, connected, updateActivity]);

  return {
    updateActivity,
  };
}

