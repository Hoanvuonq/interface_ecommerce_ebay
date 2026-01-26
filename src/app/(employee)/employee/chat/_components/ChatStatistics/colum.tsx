/* eslint-disable @next/next/no-img-element */
import { Column } from "@/components/DataTable/type";
import { MessageSquare, Users, Trophy, Calendar } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";
import { cn } from "@/utils/cn";

export const getTopUserColumns = (): Column<any>[] => [
  {
    header: "Thứ hạng",
    align: "center",
    render: (_, index) => {
      const isTop3 = index < 3;
      const trophyColors = ["text-yellow-500", "text-slate-400", "text-amber-700"];
      
      return (
        <div className="flex items-center justify-center gap-2">
          {isTop3 && (
            <Trophy 
              size={16} 
              className={cn("animate-bounce-slow", trophyColors[index])} 
              fill="currentColor" 
            />
          )}
          <span className={cn(
            "font-bold text-sm italic",
            isTop3 ? trophyColors[index] : "text-gray-400"
          )}>
            #{index + 1}
          </span>
        </div>
      );
    },
  },
  {
    header: "Người dùng",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-orange-50 border-2 border-white shadow-sm shrink-0">
          {row.userAvatar ? (
            <Image
              src={row.userAvatar}
              alt={row.userName}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-500 font-bold uppercase text-xs">
              {row.userName?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight">
            {row.userName}
          </span>
          <span className="text-[10px] font-medium text-gray-400 font-mono truncate uppercase tracking-tighter">
            ID: {row.userId.split("-")[0]}...
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Lưu lượng tin",
    align: "right",
    render: (row) => (
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5 text-orange-600 font-bold text-sm italic">
          <MessageSquare size={14} strokeWidth={3} />
          {row.messageCount.toLocaleString()}
        </div>
        <span className="text-[9px] font-bold uppercase text-gray-300 tracking-widest leading-none mt-1">
          Messages sent
        </span>
      </div>
    ),
  },
  {
    header: "Hội thoại",
    align: "right",
    render: (row) => (
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm italic">
          <Users size={14} strokeWidth={3} />
          {row.conversationCount.toLocaleString()}
        </div>
        <span className="text-[9px] font-bold uppercase text-gray-300 tracking-widest leading-none mt-1">
          Active Chats
        </span>
      </div>
    ),
  },
  {
    header: "Hoạt động cuối",
    render: (row) => (
      <div className="flex items-center gap-2 text-gray-500">
        <Calendar size={12} className="text-orange-400" />
        <span className="text-[11px] font-bold tracking-tighter italic">
          {dayjs(row.lastActiveAt).format("DD/MM/YYYY HH:mm")}
        </span>
      </div>
    ),
  },
];