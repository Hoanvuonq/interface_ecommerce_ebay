import { CampaignStatus } from "@/app/(shop)/shop/marketing/campaigns/_types/campaign.type";
import { CampaignResponse } from "../../_types/types";

export interface CampaignListTableProps {
  data: CampaignResponse[];
  loading: boolean;
  statusFilter: CampaignStatus | "ALL";
  onStatusFilterChange: (status: CampaignStatus | "ALL") => void;
  onQuickCreate: () => void;
  onViewStats: (campaign: CampaignResponse) => void;
  onSchedule: (id: string) => void;
  onCancel: (id: string) => void;
  onAddSlot: (id: string) => void;
  totalElements: number;
  onDelete?: (id: string) => void;
  page: number;
  size: number;
  onPageChange: (newPage: number) => void;
}