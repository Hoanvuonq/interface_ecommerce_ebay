"use client";

import { FileText, Sparkles, ShieldCheck, Leaf, Activity } from "lucide-react";
import { cn } from "@/utils/cn";

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({
  description,
}: ProductDescriptionProps) => {
  const highlights = [
    {
      icon: Leaf,
      title: "Chất liệu sạch",
      desc: "100% Cao su thiên nhiên, thoáng khí chuẩn sinh thái.",
    },
    {
      icon: Activity,
      title: "Độ đàn hồi",
      desc: "Nâng đỡ cột sống tối ưu, chống xẹp lún tuyệt đối.",
    },
    {
      icon: Sparkles,
      title: "Công nghệ",
      desc: "Kháng khuẩn, chống nấm mốc, an toàn cho da nhạy cảm.",
    },
    {
      icon: ShieldCheck,
      title: "Bảo hành",
      desc: "Chính hãng 10 năm, cam kết độ bền vượt trội.",
    },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-custom-lg border border-orange-50 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-50 rounded-2xl text-orange-500 shadow-inner">
          <FileText size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-bold uppercase tracking-tighter text-slate-800 italic leading-none">
            Mô tả chi tiết
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            Technical Specifications & Details
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative group">
        <div
          className={cn(
            "prose max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line",
            "prose-headings:text-slate-900 prose-headings:font-bold prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter",
            "prose-strong:text-orange-600 prose-strong:font-bold",
            "prose-img:rounded-4xl prose-img:shadow-xl",
          )}
          dangerouslySetInnerHTML={{
            __html:
              description ||
              "<i>Nội dung mô tả sản phẩm đang được cập nhật...</i>",
          }}
        />
      </div>

      {/* Highlights Section - Tái cấu trúc thành Grid để chuẩn Web3 Dashboard */}
      <div className="mt-10 pt-10 border-t border-slate-50">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={16} className="text-orange-500 animate-pulse" />
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest italic">
            Điểm nổi bật của sản phẩm
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
            >
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <item.icon size={20} />
              </div>
              <div className="space-y-0.5 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 leading-snug font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-8 p-4 bg-orange-500/5 rounded-2xl border border-orange-50 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
          Xác minh bởi hệ thống kiểm duyệt sàn
        </p>
      </div>
    </div>
  );
};
