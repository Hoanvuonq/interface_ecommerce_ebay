import { CampaignStatus } from "@/app/(shop)/shop/marketing/campaigns/_types/campaign.type";

// Hàm trả về Class CSS (Tailwind)
export const getStatusColor = (status: CampaignStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "SCHEDULED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DRAFT":
      return "bg-slate-50 text-slate-600 border-slate-200";
    case "ENDED":
      return "bg-gray-50 text-gray-500 border-gray-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getStatusLabel = (status: CampaignStatus) => {
  const labels: Record<CampaignStatus, string> = {
    ACTIVE: "Đang hoạt động",
    SCHEDULED: "Sắp diễn ra",
    DRAFT: "Bản nháp",
    ENDED: "Đã kết thúc",
    CANCELLED: "Đã hủy",
    PAUSED: "Tạm dừng",
  };
  return labels[status] || status;
};