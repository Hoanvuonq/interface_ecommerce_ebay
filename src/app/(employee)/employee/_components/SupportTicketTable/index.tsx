import React from "react";
import { Users, ArrowUpRight } from "lucide-react";
import { CardComponents } from "@/components/card";
import { TicketStatusBadge } from "../../_common/StatusBadges";
import { cn } from "@/utils/cn";

interface SupportTicket {
  key: string | number;
  ticketId: string;
  customer: string;
  issue: string;
  status: any;
  createdAt: string;
}

interface SupportTicketTableProps {
  tickets: SupportTicket[];
}

export const SupportTicketTable: React.FC<SupportTicketTableProps> = ({
  tickets,
}) => {
  return (
    <CardComponents
      className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-orange-600 rounded-xl">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none mb-1">
                Support Queue
              </span>
              <span className="font-black text-slate-800 tracking-tight text-sm">
                HỖ TRỢ KHÁCH HÀNG
              </span>
            </div>
          </div>
          <button className="text-xs font-bold text-slate-400 hover:text-orange-600 flex items-center gap-1 transition-colors">
            Tất cả ticket <ArrowUpRight size={14} />
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
            <tr>
              {[
                "Ticket ID",
                "Khách hàng",
                "Vấn đề",
                "Trạng thái",
                "Thời gian",
                "",
              ].map((h, i) => (
                <th key={i} className="px-6 py-4 font-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tickets.map((ticket) => (
              <tr
                key={ticket.key}
                className="hover:bg-blue-50/20 transition-all duration-200 group"
              >
                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                  #{ticket.ticketId}
                </td>
                <td className="px-6 py-4 font-bold text-slate-700 text-sm">
                  {ticket.customer}
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm max-w-50 truncate font-medium">
                  {ticket.issue}
                </td>
                <td className="px-6 py-4">
                  <TicketStatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-400">
                  {ticket.createdAt}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className={cn(
                      "text-[11px] font-black uppercase text-orange-600 hover:text-white hover:bg-orange-600",
                      "px-4 py-2 rounded-xl transition-all border border-orange-100 hover:border-orange-600 hover:shadow-lg hover:shadow-orange-200"
                    )}
                  >
                    Xử lý
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tickets.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-medium text-sm">
            Không có yêu cầu hỗ trợ nào.
          </p>
        </div>
      )}
    </CardComponents>
  );
};
