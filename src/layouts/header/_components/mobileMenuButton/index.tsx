"use client";

import { Menu } from 'lucide-react';

interface MobileMenuButtonProps {
    onOpen: () => void;
}

export const MobileMenuButton = ({ onOpen }: MobileMenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="p-2 text-white hover:bg-white/10 transition-colors rounded-full lg:hidden"
      aria-label="Mở Menu Mobile"
    >
      <Menu size={24} />
    </button>
  );
};