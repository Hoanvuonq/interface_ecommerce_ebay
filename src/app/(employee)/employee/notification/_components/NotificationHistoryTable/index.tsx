"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaHistory, FaFilter } from "react-icons/fa";
import { DataTable, SelectComponent, FormInput } from "@/components";
import notificationService, { type BroadcastHistoryRecord } from "@/layouts/header/_service/notification.service";
import { getNotificationColumns } from "./columns";

export const  NotificationHistoryTable = ()=> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BroadcastHistoryRecord[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  
  // States cho phân trang (DataTable của bạn dùng 0-indexed cho page)
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Filters
  const [audienceFilter, setAudienceFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState("");

  const columns = getNotificationColumns();

  useEffect(() => {
    fetchNotifications();
  }, [page, audienceFilter, typeFilter, searchText]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const pageData = await notificationService.getBroadcastHistory({
        page: page,
        size: size,
        targetAudience: audienceFilter as any,
        type: typeFilter as any,
        searchText: searchText || undefined,
        // Phần dateRange bạn có thể tích hợp thêm một component DatePicker tùy chỉnh sau
      });

      setData(pageData.content || []);
      setTotalElements(pageData.totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const headerContent = (
    <div className="flex flex-col w-full gap-4">
      {/* Title Section */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
          <FaHistory className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Lịch sử thông báo</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Broadcast Management</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-2 rounded-3xl border border-gray-100 shadow-custom">
        <div className="relative group">
          <FormInput
            placeholder="Tìm theo tiêu đề..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-11 border-none bg-gray-50 group-hover:bg-white"
            containerClassName="space-y-0"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
        </div>

        <SelectComponent
          placeholder="Tất cả đối tượng"
          options={[
            { label: "Tất cả Buyers", value: "ALL_BUYERS" },
            { label: "Tất cả Shops", value: "ALL_SHOPS" },
            { label: "Tất cả Users", value: "ALL_USERS" },
          ]}
          value={audienceFilter}
          onChange={(val) => {
             setAudienceFilter(val as string);
             setPage(0);
          }}
          className="h-12"
        />

        <SelectComponent
          placeholder="Loại thông báo"
          options={[
            { label: "Hệ thống", value: "SYSTEM" },
            { label: "Đơn hàng", value: "ORDER" },
            { label: "Sản phẩm", value: "PRODUCT" },
            { label: "Thanh toán", value: "PAYMENT" },
            { label: "Vận chuyển", value: "SHIPPING" },
          ]}
          value={typeFilter}
          onChange={(val) => {
            setTypeFilter(val as string);
            setPage(0);
          }}
        />

        <button 
           onClick={() => {
              setSearchText("");
              setAudienceFilter(undefined);
              setTypeFilter(undefined);
              setPage(0);
           }}
           className="h-12 rounded-2xl bg-gray-50 text-gray-500 font-bold text-xs hover:bg-orange-50 hover:text-orange-500 transition-all border border-transparent hover:border-orange-200"
        >
          LÀM MỚI BỘ LỌC
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-[#fafafa] min-h-screen">
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        headerContent={headerContent}
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={setPage}
        rowKey="id"
        emptyMessage="Không tìm thấy lịch sử thông báo nào"
      />
    </div>
  );
}