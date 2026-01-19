import { CampaignResponse } from "../_types/campaign.type";

export const getDisplayStatus = (campaign: CampaignResponse) => {
  const now = new Date();
  const start = new Date(campaign.startDate);
  const end = new Date(campaign.endDate);

  if (campaign.status === "PAUSED") {
    return { label: "Tạm dừng", color: "bg-amber-100 text-amber-700" };
  }
  if (now < start) {
    return { label: "Sắp diễn ra", color: "bg-blue-100 text-blue-700" };
  }
  if (now > end) {
    return { label: "Đã kết thúc", color: "bg-gray-100 text-gray-500" };
  }
  return { label: "Đang diễn ra", color: "bg-green-100 text-green-700" };
};
