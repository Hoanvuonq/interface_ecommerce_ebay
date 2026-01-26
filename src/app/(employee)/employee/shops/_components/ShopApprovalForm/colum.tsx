import { Column } from "@/components/DataTable/type";
import {
  Shop,
  ShopStatus,
  colorMap,
  labelMap,
} from "../../_types/manager.shop.type";
import { cn } from "@/utils/cn";
import { User, Calendar, CheckCircle, XCircle, Eye } from "lucide-react";
import Image from "next/image"; // Import component Image chuẩn

interface ShopColumnProps {
  page: number;
  size: number;
  onApprove: (id: string) => void;
  onReject: (shop: Shop) => void;
  onView: (shop: Shop) => void;
}

export const getShopColumns = ({
  page,
  size,
  onApprove,
  onReject,
  onView,
}: ShopColumnProps): Column<Shop>[] => [
  {
    header: "STT",
    align: "center",
    render: (_, index) => (
      <span className="text-gray-400 font-bold text-[11px]">
        {String(page * size + index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    header: "Thông tin cửa hàng",
    render: (row) => (
      <div className="flex items-center gap-4">
        {/* Container cho Image phải có position relative khi dùng layout fill */}
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border-2 border-white shadow-sm overflow-hidden shrink-0 relative group">
          {row.logoUrl ? (
            <Image
              src={row.logoUrl}
              alt={`${row.shopName} logo`}
              fill
              sizes="48px" // Tối ưu kích thước tải ảnh (w-12 = 48px)
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={false} // Ảnh trong table không cần ưu tiên cao trừ khi là hàng đầu tiên
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold italic bg-gray-100">
              SHOP
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-800 tracking-tight leading-none truncate uppercase italic group-hover:text-orange-600 transition-colors">
            {row.shopName}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <User size={10} className="text-orange-500" />
            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase truncate max-w-30">
              {row.username}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (row) => (
      <span
        className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white shadow-sm ring-1 ring-white/20"
        style={{ backgroundColor: colorMap[row.status as ShopStatus] }}
      >
        {labelMap[row.status as ShopStatus]}
      </span>
    ),
  },
  {
    header: "Kiểm duyệt",
    render: (row) => (
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter flex items-center gap-1">
          By: <span className="text-gray-900">{row.verifyBy || "System"}</span>
        </p>
        <div className="flex items-center gap-1 text-gray-400 text-[9px] font-medium">
          <Calendar size={10} />
          {row.verifyDate
            ? new Date(row.verifyDate).toLocaleDateString("vi-VN")
            : "--/--/--"}
        </div>
      </div>
    ),
  },
  {
    header: "Thao tác thực thi",
    align: "right",
    render: (row) => (
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pr-2">
        {row.status === "PENDING" && (
          <>
            <button
              onClick={() => onApprove(row.shopId)}
              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm ring-1 ring-emerald-100"
              title="Duyệt Shop"
            >
              <CheckCircle size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onReject(row)}
              className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm ring-1 ring-rose-100"
              title="Từ chối"
            >
              <XCircle size={16} strokeWidth={2.5} />
            </button>
          </>
        )}
        <button
          onClick={() => onView(row)}
          className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-orange-600 transition-all font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95"
        >
          <Eye size={12} strokeWidth={3} /> Chi tiết
        </button>
      </div>
    ),
  },
];
