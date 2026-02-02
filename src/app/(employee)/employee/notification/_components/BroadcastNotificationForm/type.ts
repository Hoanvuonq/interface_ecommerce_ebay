import {
  BroadcastAudience,
  NotificationPriority,
  NotificationType,
} from "@/layouts/header/_service/notification.service";

export interface BroadcastFormData {
  targetAudience: BroadcastAudience;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  redirectUrl?: string;
}
