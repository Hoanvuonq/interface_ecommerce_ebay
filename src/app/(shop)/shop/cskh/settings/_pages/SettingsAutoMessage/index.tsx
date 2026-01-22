"use client";

import { Info, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { SettingCard } from "../../_components";
import { useUpdateShopSettings, useGetShopSettings } from "@/app/(chat)/_hooks";
import {
  ShopChatSettingsResponse,
  UpdateShopChatSettingsRequest,
} from "@/app/(chat)/_types/chat.dto";
import { useToast } from "@/hooks/useToast";

interface ShopChatSettingsProps {
  onSave?: () => void;
}

export const SettingsAutoMessage = ({ onSave }: ShopChatSettingsProps) => {
  const { success: toastSuccess, error: toastError } = useToast();

  const [activeStandard, setActiveStandard] = useState(false);
  const [textStandard, setTextStandard] = useState("");
  const [editingStandard, setEditingStandard] = useState(false);

  const [activeOffTime, setActiveOffTime] = useState(false);
  const [textOffTime, setTextOffTime] = useState("");
  const [editingOffTime, setEditingOffTime] = useState(false);

  const [workingConfig, setWorkingConfig] = useState({
    start: "",
    end: "",
    days: [] as string[],
  });

  const { handleGetShopSettings, loading: loadingSettings } =
    useGetShopSettings();
  const { handleUpdateShopSettings, loading: saving } = useUpdateShopSettings();

  const loadSettings = useCallback(async () => {
    const res = await handleGetShopSettings();
    if (res?.success && res?.data) {
      const data: ShopChatSettingsResponse = res.data;
      setActiveStandard(data.isAutoReplyEnabled);
      setTextStandard(data.welcomeMessage || "");

      setActiveOffTime(data.isOfflineMessageEnabled);
      setTextOffTime(data.offlineMessage || "");

      setWorkingConfig({
        start: data.businessHoursStart || "08:00",
        end: data.businessHoursEnd || "18:00",
        days: data.workingDays ? data.workingDays.split(",") : [],
      });
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (
    type: "STANDARD" | "OFFTIME",
    newText: string,
    newConfig?: any,
  ) => {
    try {
      const payload: UpdateShopChatSettingsRequest = {
        isAutoReplyEnabled: activeStandard,
        welcomeMessage: type === "STANDARD" ? newText : textStandard,

        isOfflineMessageEnabled: activeOffTime,
        offlineMessage: type === "OFFTIME" ? newText : textOffTime,

        businessHoursStart: newConfig?.start || workingConfig.start,
        businessHoursEnd: newConfig?.end || workingConfig.end,
        workingDays: newConfig?.days?.join(",") || workingConfig.days.join(","),
      };

      const res = await handleUpdateShopSettings(payload);
      if (res?.success) {
        onSave?.();
        toastSuccess("Cập nhật tin nhắn thành công");
        if (type === "STANDARD") {
          setEditingStandard(false);
          setTextStandard(newText);
        } else {
          setEditingOffTime(false);
          setTextOffTime(newText);
          if (newConfig) setWorkingConfig(newConfig);
        }
      }
    } catch (error: any) {
      toastError(error?.message || "Lỗi cập nhật hệ thống");
    }
  };

  if (loadingSettings) {
    return (
      <div className="h-60 flex flex-col items-center justify-center gap-3 text-orange-500 font-bold uppercase text-[10px] tracking-widest">
        <Loader2 className="animate-spin" size={32} />
        Đang đồng bộ dữ liệu...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-4xl p-6 flex items-start gap-5 shadow-xl shadow-gray-200/40 relative overflow-hidden group border border-orange-50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-125" />
        <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200 shrink-0 relative z-10">
          <Info size={22} />
        </div>
        <div className="space-y-2 relative z-10">
          <p className="text-xs font-bold uppercase text-slate-800 tracking-wider italic">
            Giao thức phản hồi tự động
          </p>
          <ul className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed space-y-1.5 tracking-tight">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-orange-400 rounded-full" />
              Tin nhắn tiêu chuẩn giúp giữ chân khách hàng khi nhân viên chưa
              kịp online.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-orange-400 rounded-full" />
              Tin nhắn ngoài giờ dựa trên cấu hình "Giờ làm việc" bên dưới của
              Shop.
            </li>
          </ul>
        </div>
      </div>

      <SettingCard
        title="Tin nhắn tự động tiêu chuẩn"
        desc="Gửi lời chào ngay khi khách hàng bắt đầu cuộc hội thoại."
        isActive={activeStandard}
        onToggle={async () => {
          const newState = !activeStandard;
          setActiveStandard(newState);
          await handleUpdateShopSettings({ isAutoReplyEnabled: newState });
        }}
        isEditing={editingStandard}
        onEdit={() => setEditingStandard(!editingStandard)}
        value={textStandard}
        onSave={(val: string) => handleSaveSettings("STANDARD", val)}
        isLoading={saving}
        placeholder="Chào mừng bạn đến với shop! Chúng tôi sẽ phản hồi bạn trong giây lát."
      />

      <SettingCard
        title="Tin nhắn tự động ngoài giờ"
        desc="Phản hồi khách hàng trong khung giờ Shop tạm nghỉ."
        isActive={activeOffTime}
        onToggle={async () => {
          const newState = !activeOffTime;
          setActiveOffTime(newState);
          await handleUpdateShopSettings({ isOfflineMessageEnabled: newState });
        }}
        isEditing={editingOffTime}
        onEdit={() => setEditingOffTime(!editingOffTime)}
        value={textOffTime}
        onSave={(val: string, config: any) =>
          handleSaveSettings("OFFTIME", val, config)
        }
        isLoading={saving}
        showTimeAction
        workingConfig={workingConfig}
        placeholder="Hiện tại Shop đang trong giờ nghỉ, chúng tôi sẽ sớm quay lại hỗ trợ bạn."
      />
    </div>
  );
};
