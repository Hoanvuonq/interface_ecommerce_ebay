"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { SettingCard } from "../../_components/SettingCard";

export const SettingsAutoMessage = () => {
  const [activeStandard, setActiveStandard] = useState(true);
  const [activeOffTime, setActiveOffTime] = useState(false);

  const [editingStandard, setEditingStandard] = useState(false);
  const [editingOffTime, setEditingOffTime] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-4xl p-6 flex items-start gap-5 shadow-xl shadow-gray-200/40 relative overflow-hidden group border border-orange-50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-125" />
        
        <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-200 shrink-0 relative z-10">
          <Info size={22} />
        </div>
        
        <div className="space-y-2 relative z-10">
          <p className="text-xs font-bold uppercase text-slate-800 tracking-wider">
            Quy tắc phản hồi hệ thống
          </p>
          <ul className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed space-y-1.5 tracking-tight">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-orange-400 rounded-full" />
              Trả lời tự động tiêu chuẩn kích hoạt 24h một lần cho mỗi khách hàng.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-orange-400 rounded-full" />
              Tin nhắn ngoài giờ chỉ gửi trong khung giờ nghỉ của Shop.
            </li>
          </ul>
        </div>
      </div>

      <SettingCard
        title="Tin nhắn tự động tiêu chuẩn"
        desc="Chào mừng khách hàng ngay khi họ bắt đầu phiên trò chuyện mới."
        isActive={activeStandard}
        onToggle={() => setActiveStandard(!activeStandard)}
        isEditing={editingStandard}
        onEdit={() => setEditingStandard(!editingStandard)}
        placeholder="Chào mừng bạn đến với shop! Hãy để lại lời nhắn, chúng tôi sẽ hỗ trợ bạn ngay."
      />

      <SettingCard
        title="Tin nhắn tự động ngoài giờ"
        desc="Phản hồi tự động khi có người liên hệ trong thời gian shop tạm nghỉ."
        isActive={activeOffTime}
        onToggle={() => setActiveOffTime(!activeOffTime)}
        isEditing={editingOffTime}
        onEdit={() => setEditingOffTime(!editingOffTime)}
        showTimeAction
        placeholder="Cảm ơn bạn! Hiện tại shop đang trong giờ nghỉ, chúng tôi sẽ phản hồi bạn vào lúc 8:00 sáng mai."
      />
    </div>
  );
};