import { LucideIcon } from "lucide-react";

export interface ContactValue {
  phone: string;
  email: string;
}

export interface ContactItemProps {
  title: string;
  value: ContactValue;
  icon: LucideIcon;
  colorClass?: string;
  iconColor?: string;
}