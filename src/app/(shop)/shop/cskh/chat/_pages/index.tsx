import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Zap,
  HelpCircle,
  ChevronRight,
  BarChart3,
  Clock,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { GuideList, AssistantCard, StatItem } from "../_components";
import { containerVariants } from "../_types/varion.type";

export const ShopChatManagerScreen = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen space-y-6 animate-in fade-in duration-500 pb-10"
    >
      <section className="relative overflow-hidden bg-white/60 backdrop-blur-md rounded-4xl shadow-custom">
        <div className="px-6 py-3 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-200">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Hiệu quả Chat
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-orange-400 font-bold">
                Analytics Overview
              </p>
            </div>
          </div>
          <button className="group flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600 transition-all">
            Chi tiết{" "}
            <ChevronRight
              size={16}
              className="group-hover:trangray-x-1 transition-transform"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-orange-50 p-8">
          <StatItem
            label="Lượt chat"
            value="1,284"
            subValue="+12.5% so với tháng trước"
            icon={<MessageCircle size={20} className="text-orange-400" />}
          />
          <StatItem
            label="Tỷ lệ phản hồi"
            value="98.2%"
            subValue="Rất tốt (Trên mức trung bình)"
            icon={<BarChart3 size={20} className="text-orange-400" />}
          />
          <StatItem
            label="Thời gian phản hồi"
            value="00:01:15"
            subValue="Nhanh hơn 30s so với 30 ngày qua"
            icon={<Clock size={20} className="text-orange-400" />}
          />
        </div>
      </section>

      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight italic uppercase">
            Trợ lý Chat
          </h2>
          <div className="h-1 flex-1 bg-linear-to-r from-orange-200 to-transparent rounded-full opacity-30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AssistantCard
            title="Tin nhắn tự động"
            desc="Tự động gửi lời chào ngay khi khách hàng bắt đầu phiên chat mới."
            btnText="Thiết lập ngay"
            icon={<Zap size={26} />}
            gradient="from-orange-400 to-orange-500"
          />
          <AssistantCard
            title="Tin nhắn nhanh"
            desc="Tạo phím tắt cho các câu hỏi thường gặp để phản hồi trong 1 giây."
            btnText="Chỉnh sửa"
            icon={<MessageSquare size={26} />}
            gradient="from-orange-500 to-orange-600"
          />
          <AssistantCard
            title="Hỏi - Đáp Thông minh"
            desc="Hệ thống tự nhận diện từ khóa và gợi ý câu trả lời chính xác."
            btnText="Nâng cấp AI"
            icon={<HelpCircle size={26} />}
            gradient="from-gray-700 to-gray-900"
          />
        </div>
      </div>

      <section className="bg-gray-50/50 rounded-4xl border border-gray-200/60 p-8 shadow-custom space-y-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-orange-500 rounded-full" />
          Trung tâm hỗ trợ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <GuideList
            items={[
              { text: "Tính năng Chat là gì?", hot: false },
              { text: "Quy định cộng đồng", hot: false },
            ]}
          />
          <GuideList
            items={[
              { text: "Mẹo tăng tỷ lệ phản hồi", hot: true },
              { text: "Cách dùng tin nhắn nhanh", hot: false },
            ]}
          />
          <GuideList
            items={[
              { text: "Tích hợp chatbot AI", hot: true },
              { text: "Báo cáo vi phạm", hot: false },
            ]}
          />
        </div>
      </section>
    </motion.div>
  );
};
