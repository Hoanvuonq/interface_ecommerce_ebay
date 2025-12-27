import { useEffect, useRef, useState } from "react";

interface UseVerifyFormProps {
  email: string;
  mode: "REGISTRATION" | "ACTIVATION";
  onSendInitialOtp: () => Promise<void>;
}

export const useVerifyForm = ({ email, mode, onSendInitialOtp }: UseVerifyFormProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSentInitialOtp = useRef(false);

  useEffect(() => {
    if (mode === "ACTIVATION" && !hasSentInitialOtp.current && email) {
      hasSentInitialOtp.current = true;
      onSendInitialOtp().then(() => {
        setCountdown(60);
      });
    }
  }, [mode, email, onSendInitialOtp]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Input Handlers
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);
    if (element.value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) newOtp[i] = pastedData[i];
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const resetOtp = () => {
    setOtp(new Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  const resetCountdown = () => setCountdown(60);

  return {
    otp,
    countdown,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    resetOtp,
    resetCountdown
  };
};