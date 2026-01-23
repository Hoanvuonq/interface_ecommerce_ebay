"use client";

import { SettingCard } from "../../SettingCardAddress";
import { SectionLoading } from "@/components";
import { useShopSettings } from "../../../_hooks/useShopSettings";

export const ShippingChanel = () => {
  const { shippingChannels, isLoading, toggleShipping, isUpdating } =
    useShopSettings();

  if (isLoading) {
    return <SectionLoading message="Đang tải cấu hình vận chuyển..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {shippingChannels.map((channel) => (
        <SettingCard
          key={channel.id}
          title={channel.channelName}
          desc={channel.estimatedDelivery}
          isActive={channel.enabled}
          isLoading={isUpdating}
          onToggle={() => toggleShipping(channel.channelCode)}
          // Truyền dummy edit để giữ style nhưng không thực hiện logic edit phức tạp
          showEditButton={false}
        />
      ))}

      {shippingChannels.length === 0 && (
        <div className="p-10 text-center text-slate-400 italic bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          Không tìm thấy kênh vận chuyển nào khả dụng.
        </div>
      )}
    </div>
  );
};
